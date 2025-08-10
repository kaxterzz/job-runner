import { create } from 'zustand'

interface AppState {
  // Notification state
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  unreadCount: number
}

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  timestamp: Date
  type: 'info' | 'success' | 'warning' | 'error'
}

export const useAppStore = create<AppState>((set, get) => ({
  // Notification state
  notifications: [
    {
      id: '1',
      title: 'System Update',
      message: 'Your system has been updated successfully.',
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'success'
    },
    {
      id: '2',
      title: 'New Message',
      message: 'You have received a new message from the team.',
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'info'
    },
    {
      id: '3',
      title: 'Warning',
      message: 'Please check your configuration settings.',
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'warning'
    }
  ],
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
    }
    set((state) => ({ 
      notifications: [newNotification, ...state.notifications] 
    }))
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    )
  })),
  
  get unreadCount() {
    return get().notifications.filter(n => !n.isRead).length
  }
}))