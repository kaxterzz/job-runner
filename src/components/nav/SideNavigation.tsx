import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  FileText, 
  BarChart3, 
  MessageSquare, 
  BookOpen,
  User,
  Settings
} from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

const topNavItems = [
  { icon: FileText, label: 'Documents', active: true },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: MessageSquare, label: 'Messages', active: false },
]

const bottomNavItems = [
  { icon: BookOpen, label: 'Book', active: false },
  { icon: User, label: 'Profile', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

export default function SideNavigation() {
  const [isHovered, setIsHovered] = useState(false)

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '60px' }
  }

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 }
  }

  const renderNavButton = (item: any, index: number) => {
    const Icon = item.icon
    
    const navButton = (
      <Button
        key={item.label}
        variant={item.active ? "secondary" : "ghost"}
        className={`
          w-full justify-start h-10 px-3
          ${item.active 
            ? 'bg-slate-800 text-white hover:bg-slate-700' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }
          ${!isHovered ? 'justify-center px-0' : ''}
        `}
      >
        <Icon className="w-5 h-5" />
        {isHovered && (
          <motion.span
            className="ml-3"
            variants={contentVariants}
            animate={isHovered ? 'expanded' : 'collapsed'}
            transition={{ duration: 0.2, delay: 0.05 * index }}
          >
            {item.label}
          </motion.span>
        )}
      </Button>
    )

    if (!isHovered) {
      return (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            {navButton}
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            {item.label}
          </TooltipContent>
        </Tooltip>
      )
    }

    return navButton
  }

  return (
    <TooltipProvider>
      <motion.div
        className="h-screen bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex"
        variants={sidebarVariants}
        animate={isHovered ? 'expanded' : 'collapsed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo/Brand Area */}
        <div className="p-4 border-b border-slate-800">
          <motion.div
            className="flex items-center gap-3"
            variants={contentVariants}
            animate={isHovered ? 'expanded' : 'collapsed'}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            {isHovered && (
              <span className="text-white font-semibold">SigTech</span>
            )}
          </motion.div>
        </div>

        {/* Top Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {topNavItems.map((item, index) => renderNavButton(item, index))}
        </nav>

        {/* Separator */}
        <div className="border-t border-slate-800 my-2"></div>

        {/* Bottom Navigation Items */}
        <nav className="p-2 space-y-1">
          {bottomNavItems.map((item, index) => renderNavButton(item, index + topNavItems.length))}
        </nav>

        <div className="p-2"></div>
      </motion.div>
    </TooltipProvider>
  )
}