'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Dashboard from '@/components/dashboard'
import ManpowerPlanning from '@/components/manpower-planning'
import JobDescriptionBuilder from '@/components/job-description-builder'
import CandidateManagement from '@/components/candidate-management'
import ResumeScreening from '@/components/resume-screening'
import InterviewProcess from '@/components/interview-process'
import OfferManagement from '@/components/offer-management'
import OnboardingModule from '@/components/onboarding-module'
import HRMetrics from '@/components/hr-metrics'
import ResumeBasedHiring from '@/components/resume-based-hiring'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'manpower':
        return <ManpowerPlanning />
      case 'job-description':
        return <JobDescriptionBuilder />
      case 'candidates':
        return <CandidateManagement />
      case 'resume-screening':
        return <ResumeScreening />
      case 'resume-based-hiring':
        return <ResumeBasedHiring />
      case 'interviews':
        return <InterviewProcess />
      case 'offers':
        return <OfferManagement />
      case 'onboarding':
        return <OnboardingModule />
      case 'metrics':
        return <HRMetrics />
      default:
        return <Dashboard />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-slate-900 text-foreground">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {currentPage === 'dashboard' ? <Dashboard onNavigate={setCurrentPage} /> : renderPage()}
      </div>
      
      {/* Decorative floating elements */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/2 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
    </main>
  )
}
