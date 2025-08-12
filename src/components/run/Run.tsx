import { motion } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import { Play, Square, RotateCcw } from 'lucide-react'
import DynamicInputFields from './DynamicInputFields'
import FileUpload from './FileUpload'
import Configuration from './Configuration'
import FloatingRunButton from './FloatingRunButton'
import JobTerminal from '../terminal/JobTerminal'
import JobResults from '../results/JobResults'
import { useJobExecution } from '../../hooks/useJobExecution'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

interface InputField {
  field: string
  value: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  extension: string
}

interface RunProps {
  onRunClick?: () => void
  onStateChange?: (isReady: boolean) => void
}

export default function Run({ onRunClick, onStateChange }: RunProps) {
  const [inputFields, setInputFields] = useState<InputField[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isInputsValid, setIsInputsValid] = useState(false)
  const [isFilesValid, setIsFilesValid] = useState(false)
  const [allRequiredFilesUploaded, setAllRequiredFilesUploaded] = useState(false)

  // Job execution hook
  const {
    status,
    progress,
    logs,
    results,
    isRunning,
    isConnected,
    executeJob,
    cancelJob,
    clearLogs
  } = useJobExecution()

  // Calculate if everything is ready to run
  const isReadyToRun = isInputsValid && isFilesValid && allRequiredFilesUploaded && !isRunning

  // Update parent component when state changes
  useEffect(() => {
    onStateChange?.(isReadyToRun)
  }, [isReadyToRun, onStateChange])

  const handleInputChange = useCallback((data: InputField[]) => {
    setInputFields(data)
  }, [])

  const handleInputValidationChange = useCallback((isValid: boolean) => {
    setIsInputsValid(isValid)
  }, [])

  const handleFilesChange = useCallback((files: UploadedFile[]) => {
    setUploadedFiles(files)
  }, [])

  const handleFilesValidationChange = useCallback((isValid: boolean) => {
    setIsFilesValid(isValid)
  }, [])

  const handleConfigurationChange = useCallback((allRequiredUploaded: boolean) => {
    setAllRequiredFilesUploaded(allRequiredUploaded)
  }, [])

  const handleRunClick = async () => {
    if (!isReadyToRun) return

    const jobData = {
      inputFields,
      uploadedFiles
    }

    console.log('Executing job with data:', jobData)
    
    const result = await executeJob(jobData)
    
    if (result.success) {
      console.log('Job started successfully:', result.jobId)
    } else {
      console.error('Failed to start job:', result.error)
    }

    onRunClick?.()
  }

  const handleNewRun = () => {
    // Reset job state for a new run
    if (isRunning) {
      cancelJob()
    }
    clearLogs()
    
    // Reset component state to default
    setInputFields([])
    setUploadedFiles([])
    setIsInputsValid(false)
    setIsFilesValid(false)
    setAllRequiredFilesUploaded(false)
  }

  return (
    <div className="space-y-8 p-6 max-w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {status === 'completed' ? 'Job Results' : 'Run Job'}
        </h2>
        <p className="text-muted-foreground">
          {status === 'completed' 
            ? 'Your job has been completed successfully. View the results below.'
            : status === 'running' || status === 'queued'
            ? 'Job is currently executing. Watch the live updates below.'
            : 'Configure your job parameters and upload required files to begin job execution'
          }
        </p>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              ⚠️ Not connected to job server. Live updates will not be available.
            </p>
          </div>
        )}

      </motion.div>

      {/* Content based on job status */}
      {status === 'completed' && results ? (
        /* Job Results View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <JobResults results={results} />
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => handleNewRun()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Run Another Job
            </Button>
          </div>
        </motion.div>
      ) : (status === 'running' || status === 'queued') ? (
        /* Job Execution View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="destructive"
              onClick={cancelJob}
              disabled={status !== 'running' && status !== 'queued'}
            >
              <Square className="w-4 h-4 mr-2" />
              Cancel Job
            </Button>
          </div>

          {/* Live Terminal Logs */}
          <JobTerminal
            logs={logs}
            isRunning={status === 'running'}
            jobStatus={status}
            onClear={clearLogs}
            onCopy={() => console.log('Logs copied to clipboard')}
          />
        </motion.div>
      ) : (
        /* Job Configuration View */
        <>
          {/* Dynamic Input Fields - Full Width */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <DynamicInputFields
              onChange={handleInputChange}
              onValidationChange={handleInputValidationChange}
            />
          </motion.div>

          {/* File Upload and Configuration - Side by Side */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6"
          >
            {/* File Upload Component - Left Side */}
            <div className="h-[600px]">
              <FileUpload
                onFilesChange={handleFilesChange}
                onValidationChange={handleFilesValidationChange}
              />
            </div>

            {/* Configuration Component - Right Side */}
            <div className="h-[600px]">
              <Configuration
                uploadedFiles={uploadedFiles}
                onConfigurationChange={handleConfigurationChange}
              />
            </div>
          </motion.div>

          {/* Floating Action Button */}
          <FloatingRunButton
            show={isReadyToRun}
            onClick={handleRunClick}
          />
        </>
      )}
    </div>
  )
}