'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2, Edit2, Users, Star, TrendingUp } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  skills: string
  experience: string
  hiringStage: string
}

const stages = ['Applied', 'Screened', 'Interview', 'Offer', 'Onboarded']

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience: '',
    hiringStage: 'Applied',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('hiringData')
    if (saved) {
      const data = JSON.parse(saved)
      setCandidates(data.candidates || [])
    }
  }

  const saveData = (newCandidates: Candidate[]) => {
    const saved = localStorage.getItem('hiringData')
    const data = saved ? JSON.parse(saved) : {}
    data.candidates = newCandidates
    localStorage.setItem('hiringData', JSON.stringify(data))
  }

  const handleAddCandidate = () => {
    if (formData.name) {
      const newCandidate: Candidate = {
        id: Date.now().toString(),
        ...formData,
      }
      const updated = [...candidates, newCandidate]
      setCandidates(updated)
      saveData(updated)
      setFormData({ name: '', skills: '', experience: '', hiringStage: 'Applied' })
      setOpen(false)
    }
  }

  const handleEditCandidate = (id: string) => {
    const candidate = candidates.find(c => c.id === id)
    if (candidate) {
      setFormData({
        name: candidate.name,
        skills: candidate.skills,
        experience: candidate.experience,
        hiringStage: candidate.hiringStage,
      })
      setEditId(id)
      setOpen(true)
    }
  }

  const handleUpdateCandidate = () => {
    if (editId && formData.name) {
      const updated = candidates.map(c =>
        c.id === editId ? { ...c, ...formData } : c
      )
      setCandidates(updated)
      saveData(updated)
      setFormData({ name: '', skills: '', experience: '', hiringStage: 'Applied' })
      setEditId(null)
      setOpen(false)
    }
  }

  const handleDeleteCandidate = (id: string) => {
    const updated = candidates.filter(c => c.id !== id)
    setCandidates(updated)
    saveData(updated)
  }

  const handleOpenDialog = () => {
    setEditId(null)
    setFormData({ name: '', skills: '', experience: '', hiringStage: 'Applied' })
    setOpen(true)
  }

  const stageColors = {
    Applied: { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', badge: 'bg-blue-500', icon: '📋' },
    Screened: { bg: 'bg-purple-100 dark:bg-purple-950', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-500', icon: '✓' },
    Interview: { bg: 'bg-orange-100 dark:bg-orange-950', text: 'text-orange-700 dark:text-orange-300', badge: 'bg-orange-500', icon: '🎤' },
    Offer: { bg: 'bg-pink-100 dark:bg-pink-950', text: 'text-pink-700 dark:text-pink-300', badge: 'bg-pink-500', icon: '🎁' },
    Onboarded: { bg: 'bg-green-100 dark:bg-green-950', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-500', icon: '✅' },
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-8 rounded-xl shadow-lg flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Candidate Management</h1>
          <p className="text-pink-50">Track and manage all candidates through every stage of your pipeline</p>
        </div>
        <Users className="w-12 h-12 opacity-80" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Card className="px-6 py-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{candidates.length} Total Candidates</p>
          </Card>
          <Card className="px-6 py-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">{candidates.filter(c => c.hiringStage === 'Onboarded').length} Onboarded</p>
          </Card>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg">
              <Plus className="w-4 h-4" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="e.g., John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Skills</Label>
                <Textarea
                  placeholder="e.g., React, Node.js, PostgreSQL"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Experience</Label>
                <Input
                  placeholder="e.g., 5 years in full-stack development"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
              <div>
                <Label>Hiring Stage</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={formData.hiringStage}
                  onChange={(e) => setFormData({ ...formData, hiringStage: e.target.value })}
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={editId ? handleUpdateCandidate : handleAddCandidate} className="w-full bg-primary text-primary-foreground">
                {editId ? 'Update Candidate' : 'Add Candidate'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {candidates.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-2">No candidates yet</p>
          <p className="text-sm text-gray-500">Add your first candidate to start building your hiring pipeline</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {candidates.map((candidate) => {
            const stageInfo = stageColors[candidate.hiringStage as keyof typeof stageColors] || stageColors.Applied
            return (
              <Card key={candidate.id} className={`p-6 border-0 hover:shadow-xl transition-all duration-300 overflow-hidden ${stageInfo.bg}`}>
                <div className="relative">
                  <div className="absolute top-2 right-2">
                    <div className={`${stageInfo.badge} px-3 py-1 rounded-full text-xs font-bold text-white`}>
                      {stageInfo.icon} {candidate.hiringStage}
                    </div>
                  </div>
                  <div className="pr-24">
                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{candidate.name}</h3>
                    <div className={`h-1 w-12 bg-gradient-to-r ${stageInfo.text.includes('blue') ? 'from-blue-400 to-blue-600' : stageInfo.text.includes('purple') ? 'from-purple-400 to-purple-600' : stageInfo.text.includes('orange') ? 'from-orange-400 to-orange-600' : stageInfo.text.includes('pink') ? 'from-pink-400 to-pink-600' : 'from-green-400 to-green-600'} rounded mb-4`}></div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${stageInfo.text}`}>Skills</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{candidate.skills}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${stageInfo.text}`}>Experience</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{candidate.experience}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <Button
                      size="sm"
                      onClick={() => handleEditCandidate(candidate.id)}
                      className="flex-1 gap-1 bg-white text-gray-900 hover:bg-gray-100 dark:bg-slate-700 dark:text-white"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeleteCandidate(candidate.id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
