import React from 'react'
import profile from '../assets/2e5a797574651e700037a00834fc192cdff92aad.jpg'
import { FaArrowLeft, FaBell, FaChevronDown } from 'react-icons/fa'
import { FiGrid, FiMenu } from 'react-icons/fi'

const VIEW_LABELS = {
  workbench: 'Assignment',
  create: 'Create Assignment',
  output: 'Output',
  home: 'Home',
  groups: 'My Groups',
  toolkit: "AI Teacher's Toolkit",
  library: 'My Library',
}

const Header = ({ onNavigate, currentView, onToggleSidebar, sidebarOpen }) => {
  const canGoBack = currentView !== 'workbench'

  const handleBack = () => {
    if (currentView === 'output') onNavigate('create')
    else onNavigate('workbench')
  }

  return (
    <header className="w-full h-14 md:h-[4.5rem] bg-[#FFFFFF] text-black flex items-center justify-between px-3 md:px-6 rounded-lg md:rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] flex-shrink-0 gap-2 md:gap-4">

      <div className="flex items-center gap-2 md:gap-6 min-w-0">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-4 h-4 text-[#5E5E5E]" />
        </button>

        {/* Back Arrow */}
        <div
          onClick={canGoBack ? handleBack : undefined}
          className={`w-9 md:w-10 h-9 md:h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
            canGoBack ? 'cursor-pointer hover:bg-gray-100' : 'opacity-30 cursor-default'
          }`}
        >
          <FaArrowLeft className="w-3.5 md:w-4 h-3.5 md:h-4 text-[#5E5E5E]" />
        </div>

        {/* Grid Icon & Title */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <FiGrid className="w-4 md:w-5 h-4 md:h-5 text-[#5E5E5E] flex-shrink-0" />
          <span className="text-[#5E5E5E] text-xs md:text-[16px] font-['Bricolage_Grotesque'] font-medium truncate">
            {VIEW_LABELS[currentView] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Right Side: Bell & Profile */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Bell */}
        <button
          aria-label="notifications"
          className="relative w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center bg-[#FFFFFF] hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <FaBell className="w-3.5 md:w-[18px] h-3.5 md:h-[18px] text-[#252525]" />
          <span className="absolute top-1.5 md:top-[8px] right-1.5 md:right-[8px] w-1.5 md:w-2 h-1.5 md:h-2 bg-[#FF5623] rounded-full" />
        </button>

        {/* Profile - Hidden on mobile, shown as icon only */}
        <div className="hidden sm:flex rounded-lg md:rounded-xl px-2 md:px-3 py-1 md:py-1.5 gap-2 md:gap-3 bg-[#FFFFFF] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors items-center">
          <img
            src={profile}
            alt="profile"
            className="w-7 md:w-9 h-7 md:h-9 rounded-lg object-cover bg-white flex-shrink-0"
          />
          <div className="flex items-center gap-1 md:gap-2 min-w-0">
            <span className="text-xs md:text-[16px] font-medium font-['Bricolage_Grotesque'] text-[#252525] truncate hidden md:block">
              John Doe
            </span>
            <FaChevronDown className="w-2.5 md:w-3.5 h-2.5 md:h-3.5 text-[#5E5E5E] flex-shrink-0" />
          </div>
        </div>

        {/* Mobile Profile Icon Only */}
        <div className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center bg-[#FFFFFF] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors flex-shrink-0">
          <img
            src={profile}
            alt="profile"
            className="w-8 h-8 rounded object-cover bg-white"
          />
        </div>
      </div>
    </header>
  )
}

export default Header