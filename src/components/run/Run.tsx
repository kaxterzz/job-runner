import { motion } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import DynamicInputFields from './DynamicInputFields'
import FileUpload from './FileUpload'
import Configuration from './Configuration'
import FloatingRunButton from './FloatingRunButton'

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

  // Calculate if everything is ready to run
  const isReadyToRun = isInputsValid && isFilesValid && allRequiredFilesUploaded

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

  const handleRunClick = () => {
    console.log('Running job with:', {
      inputFields,
      uploadedFiles,
      readyState: {
        inputsValid: isInputsValid,
        filesValid: isFilesValid,
        allRequiredUploaded: allRequiredFilesUploaded
      }
    })
    onRunClick?.()
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
        <h2 className="text-2xl font-bold text-foreground mb-2">Run Job</h2>
        <p className="text-muted-foreground">
          Configure your job parameters and upload required files to begin job execution
        </p>
      </motion.div>

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
    </div>
  )
}