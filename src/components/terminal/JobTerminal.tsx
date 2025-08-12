import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Terminal, Copy, Download, } from 'lucide-react'
import { Button } from '../ui/button'

interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning' | 'param' | 'file'
}

interface JobTerminalProps {
  logs: LogEntry[]
  isRunning?: boolean
  jobStatus?: string
  onClear?: () => void
  onCopy?: () => void
  className?: string
}

const getLogColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500 dark:text-green-400'
    case 'error':
      return 'text-red-500 dark:text-red-400'
    case 'warning':
      return 'text-yellow-500 dark:text-yellow-400'
    case 'param':
      return 'text-blue-500 dark:text-blue-400'
    case 'file':
      return 'text-purple-500 dark:text-purple-400'
    default:
      return 'text-muted-foreground'
  }
}

const getLogIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    case 'param':
      return '📝'
    case 'file':
      return '📁'
    default:
      return '💬'
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    fractionalSecondDigits: 3
  })
}

export default function JobTerminal({ 
  logs, 
  isRunning = false, 
  jobStatus = 'idle',
  onClear,
  onCopy,
  className = '' 
}: JobTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(true)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isAutoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs, isAutoScroll])

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10
      setIsAutoScroll(isAtBottom)
    }
  }

  const copyLogsToClipboard = () => {
    const logText = logs.map(log => 
      `[${formatTimestamp(log.timestamp)}] ${log.message}`
    ).join('\n')
    
    navigator.clipboard.writeText(logText)
    onCopy?.()
  }

  const getStatusIndicator = () => {
    switch (jobStatus) {
      case 'running':
        return (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">Running</span>
          </div>
        )
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
            <span className="text-sm">Completed</span>
          </div>
        )
      case 'failed':
        return (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full" />
            <span className="text-sm">Failed</span>
          </div>
        )
      case 'queued':
        return (
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-sm">Queued</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-muted-foreground rounded-full" />
            <span className="text-sm">Idle</span>
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-background border border-border rounded-lg overflow-hidden ${className}`}
    >
      {/* Terminal Header */}
      <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-foreground font-medium">Job Execution Terminal</span>
          {getStatusIndicator()}
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-scroll indicator */}
          {!isAutoScroll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAutoScroll(true)
                if (terminalRef.current) {
                  terminalRef.current.scrollTop = terminalRef.current.scrollHeight
                }
              }}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Download className="w-3 h-3 mr-1" />
              Scroll to bottom
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={copyLogsToClipboard}
            disabled={logs.length === 0}
            className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Copy className="w-3 h-3" />
          </Button>

          {onClear && (
            <Button
              variant="ghost" 
              size="sm"
              onClick={onClear}
              disabled={logs.length === 0}
              className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        onScroll={handleScroll}
        className="bg-card p-4 h-96 overflow-y-auto font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-border scrollbar-track-muted"
        style={{ scrollBehavior: isAutoScroll ? 'smooth' : 'auto' }}
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No logs yet. Start a job to see live updates here.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index === logs.length - 1 ? 0.1 : 0
                }}
                className="flex gap-3 mb-1 hover:bg-accent/30 px-2 py-1 rounded"
              >
                {/* Timestamp */}
                <span className="text-muted-foreground text-xs mt-0.5 font-mono shrink-0">
                  [{formatTimestamp(log.timestamp)}]
                </span>

                {/* Log Content */}
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <span className="text-xs mt-0.5 shrink-0">
                    {getLogIcon(log.type)}
                  </span>
                  <span className={`${getLogColor(log.type)} break-words`}>
                    {log.message}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Running cursor */}
        {isRunning && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block w-2 h-4 bg-green-600 dark:bg-green-400 ml-1"
          />
        )}
      </div>

      {/* Terminal Footer */}
      {logs.length > 0 && (
        <div className="bg-muted px-4 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {logs.length} log entr{logs.length === 1 ? 'y' : 'ies'}
          </span>
          {!isAutoScroll && (
            <span className="text-yellow-600 dark:text-yellow-400">
              Auto-scroll paused - scroll to bottom to resume
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}