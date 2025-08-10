import { Copy, Play } from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface PageHeaderProps {
  title: string
  description: string
  showRunButton?: boolean
  showDuplicateButton?: boolean
  hasFilesAttached?: boolean
  isRunEnabled?: boolean
  runTooltipText?: string
  onDuplicate?: () => void
  onRun?: () => void
}

export default function PageHeader({
  title,
  description,
  showRunButton = true,
  showDuplicateButton = true,
  hasFilesAttached = false,
  isRunEnabled = false,
  runTooltipText = "Upload files to enable Run",
  onDuplicate,
  onRun
}: PageHeaderProps) {
  return (
    <TooltipProvider>
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left Section - Title and Description */}
          <div className="flex-1 max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right Section - Buttons */}
          <div className="flex items-center gap-3 ml-6">
            {showDuplicateButton && (
              <Button
                variant="outline"
                onClick={onDuplicate}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </Button>
            )}
            
            {showRunButton && (
              <>
                {!isRunEnabled ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        onClick={onRun}
                        disabled={!isRunEnabled}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-4 py-2 transition-all duration-300"
                      >
                        <Play className="w-4 h-4" />
                        Run
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{runTooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    onClick={onRun}
                    disabled={!isRunEnabled}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-4 py-2 transition-all duration-300"
                  >
                    <Play className="w-4 h-4" />
                    Run
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}