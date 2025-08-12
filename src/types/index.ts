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

export interface JobExecutionState {
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
  socket: any | null
  reconnectTimeout: NodeJS.Timeout | null
}

export interface JobActions {
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

export type JobStore = JobExecutionState & JobActions