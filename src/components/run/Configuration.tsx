import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Check, FileText, AlertTriangle } from 'lucide-react'

interface ConfigFile {
  id: string
  name: string
  required: boolean
  uploaded: boolean
}

interface ConfigurationProps {
  uploadedFiles?: Array<{ name: string; extension: string }>
  onConfigurationChange?: (allRequiredUploaded: boolean) => void
}

const BASE_DEFINITION_FILES: ConfigFile[] = [
  { id: '1', name: 'Investor Policy Documentation', required: true, uploaded: false },
  { id: '2', name: 'Due Diligence Checks', required: true, uploaded: false },
  { id: '4', name: 'TDD.pdf', required: true, uploaded: false },
  { id: '5', name: 'Cash Flow Statements.pdf', required: false, uploaded: false },
]

export default function Configuration({ uploadedFiles = [], onConfigurationChange }: ConfigurationProps) {
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>(BASE_DEFINITION_FILES)

  // Check which files are uploaded based on uploaded files
  useEffect(() => {
    const updatedConfigFiles = configFiles.map(configFile => {
      // Check if any uploaded file matches this config file name (partial match)
      const isUploaded = uploadedFiles.some(uploadedFile => {
        const configName = configFile.name.toLowerCase()
        const uploadedName = uploadedFile.name.toLowerCase()

        // Check for exact name match or partial match for common file patterns
        if (configName.includes('investor policy') && uploadedName.includes('investor')) return true
        if (configName.includes('due diligence') && uploadedName.includes('due diligence')) return true
        if (configName.includes('tdd') && uploadedName.includes('tdd')) return true
        if (configName.includes('cash flow') && uploadedName.includes('cash flow')) return true

        // Exact name match (without extension)
        const configNameWithoutExt = configName.replace(/\.(pdf|doc|docx|csv|xlsx)$/i, '')
        const uploadedNameWithoutExt = uploadedName.replace(/\.(pdf|doc|docx|csv|xlsx)$/i, '')

        return configNameWithoutExt === uploadedNameWithoutExt
      })

      return {
        ...configFile,
        uploaded: isUploaded
      }
    })

    setConfigFiles(updatedConfigFiles)

    // Check if all required files are uploaded
    const allRequiredUploaded = updatedConfigFiles
      .filter(file => file.required)
      .every(file => file.uploaded)

    onConfigurationChange?.(allRequiredUploaded)
  }, [uploadedFiles, onConfigurationChange])

  const requiredFiles = configFiles.filter(file => file.required)
  const optionalFiles = configFiles.filter(file => !file.required)
  const uploadedRequiredCount = requiredFiles.filter(file => file.uploaded).length
  const totalRequiredCount = requiredFiles.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Base Definition Files</h3>
        <div className="text-sm text-muted-foreground">
          {uploadedRequiredCount} / {totalRequiredCount} required
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          {uploadedRequiredCount === totalRequiredCount ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          )}
          <span className="text-sm font-medium">
            {uploadedRequiredCount === totalRequiredCount
              ? 'All required files uploaded'
              : `${totalRequiredCount - uploadedRequiredCount} required files missing`}
          </span>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary rounded-full h-2 transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${(uploadedRequiredCount / totalRequiredCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Configuration Files List */}
      <div className="flex-1 overflow-hidden">
        <div className="max-h-full overflow-y-auto space-y-3 pr-2">
          {/* Required Files Section */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              Required Files
              <span className="text-xs text-muted-foreground">({uploadedRequiredCount}/{totalRequiredCount})</span>
            </h4>

            <div className="space-y-2">
              {requiredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border transition-all duration-300
                    ${file.uploaded
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-card border-border hover:bg-muted/50'
                    }
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                    ${file.uploaded
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {file.uploaded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`
                      text-sm font-medium transition-colors duration-300
                      ${file.uploaded ? 'text-green-700 dark:text-green-300' : 'text-foreground'}
                    `}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.uploaded ? 'Uploaded' : 'Required for job execution'}
                    </p>
                  </div>

                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium transition-all duration-300
                    ${file.uploaded
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                      : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                    }
                  `}>
                    {file.uploaded ? 'Complete' : 'Required'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Optional Files Section */}
          {optionalFiles.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Optional Files</h4>

              <div className="space-y-2">
                {optionalFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (requiredFiles.length + index) * 0.1 }}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border transition-all duration-300
                      ${file.uploaded
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-card border-border hover:bg-muted/50'
                      }
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                      ${file.uploaded
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {file.uploaded ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`
                        text-sm font-medium transition-colors duration-300
                        ${file.uploaded ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}
                      `}>
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.uploaded ? 'Uploaded' : 'Optional enhancement file'}
                      </p>
                    </div>

                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium transition-all duration-300
                      ${file.uploaded
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {file.uploaded ? 'Added' : 'Optional'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}