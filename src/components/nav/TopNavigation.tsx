import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown,
  Menu,
  FileText, 
  SquarePlus, 
  MessageSquare, 
  BookOpen,
  User,
  Settings
} from 'lucide-react'
import { useAppStore } from '../../stores/notificationStore'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const topNavItems = [
  { icon: MessageSquare, label: 'Messages' },
  { icon: SquarePlus, label: 'New Tab' },
  { icon: FileText, label: 'Documents' },
]

const bottomNavItems = [
  { icon: BookOpen, label: 'Book' },
  { icon: User, label: 'Profile' },
  { icon: Settings, label: 'Settings' },
]

export default function TopNavigation() {
  const { theme, setTheme } = useTheme()
  const [isSearchHovered, setIsSearchHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { 
    notifications, 
    unreadCount,
    markAsRead 
  } = useAppStore()
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 items-center justify-between px-4 hidden md:flex">
        {/* Left Section - Logo and Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Brand Logo */}
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/favicon.svg" alt="SigTech" className="w-8 h-8" />
          </div>
          
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <div className="flex items-center gap-1">
                  <div className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Maximum Profit Project</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">
                    <ChevronDown className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                  </div>
                </div>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-400 dark:text-slate-500 mx-3" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-800 dark:text-white font-medium">
                  Due Diligence Check
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Animated Search */}
          <motion.div
            className="relative flex items-center"
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
          >
            <AnimatePresence>
              {isSearchHovered && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden mr-2"
                >
                  <Input
                    placeholder="Search..."
                    className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Search className="w-5 h-5" />
            </Button>
          </motion.div>

        {/* Notifications Dropdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <div className="absolute bottom-1 right-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-background border-border">
              <DropdownMenuLabel className="text-foreground">
                Notifications ({unreadCount} unread)
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="p-4 cursor-pointer hover:bg-accent focus:bg-accent"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationColor(notification.type)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          <p className={`text-sm ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'} mt-1`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </Button>
          </motion.div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/favicon.svg" alt="SigTech" className="w-8 h-8" />
            </div>
            <span className="text-white font-semibold">SigTech</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <div className="absolute bottom-1 right-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-background border-border">
                <DropdownMenuLabel className="text-foreground">
                  Notifications ({unreadCount} unread)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-4 cursor-pointer hover:bg-accent focus:bg-accent"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationColor(notification.type)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-medium ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                            <p className={`text-sm ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'} mt-1`}>
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 left-0 right-0 z-40 bg-slate-900 border-b border-slate-700 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Breadcrumbs */}
                <div className="border-b border-slate-700 pb-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <div className="flex items-center gap-1">
                          <div className="bg-slate-700 border border-slate-600 rounded-md px-3 py-1.5 hover:bg-slate-600 cursor-pointer">
                            <span className="text-slate-300 text-sm">Maximum Profit Project</span>
                          </div>
                          <div className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1.5 hover:bg-slate-600 cursor-pointer">
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-slate-500 mx-3" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-white font-medium">
                          Due Diligence Check
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Search */}
                <div>
                  <Input
                    placeholder="Search..."
                    className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>

                {/* Top Navigation Items */}
                <div className="space-y-2">
                  <h3 className="text-slate-400 text-sm font-medium">Navigation</h3>
                  {topNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Button>
                    )
                  })}
                </div>

                {/* Separator */}
                <div className="border-t border-slate-700"></div>

                {/* Bottom Navigation Items */}
                <div className="space-y-2">
                  <h3 className="text-slate-400 text-sm font-medium">More</h3>
                  {bottomNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}