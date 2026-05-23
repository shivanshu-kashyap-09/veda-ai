import React, { useEffect, useRef, useState } from 'react'
import { FiDownload, FiLoader } from 'react-icons/fi'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useAssignmentStore } from '../store/useAssignmentStore'

const samplePaper = {
  schoolName: 'Delhi Public School, Sector-4, Bokaro',
  subject: 'English',
  class: '5th',
  timeAllowed: '45 minutes',
  maxMarks: 20,
  instructions: 'All questions are compulsory unless stated otherwise.',
  sections: [
    {
      title: 'Section A',
      subtitle: 'Short Answer Questions',
      instruction: 'Attempt all questions. Each question carries 2 marks.',
      questions: [
        { text: '[Easy] Define electroplating. Explain its purpose. [2 Marks]' },
        { text: '[Moderate] What is the role of a conductor in the process of electrolysis? [2 Marks]' },
        { text: '[Easy] Why does a solution of copper sulfate conduct electricity? [2 Marks]' },
        { text: '[Moderate] Describe one example of the chemical effect of electric current in daily life. [2 Marks]' },
        { text: '[Moderate] Explain why electric current is said to have chemical effects. [2 Marks]' },
        { text: '[Easy] How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved. [2 Marks]' },
        { text: '[Challenging] What happens at the cathode and anode during the electrolysis of water? Name the gases evolved. [2 Marks]' },
        { text: '[Easy] Mention the type of current used in electroplating and justify why it is used. [2 Marks]' },
        { text: '[Moderate] What is the importance of electric current in the field of metallurgy? [2 Marks]' },
        { text: '[Challenging] Explain with a chemical equation how copper is deposited during the electroplating of an object. [2 Marks]' },
      ],
    },
  ],
  answerKey: [
    'Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.',
    'A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.',
    'Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity.',
    'An example is the electroplating of silver on jewelry to prevent tarnishing.',
    'Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects.',
    'Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons.\n2H2O + 2e⁻ → H2 + 2OH⁻\nNa⁺ + OH⁻ → NaOH (in solution)',
    'At the cathode: water is reduced to hydrogen and hydroxide ions.\nAt the anode: water is oxidized to oxygen and hydrogen ions.',
  ],
}

