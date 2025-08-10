import React, { useState } from 'react'
import SideNavigation from '../nav/SideNavigation'
import TopNavigation from '../nav/TopNavigation'
import PageHeader from './PageHeader'
import JobTabs from '../tabs/JobTabs'
import { Toaster } from '../ui/sonner'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [isRunReady, setIsRunReady] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Content Area with Sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Side Navigation */}
        <SideNavigation 
          onHoverChange={setIsSidebarHovered}
        />
        
        {/* Main Content Area */}
        <div 
          className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${
            isSidebarHovered ? 'md:ml-[240px]' : 'md:ml-[60px]'
          } ml-0`}
        >
          {/* Page Header */}
          <PageHeader
            title="Due Diligence Check"
            description="This job performs a high level analysis from uploaded company data packs (e.g. financial statements, management presentations, market research) to generate a comprehensive IC (Investment Committee) documentation for investment decisions."
            isRunEnabled={isRunReady}
            runTooltipText={isRunReady ? "Ready to execute job" : "Complete configuration to enable run"}
            onDuplicate={() => console.log('Duplicate clicked')}
            onRun={() => console.log('Run clicked')}
          />
          
          {/* Main Content */}
          <main className="flex-1 bg-white dark:bg-slate-800 overflow-auto">
            <JobTabs onRunStateChange={setIsRunReady} />
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}