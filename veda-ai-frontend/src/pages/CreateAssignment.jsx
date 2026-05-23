import React, { useState, useRef } from 'react'
import { FiUploadCloud, FiCalendar, FiMic, FiPlus, FiX, FiArrowLeft, FiArrowRight, FiChevronDown, FiLoader } from 'react-icons/fi'
import { useAssignmentStore } from '../store/useAssignmentStore'

const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Long Answer Questions',
  'True/False Questions',
]

const defaultRows = [
  { id: 1, type: 'Multiple Choice Questions', numQuestions: 4, marks: 1 },
  { id: 2, type: 'Short Questions', numQuestions: 3, marks: 2 },
  { id: 3, type: 'Diagram/Graph-Based Questions', numQuestions: 5, marks: 5 },
  { id: 4, type: 'Numerical Problems', numQuestions: 5, marks: 5 },
]

let nextId = 5

const NumberStepper = ({ value, onChange, min = 0, compact = false }) => {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E0E0E0] text-[#5E5E5E] hover:bg-gray-100 active:bg-gray-200 transition-colors font-bold leading-none text-lg"
        aria-label="decrease"
      >
        −
      </button>
      <span className="w-8 text-center font-semibold text-[#252525] font-['Bricolage_Grotesque'] text-[15px]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E0E0E0] text-[#5E5E5E] hover:bg-gray-100 active:bg-gray-200 transition-colors font-bold leading-none text-lg"
        aria-label="increase"
      >
        +
      </button>
    </div>
  )
}

