import SideNavigation from '../nav/SideNavigation'
import TopNavigation from '../nav/TopNavigation'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Side Navigation */}
      <SideNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopNavigation />
        
        {/* Main Content */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-900 p-8">
          <div className="text-slate-800 dark:text-white">
            Some content
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}