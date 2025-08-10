import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '../ui/button'

interface Step {
  id: number
  name: string
  status: 'completed' | 'current' | 'upcoming'
}

interface JobProgressToastProps {
  currentStep: number
  totalSteps?: number
  onCancel?: () => void
}

export default function JobProgressToast({ 
  currentStep, 
  totalSteps = 4, 
  onCancel 
}: JobProgressToastProps) {
  const steps: Step[] = [
    { id: 1, name: 'Data Upload', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming' },
    { id: 2, name: 'Validation', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming' },
    { id: 3, name: 'Processing', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming' },
    { id: 4, name: 'Report Generation', status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'upcoming' }
  ]

  const progressPercentage = Math.min(((currentStep - 1) / (totalSteps - 1)) * 100, 100)

  return (
    <div className="w-80 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Job Progress</h3>
          <p className="text-xs text-muted-foreground">
            {Math.min(currentStep, totalSteps)} of {totalSteps} steps completed
          </p>
        </div>
        {onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="w-6 h-6 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-1.5 bg-muted rounded-full">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className={`
                flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300
                ${step.status === 'completed' 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : step.status === 'current'
                  ? 'bg-secondary border-secondary text-secondary-foreground animate-pulse'
                  : 'bg-background border-border text-muted-foreground'
                }
              `}
            >
              {step.status === 'completed' ? (
                <Check className="w-3 h-3" />
              ) : (
                <span className="text-xs font-medium">{step.id}</span>
              )}
            </div>
            
            <span 
              className={`
                text-xs transition-colors duration-300
                ${step.status === 'completed' || step.status === 'current'
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
                }
              `}
            >
              {step.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}