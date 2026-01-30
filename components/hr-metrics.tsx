'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Metrics {
  totalRoles: number
  totalCandidates: number
  screened: number
  rejected: number
  interviews: number
  offers: number
  accepted: number
  onboarded: number
}

export default function HRMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalRoles: 0,
    totalCandidates: 0,
    screened: 0,
    rejected: 0,
    interviews: 0,
    offers: 0,
    accepted: 0,
    onboarded: 0,
  })

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = () => {
    const saved = localStorage.getItem('hiringData')
    if (saved) {
      const data = JSON.parse(saved)
      const candidates = data.candidates || []
      const offers = data.offers || []

      setMetrics({
        totalRoles: data.roles?.length || 0,
        totalCandidates: candidates.length,
        screened: candidates.filter((c: any) => c.hiringStage !== 'Applied' && c.hiringStage !== 'Rejected').length,
        rejected: candidates.filter((c: any) => c.hiringStage === 'Rejected').length,
        interviews: candidates.filter((c: any) => c.hiringStage === 'Interview').length,
        offers: offers.length,
        accepted: offers.filter((o: any) => o.status === 'Accepted').length,
        onboarded: candidates.filter((c: any) => c.hiringStage === 'Onboarded').length,
      })
    }
  }

  const pipelineData = [
    { stage: 'Applied', count: metrics.totalCandidates - metrics.screened - metrics.rejected },
    { stage: 'Screened', count: metrics.screened },
    { stage: 'Interview', count: metrics.interviews },
    { stage: 'Offer', count: metrics.offers },
    { stage: 'Onboarded', count: metrics.onboarded },
  ]

  const conversionData = [
    { name: 'Applied', value: metrics.totalCandidates },
    { name: 'Screened', value: metrics.screened },
    { name: 'Accepted', value: metrics.accepted },
    { name: 'Onboarded', value: metrics.onboarded },
  ]

  const statusData = [
    { name: 'Screened', value: metrics.screened, fill: '#3b82f6' },
    { name: 'Rejected', value: metrics.rejected, fill: '#ef4444' },
    { name: 'Pending', value: Math.max(0, metrics.totalCandidates - metrics.screened - metrics.rejected - metrics.rejected), fill: '#f59e0b' },
  ]

  const conversionRate = metrics.totalCandidates > 0 ? Math.round((metrics.accepted / metrics.totalCandidates) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">HR Metrics & Analytics</h1>
        <p className="text-muted-foreground mt-2">Insights on your hiring pipeline and recruitment performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Open Positions</p>
          <p className="text-4xl font-bold text-primary">{metrics.totalRoles}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Candidates</p>
          <p className="text-4xl font-bold text-purple-600">{metrics.totalCandidates}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Conversion Rate</p>
          <p className="text-4xl font-bold text-green-600">{conversionRate}%</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Onboarded</p>
          <p className="text-4xl font-bold text-emerald-600">{metrics.onboarded}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Candidate Pipeline Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Conversion Funnel */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
              <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Candidate Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Screening Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Key Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Key Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Screening Success Rate</p>
                <span className="text-sm font-bold text-primary">
                  {metrics.totalCandidates > 0 ? Math.round((metrics.screened / metrics.totalCandidates) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: metrics.totalCandidates > 0 ? `${(metrics.screened / metrics.totalCandidates) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Offer Acceptance Rate</p>
                <span className="text-sm font-bold text-secondary">
                  {metrics.offers > 0 ? Math.round((metrics.accepted / metrics.offers) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-secondary h-full rounded-full"
                  style={{ width: metrics.offers > 0 ? `${(metrics.accepted / metrics.offers) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Onboarding Completion</p>
                <span className="text-sm font-bold text-accent">
                  {metrics.accepted > 0 ? Math.round((metrics.onboarded / metrics.accepted) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: metrics.accepted > 0 ? `${(metrics.onboarded / metrics.accepted) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h3 className="text-lg font-semibold mb-4">Recruitment Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Offers</p>
            <p className="text-2xl font-bold">{metrics.offers}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Accepted Offers</p>
            <p className="text-2xl font-bold text-green-600">{metrics.accepted}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Rejected Candidates</p>
            <p className="text-2xl font-bold text-red-600">{metrics.rejected}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Interviews Scheduled</p>
            <p className="text-2xl font-bold text-orange-600">{metrics.interviews}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
