import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { Square, RotateCcw } from 'lucide-react'
import DynamicInputFields from './DynamicInputFields'
import FileUpload from './FileUpload'
import Configuration from './Configuration'
import FloatingRunButton from './FloatingRunButton'
import JobTerminal from '../terminal/JobTerminal'
import JobResults from '../results/JobResults'
import { useJobStore } from '../../stores/jobStore'
import { Button } from '../ui/button'

export default function Run() {
  // Get all state and actions from the store
  const {
    status,
    logs,
    results,
    isConnected,
    uploadedFiles,
    cancelJob,
    clearLogs,
    resetJob,
    setInputFields,
    setUploadedFiles,
    setIsInputsValid,
    setIsFilesValid,
    setAllRequiredFilesUploaded
  } = useJobStore()

  const handleInputChange = useCallback((data: any[]) => {
    setInputFields(data)
  }, [setInputFields])

  const handleInputValidationChange = useCallback((isValid: boolean) => {
    setIsInputsValid(isValid)
  }, [setIsInputsValid])

  const handleFilesChange = useCallback((files: any[]) => {
    setUploadedFiles(files)
  }, [setUploadedFiles])

  const handleFilesValidationChange = useCallback((isValid: boolean) => {
    setIsFilesValid(isValid)
  }, [setIsFilesValid])

  const handleConfigurationChange = useCallback((allRequiredUploaded: boolean) => {
    setAllRequiredFilesUploaded(allRequiredUploaded)
  }, [setAllRequiredFilesUploaded])


  const handleNewRun = useCallback(() => {
    console.log('In handleNewRun func')
    resetJob()
  }, [resetJob])

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
              ⚠️ Job server unavailable. Start the backend server to enable job execution.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Run: npm run server (port 3002) or npm run dev:full
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
          <FloatingRunButton />
        </>
      )}
    </div>
  )
}