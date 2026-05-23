import React, { useState, useEffect } from 'react'
import illustrationFound from '../assets/illustrationfound.png'
import { FiSearch, FiFilter, FiMoreVertical, FiPlus } from 'react-icons/fi'
import AssignmentCard from './AssignmentCard'
import { useAssignmentStore } from '../store/useAssignmentStore'

const WorkBanch = ({ onNavigate }) => {
    const { assignments, fetchAssignments, deleteAssignment } = useAssignmentStore()

    useEffect(() => {
        fetchAssignments()
    }, [fetchAssignments])

    const hasData = assignments && assignments.length > 0;

    return (
        <div className="flex-1 w-full gap-2 sm:gap-3 relative flex flex-col overflow-hidden">

            {!hasData ? (
                // --- EMPTY STATE (ss1) ---
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
                    <img src={illustrationFound} alt="No assignments" className="w-40 sm:w-56 md:w-[300px] mb-4 sm:mb-6 md:mb-8" />
                    <h2 className="text-lg sm:text-xl md:text-[24px] font-bold text-[#252525] font-['Bricolage_Grotesque'] mb-2 sm:mb-3 tracking-[-0.02em] text-center">
                        No assignments yet
                    </h2>
                    <p className="text-xs sm:text-sm md:text-[15px] text-[#7A7A7A] font-['Bricolage_Grotesque'] text-center max-w-[500px] mb-6 sm:mb-8 leading-[150%] tracking-[-0.01em] px-2">
                        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                    </p>
                    <button onClick={() => onNavigate('create')} className="bg-[#1A1A1A] hover:bg-black active:bg-gray-800 transition-colors text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full flex items-center gap-2 font-medium font-['Bricolage_Grotesque'] text-xs sm:text-sm md:text-[15px]">
                        <FiPlus className="w-4 sm:w-5 h-4 sm:h-5 stroke-[2.5px] flex-shrink-0" />
                        <span>Create Your First Assignment</span>
                    </button>
                </div>
            ) : (
                // --- POPULATED STATE (ss2) ---
                <div className="flex flex-col h-full relative">
                    {/* Header */}
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 flex-shrink-0 px-2 sm:px-0">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#4BC26D] border-4 border-[#4BC26D66] shadow-[0_32px_48px_0px_#00000033] shadow-[0px_16px_48px_0px_#0000001F] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg md:text-[20px] font-bold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.02em]">
                                Assignments
                            </h1>
                            <p className="text-xs sm:text-sm md:text-[14px] text-[#A3A3A3] font-['Bricolage_Grotesque'] tracking-[-0.01em] mt-0.5">
                                Manage and create assignments for your classes.
                            </p>
                        </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="w-full min-h-14 sm:h-16 bg-white rounded-lg sm:rounded-[20px] px-3 sm:px-4 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 flex-shrink-0">
                        <button className="flex items-center gap-1.5 sm:gap-2 text-[#7A7A7A] hover:text-[#252525] active:text-[#252525] transition-colors pl-1 sm:pl-2 text-xs sm:text-sm">
                            <FiFilter className="w-4 h-4 stroke-[2px] flex-shrink-0" />
                            <span className="font-['Bricolage_Grotesque'] font-medium">Filter By</span>
                        </button>
                        <div className="flex items-center w-full sm:max-w-[380px] h-10 sm:h-[44px] px-3 sm:px-4 py-2 rounded-full border border-[#00000033] gap-2 sm:gap-3">
                            <FiSearch className="w-4 h-4 text-[#A3A3A3] stroke-[2.5px] flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search Assignment"
                                className="bg-transparent border-none outline-none text-xs sm:text-sm w-full font-['Bricolage_Grotesque'] placeholder-[#A3A3A3] text-[#252525]"
                            />
                        </div>
                    </div>

                    {/* Grid Area */}
                    <div className="flex-1 overflow-y-auto pr-2 pb-24 min-h-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-2 pb-4">
                            {assignments.map(assignment => (
                                <AssignmentCard 
                                    key={assignment._id} 
                                    assignment={assignment} 
                                    onDelete={() => deleteAssignment(assignment._id)} 
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Floating Create Assignment Button at bottom */}
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center pointer-events-none px-4">
                        <button onClick={() => onNavigate('create')} className="pointer-events-auto bg-[#1A1A1A] hover:bg-black active:bg-gray-800 transition-colors shadow-lg sm:shadow-xl text-white px-4 sm:px-7 py-2.5 sm:py-3 rounded-full flex items-center gap-1.5 sm:gap-2 font-medium font-['Bricolage_Grotesque'] text-xs sm:text-sm md:text-[15px] w-full sm:w-auto justify-center sm:justify-start">
                            <FiPlus className="w-4 sm:w-5 h-4 sm:h-5 stroke-[2.5px] flex-shrink-0" />
                            Create Assignment
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}

export default WorkBanch