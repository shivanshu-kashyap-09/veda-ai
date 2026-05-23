import React from 'react'
import bgimage from '../assets/9febd571fee6fd21c3fcb70add17604731bfebaf.jpg'
import profileImage from '../assets/2e5a797574651e700037a00834fc192cdff92aad.jpg'
import { Sparkles } from 'lucide-react'
import { FiGrid, FiClock, FiSettings, FiX } from 'react-icons/fi'
import { FaUserFriends } from 'react-icons/fa'
import { HiOutlineDocumentText, HiOutlineTemplate } from 'react-icons/hi'

const NAV_ITEMS = [
  { id: 'home',      label: 'Home',                icon: FiGrid,               badge: null },
  { id: 'groups',   label: 'My Groups',            icon: FaUserFriends,         badge: null },
  { id: 'workbench',label: 'Assignments',           icon: HiOutlineDocumentText, badge: 10   },
  { id: 'toolkit',  label: "AI Teacher's Toolkit", icon: HiOutlineTemplate,     badge: null },
  { id: 'library',  label: 'My Library',           icon: FiClock,               badge: null },
]

const Sidebar = ({ onNavigate, currentView, onClose }) => {
  // Determine which nav item is "active" based on current view
  const activeNav =
    currentView === 'workbench' || currentView === 'create'
      ? 'workbench'
      : currentView === 'output'
      ? 'toolkit'        // shows AI Teacher's Toolkit active when on Output
      : currentView

  return (
    <section
      className="w-full md:w-[21.25rem] h-full rounded-lg md:rounded-2xl justify-between p-4 md:p-6 bg-white flex flex-col flex-shrink-0 relative"
      style={{ boxShadow: '0 2rem 3rem 0 rgba(0,0,0,0.2), 0 1rem 3rem 0 rgba(0,0,0,0.12)' }}
    >
      {/* Close Button for Mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Close sidebar"
        >
          <FiX className="w-5 h-5 text-[#5E5E5E]" />
        </button>
      )}

      {/* ── Top Group ── */}
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="w-full flex flex-col gap-8 md:gap-[3.5rem]">

          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="w-8 md:w-[2.5rem] h-8 md:h-[2.5rem] flex-shrink-0 relative rounded-[0.625rem] overflow-hidden flex items-center justify-center"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              <img src={bgimage} alt="VedaAI Logo" className="absolute inset-0 w-full h-full object-cover" />
              <svg className="relative z-10 w-5 md:w-[22px] h-4 md:h-[18px]" viewBox="0 0 24 20" fill="none">
                <path d="M1 2L8.5 18H14.5L7 2H1Z"   fill="#E8E8E8" />
                <path d="M8 18H14.5L23 2H16.5L8 18Z" fill="white"   />
              </svg>
            </div>
            <span className="font-bold text-lg md:text-[1.75rem] tracking-[-0.05em] text-[#252525]">VedaAI</span>
          </div>

          {/* Create Assignment Button */}
          <div className="w-full md:w-[251px]">
            <button
              onClick={() => {
                onNavigate('create')
                onClose?.()
              }}
              className="w-full h-10 md:h-[42px] rounded-full p-[4px] bg-gradient-to-b from-[#FF7950] to-[#C0350A] hover:opacity-90 active:opacity-80 transition-opacity"
              style={{ boxShadow: '0px 32px 48px 0px #FFFFFF33, 0px 16px 48px 0px #FFFFFF1F' }}
            >
              <div className="w-full h-full bg-[#272727] rounded-full flex items-center justify-center gap-2 md:gap-2.5"
                style={{ boxShadow: 'inset 0px 0px 34.5px 0px #FFFFFF40, inset 0px -1px 3.5px 0px #B1B1B199' }}>
                <Sparkles className="w-4 md:w-[18px] h-4 md:h-[18px] text-white fill-white flex-shrink-0" />
                <span className="font-medium text-xs md:text-[16px] leading-[28px] tracking-[-0.04em] text-white">
                  Create Assignment
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="w-full md:w-[251px] flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeNav === id
            return (
              <div
                key={id}
                onClick={() => {
                  onNavigate(id === 'workbench' ? 'workbench' : id)
                  onClose?.()
                }}
                className={`w-full px-3 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors select-none text-xs md:text-base ${
                  isActive ? 'text-[#252525] bg-[#F5F5F5]' : 'text-[#5E5E5E] hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <Icon className="w-4 md:w-5 h-4 md:h-5 flex-shrink-0" />
                <span className={`font-['Bricolage_Grotesque'] leading-[140%] tracking-[-0.04em] flex-1 ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
                {badge !== null && (
                  <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-[#FF5623] text-white text-[10px] md:text-[11px] font-bold font-['Bricolage_Grotesque'] flex-shrink-0">
                    {badge}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Bottom Group ── */}
      <div className="flex flex-col gap-2">
        {/* Settings */}
        <div className="w-full px-3 py-2 flex items-center gap-3 rounded-xl text-[#5E5E5E] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer mb-2 text-xs md:text-base">
          <FiSettings className="w-4 md:w-5 h-4 md:h-5 flex-shrink-0" />
          <span className="font-['Bricolage_Grotesque'] leading-[140%] tracking-[-0.04em]">Settings</span>
        </div>

        {/* Profile Card */}
        <div className="w-full md:w-[251px] bg-[#F5F5F5] rounded-[16px] p-2.5 md:p-3 flex items-center gap-2 md:gap-3">
          <img src={profileImage} alt="Profile" className="w-10 md:w-[46px] h-10 md:h-[46px] rounded-full object-cover flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-['Bricolage_Grotesque'] font-bold text-xs md:text-[15px] leading-[120%] tracking-[-0.02em] text-[#252525] truncate">
              Delhi Public School
            </span>
            <span className="font-['Bricolage_Grotesque'] text-[11px] md:text-[13px] leading-[140%] tracking-[-0.02em] text-[#5E5E5E] truncate">
              Bokaro Steel City
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sidebar