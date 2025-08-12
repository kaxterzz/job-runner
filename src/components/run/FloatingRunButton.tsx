// Floating action button - appears when job is ready to run and triggers execution
// No props required - gets state from job store
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '../ui/button'
import { useJobStore } from '../../stores/jobStore'

export default function FloatingRunButton() {
  const { isReadyToRun, status, inputFields, uploadedFiles, executeJob } = useJobStore()
  
  // Only show when ready to run and in configuration view (idle status)
  const show = isReadyToRun && status === 'idle'

  const handleClick = useCallback(async () => {
    if (!isReadyToRun) return

    const jobData = {
      inputFields,
      uploadedFiles
    }

    console.log('Executing job with data:', jobData)
    
    const result = await executeJob(jobData)
    
    if (result.success) {
      console.log('Job started successfully:', result.jobId)
    } else {
      console.error('Failed to start job:', result.error)
    }
  }, [isReadyToRun, inputFields, uploadedFiles, executeJob])
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: 0,
            y: -100,
            rotate: -180 
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0,
            rotate: 0 
          }}
          exit={{ 
            opacity: 0, 
            scale: 0,
            y: 100,
            rotate: 180 
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.8
          }}
          className="fixed bottom-8 right-8 z-50"
        >
          {/* Magical sparkles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            ))}
          </div>

          {/* Pulsing background effect */}
          <motion.div
            className="absolute inset-0 bg-primary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Main button */}
          <motion.div
            whileHover={{ 
              scale: 1.1,
              rotate: 5
            }}
            whileTap={{ 
              scale: 0.95,
              rotate: -5
            }}
            className="relative"
          >
            <Button
              onClick={handleClick}
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-foreground/10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-2 rounded-full border border-primary-foreground/20"
              />
              
              <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
            </Button>
          </motion.div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 whitespace-nowrap"
          >
            <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
              <p className="text-sm font-medium text-popover-foreground">Ready to Run!</p>
              <p className="text-xs text-muted-foreground">All requirements met</p>
            </div>
            
            {/* Arrow */}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2">
              <div className="border-8 border-transparent border-l-border"></div>
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 -ml-px">
                <div className="border-7 border-transparent border-l-popover"></div>
              </div>
            </div>
          </motion.div>

          {/* Success rings animation */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-primary/20 rounded-full pointer-events-none"
              animate={{
                scale: [1, 1.8, 2.5],
                opacity: [0.3, 0.15, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}