import { Check } from 'lucide-react'

interface Step {
  id: number
  name: string
  status: 'completed' | 'current' | 'upcoming'
}

interface JobProgressProps {
  currentStep: number
  totalSteps?: number
}

export default function JobProgress({ currentStep, totalSteps = 4 }: JobProgressProps) {
  const steps: Step[] = [
    { id: 1, name: 'Data Upload', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming' },
    { id: 2, name: 'Validation', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming' },
    { id: 3, name: 'Processing', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming' },
    { id: 4, name: 'Report Generation', status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'upcoming' }
  ]

  const progressPercentage = Math.min(((currentStep - 1) / (totalSteps - 1)) * 100, 100)

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Job Progress
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {Math.min(currentStep, totalSteps)} of {totalSteps} steps completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-8">
          {/* Background bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
            {/* Progress fill */}
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${step.status === 'completed' 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : step.status === 'current'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                    }
                  `}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                
                {/* Step Name */}
                <div className="ml-3">
                  <p 
                    className={`
                      text-sm font-medium
                      ${step.status === 'completed' || step.status === 'current'
                        ? 'text-slate-800 dark:text-white'
                        : 'text-slate-400 dark:text-slate-500'
                      }
                    `}
                  >
                    {step.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}