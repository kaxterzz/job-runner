import type { JobData, LogEntry } from '../types'
import { useJobStore } from '../stores/jobStore'

// Mock job execution simulation for production
export function simulateJobExecution(_jobId: string, jobData: JobData) {
  const { inputFields = [], uploadedFiles = [] } = jobData

  // Generate mock logs
  const generateMockLogs = (): LogEntry[] => {
    const logs: LogEntry[] = [
      { timestamp: new Date().toISOString(), message: '🚀 Job execution started', type: 'info' },
      { timestamp: new Date().toISOString(), message: '📋 Initializing job runner...', type: 'info' },
      { timestamp: new Date().toISOString(), message: '✅ Environment setup complete', type: 'success' }
    ]

    // Add parameter logs
    if (inputFields.length > 0) {
      logs.push({ timestamp: new Date().toISOString(), message: '📝 Processing input parameters...', type: 'info' })
      inputFields.forEach(param => {
        if (param.field && param.value) {
          logs.push({ 
            timestamp: new Date().toISOString(), 
            message: `   ├─ ${param.field}: ${param.value}`, 
            type: 'param'
          })
        }
      })
    }

    // Add file upload logs
    if (uploadedFiles.length > 0) {
      logs.push({ timestamp: new Date().toISOString(), message: '📁 Processing uploaded files...', type: 'info' })
      uploadedFiles.forEach(file => {
        logs.push({ 
          timestamp: new Date().toISOString(), 
          message: `   ├─ ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 
          type: 'file'
        })
      })
    }

    // Add processing logs
    const processingLogs: LogEntry[] = [
      { timestamp: new Date().toISOString(), message: '⚙️  Starting due diligence analysis...', type: 'info' },
      { timestamp: new Date().toISOString(), message: '🔍 Analyzing financial statements...', type: 'info' },
      { timestamp: new Date().toISOString(), message: '📊 Processing market research data...', type: 'info' },
      { timestamp: new Date().toISOString(), message: '🔗 Cross-referencing due diligence checks...', type: 'info' },
      { timestamp: new Date().toISOString(), message: '📈 Generating investment committee documentation...', type: 'info' },
      { timestamp: new Date().toISOString(), message: '✅ Analysis complete', type: 'success' },
      { timestamp: new Date().toISOString(), message: '📋 Generating final reports...', type: 'info' },
      { timestamp: new Date().toISOString(), message: '🎉 Job completed successfully!', type: 'success' }
    ]

    return [...logs, ...processingLogs]
  }

  const mockLogs = generateMockLogs()
  let logIndex = 0

  // Start running after 2 seconds
  setTimeout(() => {
    useJobStore.setState(prev => ({ 
      ...prev, 
      status: 'running', 
      progress: 5 
    }))
    useJobStore.getState().updateComputedState()
  }, 2000)

  // Simulate log streaming
  const logInterval = setInterval(() => {
    if (logIndex >= mockLogs.length) {
      clearInterval(logInterval)
      
      // Mark job as completed
      setTimeout(() => {
        useJobStore.setState(prev => ({
          ...prev,
          status: 'completed',
          progress: 100,
          results: {
            summary: 'Due diligence analysis completed successfully',
            reports: [
              {
                name: 'IC_Document.pdf',
                type: 'Investment Committee Documentation',
                size: '2.4 MB',
                downloadUrl: '/mock/downloads/IC_Document.pdf'
              },
              {
                name: 'Violations_Report.pdf', 
                type: 'Compliance Violations Report',
                size: '1.8 MB',
                downloadUrl: '/mock/downloads/Violations_Report.pdf'
              }
            ],
            metrics: {
              filesProcessed: jobData.uploadedFiles?.length || 0,
              parametersUsed: jobData.inputFields?.length || 0,
              processingTime: '2m 34s',
              riskScore: '7.2/10'
            }
          }
        }))
        useJobStore.getState().updateComputedState()
      }, 1000)
      
      return
    }

    const currentLog = mockLogs[logIndex]
    
    // Update progress based on log index
    const progress = Math.min(95, Math.floor((logIndex / mockLogs.length) * 90) + 5)
    
    useJobStore.setState(prev => ({
      ...prev,
      logs: [...prev.logs, currentLog],
      progress
    }))
    
    logIndex++
  }, Math.random() * 1000 + 500) // Random delay between 500ms - 1500ms

  // Send initial queued message
  setTimeout(() => {
    const queuedLog: LogEntry = { 
      timestamp: new Date().toISOString(), 
      message: '⏳ Job queued successfully', 
      type: 'info'
    }
    useJobStore.setState(prev => ({
      ...prev,
      logs: [...prev.logs, queuedLog]
    }))
  }, 1000)
}