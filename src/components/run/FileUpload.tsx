import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, FileSpreadsheet, File, AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  extension: string
}

interface FileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void
  onValidationChange?: (isValid: boolean) => void
}

const MAX_FILES = 5
const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB
const ALLOWED_EXTENSIONS = ['csv', 'xlsx', 'pdf', 'doc', 'docx']

const getFileIcon = (extension: string) => {
  switch (extension) {
    case 'csv':
    case 'xlsx':
      return FileSpreadsheet
    case 'pdf':
      return FileText
    case 'doc':
    case 'docx':
      return FileText
    default:
      return File
  }
}

const getFileIconColor = (extension: string) => {
  switch (extension) {
    case 'csv':
      return 'text-green-500 bg-green-100 dark:bg-green-900/30'
    case 'xlsx':
      return 'text-green-600 bg-green-100 dark:bg-green-900/30'
    case 'pdf':
      return 'text-red-500 bg-red-100 dark:bg-red-900/30'
    case 'doc':
    case 'docx':
      return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
    default:
      return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30'
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function FileUpload({ onFilesChange, onValidationChange }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateParent = useCallback((newFiles: UploadedFile[]) => {
    onFilesChange?.(newFiles)
    onValidationChange?.(newFiles.length > 0 && newFiles.length <= MAX_FILES)
  }, [onFilesChange, onValidationChange])

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return `${file.name}: Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed`
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File size must be less than 3MB`
    }
    
    return null
  }

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = []
    const newErrors: string[] = []

    if (files.length + fileList.length > MAX_FILES) {
      newErrors.push(`Maximum ${MAX_FILES} files allowed`)
      setErrors(newErrors)
      return
    }

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
        return
      }

      const extension = file.name.split('.').pop()?.toLowerCase() || ''
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        extension
      }

      // Check for duplicates
      if (!files.some(f => f.name === file.name && f.size === file.size)) {
        newFiles.push(uploadedFile)
      }
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setTimeout(() => setErrors([]), 5000)
    } else {
      setErrors([])
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      updateParent(updatedFiles)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    processFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
      // Reset input
      e.target.value = ''
    }
  }

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id)
    setFiles(updatedFiles)
    updateParent(updatedFiles)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const progressPercentage = Math.min((files.length / MAX_FILES) * 100, 100)
  const progressColor = files.length >= 4 ? 'bg-amber-500' : files.length === MAX_FILES ? 'bg-red-500' : 'bg-primary'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Runtime Input File Upload</h3>
        <div className="text-sm text-muted-foreground">
          {files.length} / {MAX_FILES} files
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="relative">
          <Progress value={progressPercentage} className="h-2" />
          <div 
            className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Upload progress: {files.length} of {MAX_FILES} files
          {files.length >= 4 && files.length < MAX_FILES && (
            <span className="text-amber-600 ml-1">• Nearly full</span>
          )}
          {files.length === MAX_FILES && (
            <span className="text-red-600 ml-1">• Maximum reached</span>
          )}
        </p>
      </div>

      {/* Drag and Drop Area */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={openFileDialog}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragOver 
            ? 'border-primary bg-primary/10 scale-105' 
            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
          }
          ${files.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{ minHeight: '120px' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={files.length >= MAX_FILES}
        />

        <motion.div
          animate={{ y: isDragOver ? -5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className={`font-medium ${isDragOver ? 'text-primary' : 'text-foreground'}`}>
            {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse • CSV, XLSX, PDF, DOC • Max 3MB each
          </p>
        </motion.div>
      </motion.div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-destructive">{error}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files List */}
      <div className="flex-1 mt-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Uploaded Files</h4>
        <div className="max-h-48 overflow-y-auto space-y-2 border border-border rounded-lg p-2 bg-muted/20">
          <AnimatePresence>
            {files.length > 0 ? (
              files.map((file, index) => {
                const Icon = getFileIcon(file.extension)
                const iconColor = getFileIconColor(file.extension)
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 bg-card rounded-md border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-md ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file.id)
                      }}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No files uploaded yet</p>
                <p className="text-xs">Upload files to see them listed here</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}