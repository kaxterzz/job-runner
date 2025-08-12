import { motion } from 'framer-motion'
import { useState } from 'react'
import { Clock, FileText, History, Calendar, Play } from 'lucide-react'
import { Button } from '../ui/button'
import Run from '../run/Run'

interface TabData {
  id: string
  label: string
  icon: any
  content: React.ReactNode
}

interface JobTabsProps {
  defaultTab?: string
}

export default function JobTabs({ defaultTab = 'run' }: JobTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const tabs: TabData[] = [
    {
      id: 'run',
      label: 'Run',
      icon: Play,
      content: <Run />
    },
    // {
    //   id: 'latest-run',
    //   label: 'Latest Run (run--003)',
    //   icon: Clock,
    //   content: <LatestRunContent />
    // },
    {
      id: 'details',
      label: 'Details',
      icon: FileText,
      content: <DetailsContent />
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      content: <HistoryContent />
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      content: <ScheduleContent />
    }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center px-6">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <motion.div
                key={tab.id}
                className="relative"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative h-12 px-4 rounded-none border-b-2 transition-all duration-200
                    ${isActive 
                      ? 'border-primary text-primary bg-background hover:bg-muted/50' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  )}
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-800 px-6"
      >
        {activeTabData?.content}
      </motion.div>
    </div>
  )
}

function LatestRunContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-12"
    >
      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Latest Run</h3>
      <p className="text-sm text-muted-foreground">Latest run content will be displayed here</p>
    </motion.div>
  )
}

function DetailsContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 py-6"
    >
      <h3 className="text-lg font-semibold text-foreground">Job Details</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Created</label>
          <p className="text-sm text-muted-foreground">2 hours ago</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Last Modified</label>
          <p className="text-sm text-muted-foreground">1 hour ago</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <p className="text-sm text-muted-foreground">Idle</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Duration</label>
          <p className="text-sm text-muted-foreground">--</p>
        </div>
      </div>
    </motion.div>
  )
}

function HistoryContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 py-6"
    >
      <h3 className="text-lg font-semibold text-foreground">Run History</h3>
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="flex items-center justify-between p-3 rounded-md bg-card border"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">run--{(3 - i).toString().padStart(3, '0')}</p>
                <p className="text-xs text-muted-foreground">{i + 1} hour{i !== 0 ? 's' : ''} ago</p>
              </div>
            </div>
            <span className="text-xs text-primary">Completed</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ScheduleContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 py-6"
    >
      <h3 className="text-lg font-semibold text-foreground">Schedule Configuration</h3>
      <div className="space-y-4">
        <div className="p-4 rounded-md bg-muted/20 border">
          <p className="text-sm text-muted-foreground">No schedule configured</p>
          <p className="text-xs text-muted-foreground mt-1">This job runs manually</p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Configure Schedule
        </Button>
      </div>
    </motion.div>
  )
}