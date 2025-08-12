import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

export interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning' | 'param' | 'file'
}

export interface InputField {
  field: string
  value: string
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  extension: string
}

export interface JobData {
  inputFields: InputField[]
  uploadedFiles: UploadedFile[]
}

export interface JobResults {
  summary: string
  reports: Array<{
    name: string
    type: string
    size: string
    downloadUrl: string
  }>
  metrics: {
    filesProcessed: number
    parametersUsed: number
    processingTime: string
    riskScore: string
  }
}

interface JobExecutionState {
  // Job execution state
  status: 'idle' | 'queued' | 'running' | 'completed' | 'failed'
  progress: number
  logs: LogEntry[]
  results: JobResults | null
  jobId: string | null
  isConnected: boolean
  
  // Job configuration state
  inputFields: InputField[]
  uploadedFiles: UploadedFile[]
  isInputsValid: boolean
  isFilesValid: boolean
  allRequiredFilesUploaded: boolean
  
  // Computed state
  isRunning: boolean
  isReadyToRun: boolean
  
  // Socket connection
  socket: Socket | null
  reconnectTimeout: NodeJS.Timeout | null
}

interface JobActions {
  // Job configuration actions
  setInputFields: (fields: InputField[]) => void
  setUploadedFiles: (files: UploadedFile[]) => void
  setIsInputsValid: (valid: boolean) => void
  setIsFilesValid: (valid: boolean) => void
  setAllRequiredFilesUploaded: (uploaded: boolean) => void
  
  // Job execution actions
  executeJob: (jobData: JobData) => Promise<{ success: boolean; jobId?: string; error?: string }>
  cancelJob: () => void
  resetJob: () => void
  clearLogs: () => void
  
  // Socket connection actions
  connectSocket: () => void
  disconnectSocket: () => void
  
  // Computed state updaters
  updateComputedState: () => void
}

type JobStore = JobExecutionState & JobActions

const SERVER_URL = 'http://localhost:3002'