const TypeDropdown = ({ value, onChange, usedTypes, currentType, compact = false }) => {
  const [open, setOpen] = useState(false)
  const available = QUESTION_TYPES.filter(
    (t) => !usedTypes.includes(t) || t === currentType
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full bg-white border border-[#E8E8E8] rounded-lg px-4 py-2.5 text-[14px] text-[#252525] hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#252525] focus:ring-opacity-30 transition-all font-['Bricolage_Grotesque']"
      >
        <span className="truncate">{value}</span>
        <FiChevronDown className={`w-4 h-4 text-[#8E8E8E] ml-2 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-1 left-0 w-full bg-white border border-[#E8E8E8] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.10)] py-1 max-h-60 overflow-y-auto">
          {available.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { onChange(t); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-[13px] font-['Bricolage_Grotesque'] hover:bg-gray-50 active:bg-gray-100 transition-colors ${t === value ? 'text-[#252525] font-semibold bg-gray-50' : 'text-[#5E5E5E]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const CreateAssignment = ({ onNavigate }) => {
  const [rows, setRows] = useState(defaultRows)
  const [dueDate, setDueDate] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileInputRef = useRef(null)
  const [mobileView, setMobileView] = useState(window.innerWidth < 768)
  const [expandedRowId, setExpandedRowId] = useState(null)

  const { createAssignment, status } = useAssignmentStore()

  const handleGenerate = async () => {
    if (!dueDate || rows.length === 0) {
      alert("Please fill due date and at least one question type");
      return;
    }
    
    try {
      await createAssignment({
        title: "VedaAI Assessment",
        dueDate,
        questionTypes: rows,
        additionalInfo
      });
      onNavigate('output');
    } catch (err) {
      alert('Failed to start generation: ' + err.message);
    }
  }

  React.useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalQuestions = rows.reduce((acc, r) => acc + r.numQuestions, 0)
  const totalMarks = rows.reduce((acc, r) => acc + r.numQuestions * r.marks, 0)
  const usedTypes = rows.map((r) => r.type)

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const removeRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const addRow = () => {
    const remaining = QUESTION_TYPES.filter((t) => !usedTypes.includes(t))
    if (remaining.length === 0) return
    setRows((prev) => [
      ...prev,
      { id: nextId++, type: remaining[0], numQuestions: 1, marks: 1 },
    ])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setUploadedFile(file)
  }

  return (
    <div className="flex-1 w-full overflow-y-auto px-3 sm:px-4 md:px-6 pb-8 sm:pb-10">
      <div className="w-full max-w-[1103px] mx-auto gap-4 sm:gap-6 md:gap-[32px] rounded-2xl sm:rounded-[40px] flex flex-col">
        
        {/* Mobile Header with Back Arrow */}
        <div className="md:hidden flex items-center gap-3 py-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('workbench')}
            className="flex items-center justify-center w-6 h-6 text-[#252525] hover:opacity-70 transition-opacity"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <h1 className="text-base font-bold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.02em]">
            Create Assignment
          </h1>
        </div>

        {/* Divider line for mobile */}
        <div className="md:hidden h-[1px] bg-[#E0E0E0]" />

        {/* Desktop Header */}
        <div className="hidden md:flex items-start md:items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#4BC26D] border-4 border-[#4BC26D66] shadow-[0_32px_48px_0px_#00000033] shadow-[0px_16px_48px_0px_#0000001F]  flex-shrink-0" />
          <div className="flex-1">
            <h1 className="text-base md:text-lg md:text-[20px] font-bold text-[#303030] font-['Bricolage_Grotesque'] tracking-[-0.02em] break-words">
              Create Assignment
            </h1>
            <p className="text-xs md:text-sm md:text-[14px] text-[#A3A3A3] font-['Bricolage_Grotesque'] tracking-[-0.01em] line-clamp-2">
              Set up a new assignment for your students
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:block w-full">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[3px] md:h-[5px] bg-[#252525] rounded-full" />
            <div className="flex-1 h-[3px] md:h-[5px] bg-[#E0E0E0] rounded-full" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#FFFFFF80] rounded-2xl md:rounded-3xl p-4 md:p-6 md:p-8 shadow-[0_4px_32px_rgba(0,0,0,0.06)] backdrop-blur-sm">
          
          {/* Assignment Details Header */}
          <div className="mb-4 md:mb-6">
            <h2 className="text-base md:text-lg md:text-[18px] font-bold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.02em]">
              Assignment Details
            </h2>
            <p className="text-sm md:text-base md:text-[16px] text-[#A3A3A3] font-['Bricolage_Grotesque'] mt-1 md:mt-0.5">
              Basic information about your assignment
            </p>
          </div>

          {/* File Upload */}
          <div
            className={`w-full border-2 border-dashed rounded-xl md:rounded-2xl p-4 md:p-6 md:p-8 flex flex-col items-center justify-center mb-2 transition-colors cursor-pointer ${
              dragOver ? 'border-[#252525] bg-gray-50' : 'border-[#D0D0D0] bg-[#FAFAFA]'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label="File upload area"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Choose file"
            />
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center mb-3 md:mb-4 flex-shrink-0">
              <FiUploadCloud className="w-5 h-5 md:w-6 md:h-6 text-[#5E5E5E] stroke-[1.5px]" />
            </div>
            {uploadedFile ? (
              <p className="text-xs md:text-sm md:text-[14px] font-semibold text-[#252525] font-['Bricolage_Grotesque'] text-center truncate max-w-full px-2">
                {uploadedFile.name}
              </p>
            ) : (
              <>
                <p className="text-xs md:text-sm md:text-[14px] font-semibold text-[#252525] font-['Bricolage_Grotesque'] mb-1 text-center">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-[10px] md:text-xs md:text-[12px] text-[#A3A3A3] font-['Bricolage_Grotesque'] mb-3 md:mb-4 text-center">
                  JPEG, PNG, upto 10MB
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                  className="px-3 md:px-5 py-1.5 md:py-2 border border-[#D8D8D8] rounded-full text-xs md:text-sm md:text-[16px] font-medium text-[#252525] font-['Bricolage_Grotesque'] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
                >
                  Browse Files
                </button>
              </>
            )}
          </div>
          <p className="text-[10px] md:text-xs md:text-[12px] text-[#A3A3A3] text-center font-['Bricolage_Grotesque'] mb-4 md:mb-6">
            Upload images of your preferred document/image
          </p>

          {/* Due Date */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm md:text-[14px] font-bold text-[#252525] font-['Bricolage_Grotesque'] mb-1.5 sm:mb-2">
              Due Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="DD-MM-YYYY"
                className="w-full border border-[#E8E8E8] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-[14px] font-['Bricolage_Grotesque'] text-[#252525] placeholder-[#C0C0C0] outline-none focus:border-[#A0A0A0] focus:ring-2 focus:ring-[#252525] focus:ring-opacity-20 transition-all pr-10 sm:pr-12"
              />
              <button
                type="button"
                onClick={() => {
                  const el = document.createElement('input')
                  el.type = 'date'
                  el.style.position = 'fixed'
                  el.style.opacity = 0
                  document.body.appendChild(el)
                  el.showPicker?.()
                  el.addEventListener('change', () => {
                    const [y, m, d] = el.value.split('-')
                    if (y) setDueDate(`${d}-${m}-${y}`)
                    document.body.removeChild(el)
                  })
                }}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-[#E0E0E0] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Open date picker"
              >
                <FiCalendar className="w-4 h-4 text-[#5E5E5E]" />
              </button>
            </div>
          </div>

          {/* Question Types Section */}
          <div className="mb-6">
            {/* Desktop View - Header Row */}
            <div className="hidden md:grid items-center gap-4 mb-4 px-1">
              <div className="grid grid-cols-[1.2fr_140px_100px_40px] gap-4 w-full">
                <span className="text-[14px] font-bold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.01em]">
                  Question Type
                </span>
                <span className="text-[14px] font-bold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.01em] text-center">
                  No. of Questions
                </span>
                <span className="text-[14px] font-bold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.01em] text-center">
                  Marks
                </span>
                <span className="text-[14px] font-bold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.01em] text-center">
                </span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col gap-2 md:gap-2">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="hidden md:grid grid-cols-[1.2fr_140px_100px_40px] gap-4 items-center bg-white p-4 rounded-[12px] border border-[#E8E8E8] hover:border-[#D0D0D0] transition-colors"
                >
                  <TypeDropdown
                    value={row.type}
                    currentType={row.type}
                    usedTypes={usedTypes}
                    onChange={(val) => updateRow(row.id, 'type', val)}
                  />
                  <div className="flex justify-center">
                    <NumberStepper
                      value={row.numQuestions}
                      min={1}
                      onChange={(v) => updateRow(row.id, 'numQuestions', v)}
                    />
                  </div>
                  <div className="flex justify-center">
                    <NumberStepper
                      value={row.marks}
                      min={1}
                      onChange={(v) => updateRow(row.id, 'marks', v)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="w-6 h-6 flex items-center justify-center text-[#A3A3A3] hover:text-[#FF3B30] active:text-red-600 transition-colors mx-auto"
                    aria-label="Delete row"
                  >
                    <FiX className="w-4 h-4 stroke-[2.5px]" />
                  </button>
                </div>
              ))}

              {/* Mobile View - Card Layout */}
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="md:hidden bg-white rounded-xl border border-[#E8E8E8] p-4 space-y-3"
                >
                  {/* Type Dropdown */}
                  <div>
                    <TypeDropdown
                      value={row.type}
                      currentType={row.type}
                      usedTypes={usedTypes}
                      onChange={(val) => updateRow(row.id, 'type', val)}
                    />
                  </div>

                  {/* Questions and Marks Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* No. of Questions */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-semibold text-[#5E5E5E] font-['Bricolage_Grotesque']">
                        No. of Questions
                      </span>
                      <div className="flex justify-center">
                        <NumberStepper
                          value={row.numQuestions}
                          min={1}
                          onChange={(v) => updateRow(row.id, 'numQuestions', v)}
                        />
                      </div>
                    </div>

                    {/* Marks */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] font-semibold text-[#5E5E5E] font-['Bricolage_Grotesque']">
                        Marks
                      </span>
                      <div className="flex justify-center">
                        <NumberStepper
                          value={row.marks}
                          min={1}
                          onChange={(v) => updateRow(row.id, 'marks', v)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="w-6 h-6 flex items-center justify-center text-[#A3A3A3] hover:text-[#FF3B30] active:text-red-600 transition-colors"
                      aria-label="Delete row"
                    >
                      <FiX className="w-4 h-4 stroke-[2.5px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add row button and Totals Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-4 mt-5">
              <button
                type="button"
                onClick={addRow}
                disabled={usedTypes.length >= QUESTION_TYPES.length}
                className="flex items-center justify-center md:justify-start gap-2 text-[14px] font-semibold text-[#252525] font-['Bricolage_Grotesque'] hover:opacity-70 active:opacity-50 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <div className="w-7 h-7 rounded-full bg-[#252525] flex items-center justify-center flex-shrink-0">
                  <FiPlus className="w-4 h-4 text-white stroke-[2.5px]" />
                </div>
                Add Question Type
              </button>

              {/* Totals */}
              <div className="flex flex-col items-center md:items-end gap-1">
                <span className="text-[13px] font-semibold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.01em]">
                  Total Questions: <span className="font-extrabold">{totalQuestions}</span>
                </span>
                <span className="text-[13px] font-semibold text-[#252525] font-['Bricolage_Grotesque'] tracking-[-0.01em]">
                  Total Marks: <span className="font-extrabold">{totalMarks}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-xs sm:text-sm md:text-[14px] font-bold text-[#252525] font-['Bricolage_Grotesque'] mb-1.5 sm:mb-2">
              Additional Information <span className="text-[#A3A3A3] font-normal text-[10px] sm:text-xs">(For better output)</span>
            </label>
            <div className="relative">
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={4}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="w-full border border-[#E8E8E8] rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-[14px] font-['Bricolage_Grotesque'] text-[#252525] placeholder-[#C0C0C0] outline-none focus:border-[#A0A0A0] focus:ring-2 focus:ring-[#252525] focus:ring-opacity-20 transition-all resize-none pb-10"
              />
              <button
                type="button"
                className="absolute bottom-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#F0F0F0] hover:bg-gray-200 active:bg-gray-300 transition-colors flex-shrink-0"
                aria-label="Voice input"
              >
                <FiMic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5E5E5E]" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-2 sm:mt-6">
          <button
            type="button"
            onClick={() => onNavigate('workbench')}
            className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#252525] rounded-full text-xs sm:text-sm md:text-[15px] font-semibold text-[#252525] font-['Bricolage_Grotesque'] hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 stroke-[2.5px]" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={status === 'generating'}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#252525] rounded-full text-xs sm:text-sm md:text-[15px] font-semibold text-white font-['Bricolage_Grotesque'] hover:bg-black active:bg-gray-800 transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <span>{status === 'generating' ? 'Generating...' : 'Next'}</span>
            {status === 'generating' ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiArrowRight className="w-4 h-4 stroke-[2.5px]" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateAssignment
