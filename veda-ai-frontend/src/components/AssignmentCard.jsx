import React, { useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'


const AssignmentCard = ({ assignment, onDelete, onNavigate }) => {
    const [activeMenu, setActiveMenu] = useState(false)
    const toggleMenu = () => {
        setActiveMenu(!activeMenu)
    }

    const assignedDate = new Date(assignment.createdAt).toLocaleDateString('en-GB')
    const dueDate = assignment.dueDate // We stored this as a string, e.g., '25-05-2026'

  return (
    <div className="bg-white rounded-lg sm:rounded-[20px] p-3 sm:p-6 flex flex-col justify-between h-full min-h-[140px] sm:min-h-[160px] w-full gap-2 sm:gap-3 relative shadow-sm border border-transparent hover:border-gray-100 transition-all">
      <div className="flex justify-between items-start gap-2 min-w-0">
        <h3 className="text-sm sm:text-lg md:text-[19px] font-extrabold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.03em] line-clamp-2">
          {assignment.title || 'Untitled Assignment'}
        </h3>
        <button
          onClick={toggleMenu}
          className="text-[#A3A3A3] hover:text-[#252525] active:text-[#252525] p-1 focus:outline-none flex-shrink-0"
          aria-label="More options"
        >
          <FiMoreVertical className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 stroke-[2px]" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-2 mt-2 sm:mt-4 text-xs sm:text-sm md:text-[14px]">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.01em]">Assigned:</span>
          <span className="text-[#7A7A7A] font-['Bricolage_Grotesque'] font-medium tracking-[-0.01em]">{assignedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.01em]">Due:</span>
          <span className="text-[#7A7A7A] font-['Bricolage_Grotesque'] font-medium tracking-[-0.01em]">{dueDate}</span>
        </div>
      </div>

      {/* Popup Menu */}
      {/* Popup Menu */}
      {activeMenu && (
        <div className="absolute top-12 sm:top-[50px] right-2 sm:right-8 bg-white rounded-lg sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2 sm:py-4 w-40 sm:w-[180px] z-10">
          <button 
            onClick={() => {
                // Wait for output page to handle specific assignments if needed
                onNavigate('output');
            }}
            className="w-full text-left px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-[15px] font-serif text-[#252525] hover:bg-gray-50 active:bg-gray-100 transition-colors">
            View Assignment
          </button>
          <button 
            onClick={() => {
                onDelete();
                setActiveMenu(false);
            }}
            className="w-full text-left px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-[15px] font-serif text-[#FF3B30] hover:bg-red-50 active:bg-red-100 transition-colors">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default AssignmentCard