export const useJobStore = create<JobStore>((set, get) => ({
  // Initial state
  status: 'idle',
  progress: 0,
  logs: [],
  results: null,
  jobId: null,
  isConnected: false,
  inputFields: [],
  uploadedFiles: [],
  isInputsValid: false,
  isFilesValid: false,
  allRequiredFilesUploaded: false,
  isRunning: false,
  isReadyToRun: false,
  socket: null,
  reconnectTimeout: null,

  // Actions
  setInputFields: (fields) => {
    set({ inputFields: fields })
    get().updateComputedState()
  },

  setUploadedFiles: (files) => {
    set({ uploadedFiles: files })
    get().updateComputedState()
  },

  setIsInputsValid: (valid) => {
    set({ isInputsValid: valid })
    get().updateComputedState()
  },

  setIsFilesValid: (valid) => {
    set({ isFilesValid: valid })
    get().updateComputedState()
  },

  setAllRequiredFilesUploaded: (uploaded) => {
    set({ allRequiredFilesUploaded: uploaded })
    get().updateComputedState()
  },

  updateComputedState: () => {
    const state = get()
    const isRunning = state.status === 'running' || state.status === 'queued'
    const isReadyToRun = state.isInputsValid && state.isFilesValid && state.allRequiredFilesUploaded && !isRunning
    
    set({ isRunning, isReadyToRun })
  },

  connectSocket: () => {
    const state = get()
    if (state.socket?.connected) return

    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 5000,
    })

    socket.on('connect', () => {
      console.log('✅ Connected to job server')
      set({ isConnected: true })
      toast.success('Connected to job server')
      
      const currentState = get()
      if (currentState.reconnectTimeout) {
        clearTimeout(currentState.reconnectTimeout)
        set({ reconnectTimeout: null })
      }
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from job server:', reason)
      set({ isConnected: false })
      
      if (reason === 'io server disconnect') {
        toast.error('Server disconnected')
      } else {
        toast.warning('Connection lost, trying to reconnect...')
      }
    })

    socket.on('connect_error', (error) => {
      console.warn('Job server connection failed:', error.message)
      set({ isConnected: false })
      
      const currentState = get()
      if (!currentState.reconnectTimeout) {
        const timeout = setTimeout(() => {
          console.warn('Job server unavailable - live updates disabled')
        }, 3000)
        set({ reconnectTimeout: timeout })
      }
    })

    socket.on('reconnect_failed', () => {
      console.warn('Failed to reconnect to job server - operating in offline mode')
      set({ isConnected: false })
    })

    // Job-specific event listeners
    socket.on('job-status-update', (data) => {
      console.log('Job status update:', data)
      set((state) => ({
        status: data.status,
        progress: data.progress,
        results: data.results || state.results
      }))
      get().updateComputedState()

      // Show toast notifications for status changes
      switch (data.status) {
        case 'queued':
          toast.info('Job queued for execution')
          break
        case 'running':
          toast.success('Job started running')
          break
        case 'completed':
          toast.success('Job completed successfully!', {
            description: 'Check the results below'
          })
          break
        case 'failed':
          toast.error('Job execution failed')
          break
      }
    })

    socket.on('job-log', (data) => {
      console.log('New job log:', data)
      set((state) => ({
        logs: [...state.logs, data.log],
        progress: data.progress
      }))
    })

    socket.on('job-progress', (data) => {
      set({ progress: data.progress })

      // Show progress in toast for significant milestones
      if (data.progress % 25 === 0 && data.progress > 0 && data.progress < 100) {
        toast.info(`Job Progress: ${data.progress}%`, {
          description: 'Job execution in progress...'
        })
      }
    })

    socket.on('job-completed', (data) => {
      console.log('Job completed:', data)
      set({ results: data.results })
    })

    set({ socket })
  },

  disconnectSocket: () => {
    const state = get()
    if (state.socket) {
      state.socket.disconnect()
      set({ socket: null })
    }
    if (state.reconnectTimeout) {
      clearTimeout(state.reconnectTimeout)
      set({ reconnectTimeout: null })
    }
  },

  executeJob: async (jobData) => {
    try {
      // Check if server is available first
      const state = get()
      if (!state.isConnected) {
        throw new Error('Job server is not available. Please start the backend server.')
      }

      set({
        status: 'queued',
        progress: 0,
        logs: [],
        results: null
      })
      get().updateComputedState()

      const response = await fetch(`${SERVER_URL}/api/jobs/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to start job execution')
      }

      const jobId = result.jobId
      set({ jobId })

      // Subscribe to job updates
      const socket = get().socket
      if (socket && socket.connected) {
        socket.emit('subscribe-to-job', jobId)
      }

      return { success: true, jobId }
    } catch (error) {
      console.error('Job execution error:', error)
      set({ status: 'failed' })
      get().updateComputedState()
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to start job: ${errorMessage}`)
      return { success: false, error: errorMessage }
    }
  },

  cancelJob: () => {
    const state = get()
    if (state.jobId && state.socket) {
      state.socket.emit('unsubscribe-from-job', state.jobId)
    }
    
    set({
      status: 'idle',
      progress: 0,
      jobId: null
    })
    get().updateComputedState()
    
    toast.info('Job cancelled')
  },

  resetJob: () => {
    const state = get()
    if (state.jobId && state.socket) {
      state.socket.emit('unsubscribe-from-job', state.jobId)
    }
    
    set({
      status: 'idle',
      progress: 0,
      logs: [],
      results: null,
      jobId: null,
      inputFields: [],
      uploadedFiles: [],
      isInputsValid: false,
      isFilesValid: false,
      allRequiredFilesUploaded: false
    })
    get().updateComputedState()
  },

  clearLogs: () => {
    set({ logs: [] })
  }
}))

// Initialize socket connection when store is created (with delay to avoid blocking)
setTimeout(() => {
  try {
    useJobStore.getState().connectSocket()
  } catch (error) {
    console.warn('Failed to initialize socket connection:', error)
  }
}, 100)