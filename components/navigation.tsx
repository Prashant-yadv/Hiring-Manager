'use client'

import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  FileText,
  UserCheck,
  Search,
  Video,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Rocket,
  FileCheck,
} from 'lucide-react'

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { id: 'manpower', label: 'Manpower Planning', icon: Users, color: 'from-purple-500 to-purple-600' },
    { id: 'job-description', label: 'Job Descriptions', icon: FileText, color: 'from-pink-500 to-pink-600' },
    { id: 'candidates', label: 'Candidates', icon: UserCheck, color: 'from-green-500 to-green-600' },
    { id: 'resume-screening', label: 'Resume Screening', icon: Search, color: 'from-orange-500 to-orange-600' },
    { id: 'resume-based-hiring', label: 'Resume Hiring', icon: FileCheck, color: 'from-teal-500 to-cyan-600' },
    { id: 'interviews', label: 'Interviews', icon: Video, color: 'from-red-500 to-red-600' },
    { id: 'offers', label: 'Offers', icon: Briefcase, color: 'from-yellow-500 to-yellow-600' },
    { id: 'onboarding', label: 'Onboarding', icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
    { id: 'metrics', label: 'HR Metrics', icon: TrendingUp, color: 'from-indigo-500 to-indigo-600' },
  ]

  return (
    <nav className="border-b border-border bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hiring System</h1>
              <p className="text-xs text-gray-300">Professional HR Management Platform</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <Button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                variant={isActive ? 'default' : 'ghost'}
                className={`whitespace-nowrap gap-2 transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
