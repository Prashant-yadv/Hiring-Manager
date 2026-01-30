'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Users, FileText, UserCheck, Video, Briefcase, CheckCircle2, Zap, TrendingUp, ArrowRight, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardData {
  totalRoles: number
  totalCandidates: number
  screened: number
  interviews: number
  offers: number
  onboarded: number
  resumeHiresPending: number
  resumeHiresApproved: number
  resumeHiresRejected: number
}

interface DashboardProps {
  onNavigate: (page: string) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [data, setData] = useState<DashboardData>({
    totalRoles: 0,
    totalCandidates: 0,
    screened: 0,
    interviews: 0,
    offers: 0,
    onboarded: 0,
    resumeHiresPending: 0,
    resumeHiresApproved: 0,
    resumeHiresRejected: 0,
  })

  const loadData = () => {
    const savedData = localStorage.getItem('hiringData')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setData({
        totalRoles: parsed.roles?.length || 0,
        totalCandidates: parsed.candidates?.length || 0,
        screened: parsed.candidates?.filter((c: any) => c.hiringStage !== 'Applied').length || 0,
        interviews: parsed.candidates?.filter((c: any) => c.hiringStage === 'Interview').length || 0,
        offers: parsed.offers?.length || 0,
        onboarded: parsed.candidates?.filter((c: any) => c.hiringStage === 'Onboarded').length || 0,
        resumeHiresPending: parsed.resumeHires?.filter((r: any) => r.status === 'Pending').length || 0,
        resumeHiresApproved: parsed.resumeHires?.filter((r: any) => r.status === 'Approved' || r.status === 'Onboarded').length || 0,
        resumeHiresRejected: parsed.resumeHires?.filter((r: any) => r.status === 'Rejected').length || 0,
      })
    }
  }

  useEffect(() => {
    loadData()
    window.addEventListener('resumeHireUpdated', loadData)
    return () => window.removeEventListener('resumeHireUpdated', loadData)
  }, [])

  const stats = [
    { label: 'Job Descriptions', value: data.totalRoles, icon: FileText, gradient: 'from-blue-500 to-cyan-500', bgLight: 'bg-blue-50 dark:bg-blue-950', page: 'job-description' },
    { label: 'Candidates', value: data.totalCandidates, icon: Users, gradient: 'from-purple-500 to-pink-500', bgLight: 'bg-purple-50 dark:bg-purple-950', page: 'candidates' },
    { label: 'Resume Screening', value: data.screened, icon: UserCheck, gradient: 'from-green-500 to-emerald-500', bgLight: 'bg-green-50 dark:bg-green-950', page: 'resume-screening' },
    { label: 'Resume Approved', value: data.resumeHiresApproved, icon: FileText, gradient: 'from-teal-500 to-cyan-500', bgLight: 'bg-teal-50 dark:bg-teal-950', page: 'resume-based-hiring' },
    { label: 'In Interviews', value: data.interviews, icon: Video, gradient: 'from-orange-500 to-red-500', bgLight: 'bg-orange-50 dark:bg-orange-950', page: 'interviews' },
    { label: 'Offers Extended', value: data.offers, icon: Briefcase, gradient: 'from-yellow-500 to-amber-500', bgLight: 'bg-yellow-50 dark:bg-yellow-950', page: 'offers' },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Hiring Dashboard</h1>
            <p className="text-gray-200">Build your dream team, one hire at a time</p>
          </div>
          <Zap className="w-12 h-12 text-yellow-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat: any) => {
          const Icon = stat.icon
          return (
            <button
              key={stat.label}
              onClick={() => onNavigate(stat.page)}
              className={`p-6 border-0 overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative group ${stat.bgLight}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className="relative flex items-center justify-between h-full">
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-full shadow-lg group-hover:shadow-2xl transition-all`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('resume-based-hiring')}
          className="p-6 border-0 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 opacity-10 group-hover:opacity-20 transition-opacity rounded-xl"></div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-lg w-fit mb-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Pending</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent mb-1">{data.resumeHiresPending}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Awaiting review</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300 mt-3 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('resume-based-hiring')}
          className="p-6 border-0 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-10 group-hover:opacity-20 transition-opacity rounded-xl"></div>
          <div className="relative">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg w-fit mb-3">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Approved</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-1">{data.resumeHiresApproved}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Ready to onboard</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300 mt-3 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('resume-based-hiring')}
          className="p-6 border-0 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-10 group-hover:opacity-20 transition-opacity rounded-xl"></div>
          <div className="relative">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-lg w-fit mb-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Rejected</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent mb-1">{data.resumeHiresRejected}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Did not proceed</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300 mt-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onNavigate('onboarding')}
          className="p-8 border-0 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-10 group-hover:opacity-20 transition-opacity rounded-xl"></div>
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg w-fit mb-4">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Total Onboarded</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-2">{data.onboarded + data.resumeHiresApproved}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Both role & resume based</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-4 group-hover:translate-x-2 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('metrics')}
          className="p-8 border-0 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity rounded-xl"></div>
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-lg w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Success Rate</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">{data.totalCandidates > 0 ? Math.round(((data.onboarded + data.resumeHiresApproved) / (data.totalCandidates + data.resumeHiresPending + data.resumeHiresApproved + data.resumeHiresRejected) || 0) * 100) : 0}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall hiring conversion</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-4 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  )
}
