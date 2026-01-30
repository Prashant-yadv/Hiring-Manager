'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Edit2, FileCheck, Award, Zap } from 'lucide-react'

interface ResumeHire {
  id: string
  name: string
  email: string
  skills: string
  experience: string
  resumeTitle: string
  hiringReason: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Onboarded'
  createdDate: string
}

export default function ResumeBasedHiring() {
  const [hires, setHires] = useState<ResumeHire[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    resumeTitle: '',
    hiringReason: '',
    status: 'Pending' as const,
  })

  useEffect(() => {
    const savedData = localStorage.getItem('hiringData')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setHires(parsed.resumeHires || [])
    }
  }, [])

  const saveToLocalStorage = (updatedHires: ResumeHire[]) => {
    const savedData = localStorage.getItem('hiringData')
    const data = savedData ? JSON.parse(savedData) : {}
    data.resumeHires = updatedHires
    localStorage.setItem('hiringData', JSON.stringify(data))
    setHires(updatedHires)
    // Trigger storage event for dashboard refresh
    window.dispatchEvent(new Event('resumeHireUpdated'))
  }

  const handleOpenDialog = () => {
    setFormData({
      name: '',
      email: '',
      skills: '',
      experience: '',
      resumeTitle: '',
      hiringReason: '',
      status: 'Pending',
    })
    setEditingId(null)
    setOpen(true)
  }

  const handleEditHire = (id: string) => {
    const hire = hires.find(h => h.id === id)
    if (hire) {
      setFormData({
        name: hire.name,
        email: hire.email,
        skills: hire.skills,
        experience: hire.experience,
        resumeTitle: hire.resumeTitle,
        hiringReason: hire.hiringReason,
        status: hire.status,
      })
      setEditingId(id)
      setOpen(true)
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.resumeTitle) {
      alert('Please fill in all required fields')
      return
    }

    let updatedHires: ResumeHire[]
    if (editingId) {
      updatedHires = hires.map(h =>
        h.id === editingId
          ? { ...h, ...formData }
          : h
      )
    } else {
      const newHire: ResumeHire = {
        id: Date.now().toString(),
        ...formData,
        createdDate: new Date().toLocaleDateString(),
      }
      updatedHires = [...hires, newHire]
    }

    saveToLocalStorage(updatedHires)
    setOpen(false)
  }

  const handleDeleteHire = (id: string) => {
    const updatedHires = hires.filter(h => h.id !== id)
    saveToLocalStorage(updatedHires)
  }

  const statusConfig = {
    Pending: { color: 'from-blue-500 to-cyan-500', icon: '⏳', bg: 'bg-blue-50 dark:bg-blue-950', badge: 'bg-blue-600' },
    Approved: { color: 'from-green-500 to-emerald-500', icon: '✅', bg: 'bg-green-50 dark:bg-green-950', badge: 'bg-green-600' },
    Rejected: { color: 'from-red-500 to-pink-500', icon: '❌', bg: 'bg-red-50 dark:bg-red-950', badge: 'bg-red-600' },
    Onboarded: { color: 'from-purple-500 to-indigo-500', icon: '🎉', bg: 'bg-purple-50 dark:bg-purple-950', badge: 'bg-purple-600' },
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white p-8 rounded-xl shadow-lg flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Resume-Based Hiring</h1>
          <p className="text-cyan-50">Hire talented candidates directly from their resumes without matching job roles</p>
        </div>
        <FileCheck className="w-12 h-12 opacity-80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wide">Total Resumes</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{hires.length}</p>
            </div>
            <span className="text-2xl">📄</span>
          </div>
        </Card>

        <Card className="p-6 border-0 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2 uppercase tracking-wide">Pending</p>
              <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{hires.filter(h => h.status === 'Pending').length}</p>
            </div>
            <span className="text-2xl">⏳</span>
          </div>
        </Card>

        <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2 uppercase tracking-wide">Approved</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{hires.filter(h => h.status === 'Approved').length}</p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </Card>

        <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wide">Onboarded</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{hires.filter(h => h.status === 'Onboarded').length}</p>
            </div>
            <span className="text-2xl">🎉</span>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg">
              <Plus className="w-4 h-4" />
              Add Resume Hire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Resume Hire' : 'Add Resume-Based Hire'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter candidate name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Resume Title *</label>
                <Input
                  value={formData.resumeTitle}
                  onChange={(e) => setFormData({ ...formData, resumeTitle: e.target.value })}
                  placeholder="e.g., Senior Software Engineer with 10 years experience"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Skills</label>
                <Textarea
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="List key skills: React, Node.js, AWS, etc."
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Experience</label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Brief work experience summary"
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Why Hire This Person?</label>
                <Textarea
                  value={formData.hiringReason}
                  onChange={(e) => setFormData({ ...formData, hiringReason: e.target.value })}
                  placeholder="Reason for hiring beyond job role alignment (unique skills, cultural fit, etc.)"
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Onboarded">Onboarded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full bg-teal-600 hover:bg-teal-700">
                {editingId ? 'Update Hire' : 'Add Hire'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {hires.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-2">No resume hires yet</p>
          <p className="text-sm text-gray-500">Add talented candidates who stand out from their resumes</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {hires.map((hire) => {
            const config = statusConfig[hire.status]
            return (
              <Card key={hire.id} className={`p-6 border-0 hover:shadow-xl transition-all ${config.bg} overflow-hidden`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`bg-gradient-to-r ${config.color} p-2 rounded-lg`}>
                        <span className="text-xl">{config.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{hire.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{hire.resumeTitle}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Email</p>
                          <p className="text-sm text-gray-900 dark:text-white">{hire.email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Date Added</p>
                          <p className="text-sm text-gray-900 dark:text-white">{hire.createdDate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</p>
                          <span className={`${config.badge} text-white text-sm font-bold px-3 py-1 rounded-full inline-block mt-1`}>
                            {config.icon} {hire.status}
                          </span>
                        </div>
                      </div>

                      {hire.skills && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Skills</p>
                          <p className="text-sm text-gray-900 dark:text-white">{hire.skills}</p>
                        </div>
                      )}

                      {hire.hiringReason && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Hiring Reason</p>
                          <p className="text-sm text-gray-900 dark:text-white italic">{hire.hiringReason}</p>
                        </div>
                      )}

                      {hire.experience && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Experience</p>
                          <p className="text-sm text-gray-900 dark:text-white">{hire.experience}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 mt-4 border-t border-gray-300 dark:border-gray-600">
                      <Button
                        size="sm"
                        onClick={() => handleEditHire(hire.id)}
                        className="flex-1 bg-white text-gray-900 hover:bg-gray-100 dark:bg-slate-700 dark:text-white"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteHire(hire.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
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