const Output = ({ onNavigate }) => {
  const [notificationVisible, setNotificationVisible] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [polling, setPolling] = useState(false)
  const { status, progress, generatedPaper, assignmentId, fetchAssignmentResult } = useAssignmentStore()
  const paperRef = useRef(null)

  useEffect(() => {
    if (!generatedPaper && assignmentId) {
      fetchAssignmentResult(assignmentId)
    }
  }, [assignmentId, generatedPaper, fetchAssignmentResult])

  useEffect(() => {
    if (!assignmentId || generatedPaper || status !== 'generating') return undefined;

    setPolling(true)
    const interval = setInterval(() => {
      fetchAssignmentResult(assignmentId)
    }, 3000)

    return () => {
      clearInterval(interval)
      setPolling(false)
    }
  }, [assignmentId, generatedPaper, status, fetchAssignmentResult])

  const handleDownloadPdf = async () => {
    if (!paperRef.current) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('question-paper.pdf')
    } catch (error) {
      console.error('PDF download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (status === 'generating') {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-8 text-center h-full">
        <FiLoader className="w-12 h-12 text-[#252525] animate-spin mb-4" />
        <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-[#252525] mb-2">
          Generating Question Paper...
        </h2>
        <p className="text-gray-500 font-['Inter'] mb-6">
          Please wait while our AI crafts the perfect assessment for you.
        </p>
        <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
          <div className="bg-[#4BC26D] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="mt-2 text-sm font-semibold text-gray-600">{progress}%</p>
      </div>
    );
  }

  const paperToRender = generatedPaper || samplePaper;

  return (
    <div className="flex-1 w-full overflow-y-auto px-2 sm:px-4 pb-6 sm:pb-10">
      <div className="w-full max-w-5xl mx-auto">

      {/* Top Notification Bar */}
      {notificationVisible && (
        <div className="w-full bg-[#181818CC] rounded-lg sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 mb-4 sm:mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 backdrop-blur-sm">
          <p className="text-xs sm:text-base md:text-[20px] text-white font-['Inter'] leading-[150%] flex-1 line-clamp-2">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-white text-[#303030] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-base md:text-[16px] font-semibold font-['Bricolage_Grotesque'] hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm whitespace-nowrap flex-shrink-0"
          >
            <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5px]" />
            <span className="hidden xs:inline">{isDownloading ? 'Preparing PDF...' : 'Download as PDF'}</span>
            <span className="inline xs:hidden">{isDownloading ? 'Preparing...' : 'Download'}</span>
          </button>
        </div>
      )}

      {/* Paper Document */}
      <div ref={paperRef} className="w-full bg-white rounded-lg sm:rounded-3xl md:rounded-4xl p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 shadow-sm ">
        <div className="">

          {/* School Header */}
          <div className="w-full text-center text-[#303030] mb-4 sm:mb-6 md:mb-8">
            <h1 className="font-bold text-lg sm:text-2xl md:text-[32px] font-['Inter'] break-words">
              Delhi Public School, Sector-4, Bokaro
            </h1>
            <p className="font-semibold text-sm sm:text-lg md:text-2xl font-['Inter'] mt-1">
              Subject: {paperToRender.subject}
            </p>
            <p className="font-semibold text-sm sm:text-lg md:text-2xl font-['Inter'] mt-1">
              Class: 5th
            </p>
          </div>

          {/* Time & Marks Row */}
          <div className="w-full h-[29px] flex flex-row xs:flex-row justify-between text-[#303030] font-['Inter']  gap-1 xs:gap-2 ">
            <span className="font-semibold text-xs sm:text-base md:text-[18px]">
              Time Allowed: {paperToRender.timeAllowed}
            </span>
            <span className="font-semibold text-xs sm:text-base md:text-[18px]">
              Maximum Marks: {paperToRender.maxMarks}
            </span>
          </div>

          {/* Instructions */}
          <p className="w-full text-xs sm:text-base md:text-[18px] text-[#303030] font-['Inter'] font-semibold">
            {paperToRender.instructions}
          </p>

          {/* Student Info Fields */}
          <div className="w-full flex flex-col gap-1.5 sm:gap-2 md:gap-3 ">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base md:text-[18px]">
              <span className="font-semibold text-[#303030] font-['Inter']">Name: ______________________</span>
              
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base md:text-[18px]">
              <span className="font-semibold text-[#303030] font-['Inter']">Roll Number: ________________</span>
              
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base md:text-[18px]">
              <span className="font-semibold text-[#303030] font-['Inter']">Class: 5th Section: __________</span>
              
            </div>
          </div>

          {/* Sections */}
          {paperToRender.sections?.map((section, si) => (
            <div key={si} className="">
              <h2 className="w-full text-base sm:text-xl md:text-[24px] font-semibold text-[#303030] font-['Inter'] text-center ">
                {section.title}
              </h2>
              <p className="w-full text-xs sm:text-sm md:text-[18px] font-semibold text-[#303030] font-['Inter'] ">
                {section.subtitle}<br />
                <span className="font-medium text-[10px] sm:text-xs md:text-[15px] italic">{section.instruction}</span>
              </p>

              <ol className="flex flex-col gap-1.5 sm:gap-2">
                {section.questions.map((q, qi) => (
                  <li key={qi} className="flex items-start gap-1.5 sm:gap-2 font-['Inter'] text-xs sm:text-sm md:text-[16px] text-[#303030]">
                    <span className="text-xs sm:text-sm md:text-[16px] text-[#303030] font-medium flex-shrink-0">
                      {qi + 1}.
                    </span>
                    <span className="text-xs sm:text-sm md:text-[16px] text-[#303030] leading-[150%] sm:leading-[160%]">
                      {q.text}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="">
                <span className="text-xs sm:text-base md:text-[18px] font-bold text-[#303030] font-['Inter']">
                  End of Question Paper
                </span>
              </div>
            </div>
          ))}

          {/* Answer Key */}
          <div>
            <h3 className="text-base sm:text-xl md:text-[24px] font-semibold text-[#303030] font-['Inter'] mt-4 sm:mt-6">
              Answer Key:
            </h3>
            <ol className="flex flex-col gap-2.5 sm:gap-4">
              {paperToRender.answerKey?.map((answer, i) => (
                <li key={i} className="flex items-start gap-1.5 sm:gap-2 font-['Inter'] text-xs sm:text-sm md:text-[16px] text-[#303030]">
                  <span className="text-xs sm:text-sm md:text-[16px] text-[#303030] font-medium flex-shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <span className="text-xs sm:text-sm md:text-[16px] text-[#303030] leading-[150%] sm:leading-[160%] whitespace-pre-line break-words">
                    {answer}
                  </span>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
      </div>
    </div>
  )
}

export default Output
