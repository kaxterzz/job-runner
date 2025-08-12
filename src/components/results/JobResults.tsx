import { motion } from 'framer-motion'
import { Download, FileText, BarChart3, Clock, Users, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

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

interface JobResultsProps {
  results: JobResults
  className?: string
}

const getFileIcon = (fileName: string) => {
  if (fileName.toLowerCase().includes('violation')) {
    return <AlertTriangle className="w-5 h-5 text-red-500" />
  }
  if (fileName.toLowerCase().includes('ic') || fileName.toLowerCase().includes('document')) {
    return <FileText className="w-5 h-5 text-blue-500" />
  }
  return <FileText className="w-5 h-5 text-gray-500" />
}

export default function JobResults({ results, className = '' }: JobResultsProps) {
  const handleDownload = (report: any) => {
    // Mock download functionality - no actual download
    console.log('Mock download:', report.name)
    // Using # as placeholder - no actual download in demo
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">Job Completed Successfully!</h2>
        <p className="text-muted-foreground">{results.summary}</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 text-center">
            <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{results.metrics.filesProcessed}</div>
            <div className="text-xs text-muted-foreground">Files Processed</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 text-center">
            <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{results.metrics.parametersUsed}</div>
            <div className="text-xs text-muted-foreground">Parameters Used</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 text-center">
            <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{results.metrics.processingTime}</div>
            <div className="text-xs text-muted-foreground">Processing Time</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4 text-center">
            <BarChart3 className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{results.metrics.riskScore}</div>
            <div className="text-xs text-muted-foreground">Risk Score</div>
          </Card>
        </motion.div>
      </div>

      {/* Generated Reports */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Generated Reports</h3>
        <div className="space-y-3">
          {results.reports.map((report, index) => (
            <motion.div
              key={report.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(report.name)}
                <div>
                  <h4 className="font-medium text-foreground">{report.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{report.type}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(report)}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-muted/30 border border-border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-3">Next Steps</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            Review the generated Investment Committee documentation
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            Examine any compliance violations found during analysis
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            Share reports with relevant stakeholders for review
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            Schedule follow-up meetings if additional analysis is required
          </li>
        </ul>
      </motion.div>
    </motion.div>
  )
}