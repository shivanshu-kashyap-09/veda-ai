import React, { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import WorkBanch from '../components/WorkBanch'
import CreateAssignment from './CreateAssignment'
import Output from './Output'

const DashBoard = () => {
  const [currentView, setCurrentView] = useState('workbench')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return <CreateAssignment onNavigate={setCurrentView} />
      case 'output':
        return <Output onNavigate={setCurrentView} />
      default:
        return <WorkBanch onNavigate={setCurrentView} />
    }
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen w-full bg-[#E8E8E8] overflow-hidden gap-4 md:gap-6 p-3 md:p-6">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, visible with overlay when open */}
      <div
        className={`fixed md:static left-0 top-0 h-full w-64 md:w-auto transform transition-transform md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-50 md:z-auto`}
      >
        <Sidebar
          onNavigate={handleNavigate}
          currentView={currentView}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full gap-3 md:gap-6 min-w-0">
        <Header
          onNavigate={setCurrentView}
          currentView={currentView}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 min-h-0 rounded-lg md:rounded-2xl flex flex-col relative overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default DashBoard