'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, ChevronRight, Video, Zap, Users } from 'lucide-react'

interface Interview {
  id: string
  candidateId: string
  candidateName: string
  round: string
  date: string
  notes: string
}

const rounds = ['HR Round', 'Technical Round', 'Final Round']

export default function InterviewProcess() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    candidateId: '',
    candidateName: '',
    round: 'HR Round',
    date: '',
    notes: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('hiringData')
    if (saved) {
      const data = JSON.parse(saved)
      setInterviews(data.interviews || [])
      setCandidates(data.candidates || [])
    }
  }

  const saveData = (newInterviews: Interview[]) => {
    const saved = localStorage.getItem('hiringData')
    const data = saved ? JSON.parse(saved) : {}
    data.interviews = newInterviews
    localStorage.setItem('hiringData', JSON.stringify(data))
  }

  const handleAddInterview = () => {
    if (formData.candidateId && formData.date) {
      const newInterview: Interview = {
        id: Date.now().toString(),
        ...formData,
      }
      const updated = [...interviews, newInterview]
      setInterviews(updated)
      saveData(updated)
      setFormData({ candidateId: '', candidateName: '', round: 'HR Round', date: '', notes: '' })
      setOpen(false)
    }
  }

  const handleDeleteInterview = (id: string) => {
    const updated = interviews.filter(i => i.id !== id)
    setInterviews(updated)
    saveData(updated)
  }

  const handleCandidateSelect = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId)
    setFormData({
      ...formData,
      candidateId,
      candidateName: candidate ? candidate.name : '',
    })
  }

  const screenedCandidates = candidates.filter(c => c.hiringStage === 'Screened')

  const pipelineRounds = [
    { name: 'HR Round', color: 'from-blue-500 to-cyan-500', icon: '👤', badge: 'bg-blue-600', lightBg: 'bg-blue-50 dark:bg-blue-950' },
    { name: 'Technical Round', color: 'from-purple-500 to-pink-500', icon: '💻', badge: 'bg-purple-600', lightBg: 'bg-purple-50 dark:bg-purple-950' },
    { name: 'Final Round', color: 'from-green-500 to-emerald-500', icon: '🏆', badge: 'bg-green-600', lightBg: 'bg-green-50 dark:bg-green-950' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white p-8 rounded-xl shadow-lg flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Interview Process</h1>
          <p className="text-orange-50">Manage and schedule all interviews across your recruitment pipeline</p>
        </div>
        <Video className="w-12 h-12 opacity-80" />
      </div>

      <div className="flex items-center justify-between">
        <div></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg">
              <Plus className="w-4 h-4" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Candidate</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={formData.candidateId}
                  onChange={(e) => handleCandidateSelect(e.target.value)}
                >
                  <option value="">Select a candidate...</option>
                  {screenedCandidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Interview Round</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={formData.round}
                  onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                >
                  {rounds.map((round) => (
                    <option key={round} value={round}>
                      {round}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Interview Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Input
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleAddInterview} className="w-full bg-primary text-primary-foreground">
                Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Visual Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pipelineRounds.map((round) => (
          <Card key={round.name} className={`p-6 border-0 overflow-hidden shadow-lg hover:shadow-xl transition-all ${round.lightBg}`}>
            <div className={`bg-gradient-to-r ${round.color} p-1 rounded-lg mb-4 w-fit`}>
              <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded text-lg">{round.icon}</div>
            </div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{round.name}</h3>
            <div className="space-y-3">
              {interviews.filter(i => i.round === round.name).length > 0 ? (
                <>
                  <div className="mb-2">
                    <span className={`${round.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {interviews.filter(i => i.round === round.name).length} candidates
                    </span>
                  </div>
                  {interviews.filter(i => i.round === round.name).map((interview) => (
                    <div key={interview.id} className="p-3 bg-white dark:bg-slate-700 rounded-lg border-l-4 border-transparent hover:shadow-md transition">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{interview.candidateName}</p>
                      {interview.date && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          📅 {new Date(interview.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No interviews scheduled</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">All Scheduled Interviews</h2>
          </div>
          {interviews.length === 0 ? (
            <div className="p-8 text-center">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No interviews scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.map((interview, idx) => (
                <div key={interview.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-700 rounded-xl border-l-4 border-orange-500 hover:shadow-lg transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{interview.candidateName}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 px-3 py-1 rounded-full font-semibold">{interview.round}</span>
                          {interview.date && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              🗓️ {new Date(interview.date).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {interview.notes && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">📝 {interview.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteInterview(interview.id)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
