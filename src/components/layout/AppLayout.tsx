import SideNavigation from '../nav/SideNavigation'
import TopNavigation from '../nav/TopNavigation'
import PageHeader from './PageHeader'
import JobProgress from '../progress/JobProgress'
import JobTabs from '../tabs/JobTabs'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Content Area with Sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Side Navigation */}
        <SideNavigation />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ml-[60px] h-[calc(100vh-4rem)]">
          {/* Page Header */}
          <PageHeader
            title="Due Diligence Check"
            description="This job performs a high level analysis from uploaded company data packs (e.g. financial statements, management presentations, market research) to generate a comprehensive IC (Investment Committee) documentation for investment decisions."
            hasFilesAttached={false}
            onDuplicate={() => console.log('Duplicate clicked')}
            onRun={() => console.log('Run clicked')}
          />
          
          {/* Job Progress */}
          <JobProgress currentStep={3} />
          
          {/* Main Content */}
          <main className="flex-1 bg-white dark:bg-slate-800 overflow-auto">
            <JobTabs />
          </main>
        </div>
      </div>
    </div>
  )
}