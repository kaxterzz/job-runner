import SideNavigation from '../nav/SideNavigation'
import TopNavigation from '../nav/TopNavigation'
import PageHeader from './PageHeader'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Side Navigation */}
        <SideNavigation />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Page Header */}
          <PageHeader
            title="Due Diligence Check"
            description="This job performs a high level analysis from uploaded company data packs (e.g. financial statements, management presentations, market research) to generate a comprehensive IC (Investment Committee) documentation for investment decisions."
            hasFilesAttached={false}
            onDuplicate={() => console.log('Duplicate clicked')}
            onRun={() => console.log('Run clicked')}
          />
          
          {/* Main Content */}
          <main className="flex-1 bg-slate-50 dark:bg-slate-900 p-8">
            <div className="text-slate-800 dark:text-white">
              Some content
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}