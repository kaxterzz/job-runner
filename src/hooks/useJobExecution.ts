import { useState, useEffect, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning' | 'param' | 'file'
}

interface JobData {
  inputFields: Array<{ field: string; value: string }>
  uploadedFiles: Array<{ id: string; name: string; size: number; extension: string }>
}

interface JobResults {
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
  status: 'idle' | 'queued' | 'running' | 'completed' | 'failed'
  progress: number
  logs: LogEntry[]
  results: JobResults | null
  jobId: string | null
  isConnected: boolean
}

const SERVER_URL = 'http://localhost:3001'

export function useJobExecution() {
  const [state, setState] = useState<JobExecutionState>({
    status: 'idle',
    progress: 0,
    logs: [],
    results: null,
    jobId: null,
    isConnected: false
  })

  const socketRef = useRef<Socket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Socket.IO connection
  useEffect(() => {
    connectSocket()

    return () => {
      disconnectSocket()
    }
  }, [])

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) return

    socketRef.current = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('✅ Connected to job server')
      setState(prev => ({ ...prev, isConnected: true }))
      toast.success('Connected to job server')
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from job server:', reason)
      setState(prev => ({ ...prev, isConnected: false }))
      
      if (reason === 'io server disconnect') {
        toast.error('Server disconnected')
      } else {
        toast.warning('Connection lost, trying to reconnect...')
      }
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      setState(prev => ({ ...prev, isConnected: false }))
      
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          toast.error('Failed to connect to job server')
        }, 5000)
      }
    })

    // Job-specific event listeners
    socket.on('job-status-update', (data) => {
      console.log('Job status update:', data)
      setState(prev => ({
        ...prev,
        status: data.status,
        progress: data.progress,
        results: data.results || prev.results
      }))

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
      setState(prev => ({
        ...prev,
        logs: [...prev.logs, data.log],
        progress: data.progress
      }))
    })

    socket.on('job-progress', (data) => {
      setState(prev => ({
        ...prev,
        progress: data.progress
      }))

      // Show progress in toast for significant milestones
      if (data.progress % 25 === 0 && data.progress > 0 && data.progress < 100) {
        toast.info(`Job Progress: ${data.progress}%`, {
          description: 'Job execution in progress...'
        })
      }
    })

    socket.on('job-completed', (data) => {
      console.log('Job completed:', data)
      setState(prev => ({
        ...prev,
        results: data.results
      }))
    })
  }, [])

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  // Execute a job
  const executeJob = useCallback(async (jobData: JobData) => {
    try {
      setState(prev => ({
        ...prev,
        status: 'queued',
        progress: 0,
        logs: [],
        results: null
      }))

      const response = await fetch(`${SERVER_URL}/api/jobs/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error('Failed to start job execution')
      }

      const jobId = result.jobId
      setState(prev => ({ ...prev, jobId }))

      // Subscribe to job updates
      if (socketRef.current) {
        socketRef.current.emit('subscribe-to-job', jobId)
      }

      return { success: true, jobId }
    } catch (error) {
      console.error('Job execution error:', error)
      setState(prev => ({ ...prev, status: 'failed' }))
      toast.error('Failed to start job execution')
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [])

  // Cancel job (if running)
  const cancelJob = useCallback(() => {
    if (state.jobId && socketRef.current) {
      socketRef.current.emit('unsubscribe-from-job', state.jobId)
    }
    
    setState(prev => ({
      ...prev,
      status: 'idle',
      progress: 0,
      jobId: null
    }))
    
    toast.info('Job cancelled')
  }, [state.jobId])

  // Clear logs
  const clearLogs = useCallback(() => {
    setState(prev => ({ ...prev, logs: [] }))
  }, [])

  // Get job details
  const getJobDetails = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/jobs/${jobId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching job details:', error)
      return null
    }
  }, [])

  return {
    // State
    status: state.status,
    progress: state.progress,
    logs: state.logs,
    results: state.results,
    jobId: state.jobId,
    isConnected: state.isConnected,
    isRunning: state.status === 'running' || state.status === 'queued',
    
    // Actions
    executeJob,
    cancelJob,
    clearLogs,
    getJobDetails,
    
    // Connection management
    connectSocket,
    disconnectSocket,
  }
}