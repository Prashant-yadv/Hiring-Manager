'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'

interface OnboardingTask {
  id: string
  candidateName: string
  candidateId: string
  period: string
  tasks: Task[]
}

interface Task {
  id: string
  name: string
  completed: boolean
}

export default function OnboardingModule() {
  const [onboardings, setOnboardings] = useState<OnboardingTask[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    candidateId: '',
    candidateName: '',
    period: 'Day 1',
  })

  const defaultTasks = {
    'Day 1': [
      'Office orientation',
      'System and access setup',
      'Team introduction',
      'Equipment distribution',
    ],
    '30-Day': [
      'Complete induction training',
      'Meet all team members',
      'Understand company processes',
      'First project assignment',
    ],
    '60-Day': [
      'Complete first project',
      'Receive feedback from manager',
      'Build relationships with peers',
      'Understand department goals',
    ],
    '90-Day': [
      'Full performance evaluation',
      'Discuss career development',
      'Confirm permanent status',
      'Plan long-term projects',
    ],
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('hiringData')
    if (saved) {
      const data = JSON.parse(saved)
      setOnboardings(data.onboardings || [])
      setCandidates(data.candidates || [])
    }
  }

  const saveData = (newOnboardings: OnboardingTask[]) => {
    const saved = localStorage.getItem('hiringData')
    const data = saved ? JSON.parse(saved) : {}
    data.onboardings = newOnboardings
    localStorage.setItem('hiringData', JSON.stringify(data))
  }

  const handleAddOnboarding = () => {
    if (formData.candidateId) {
      const defaultTaskList = defaultTasks[formData.period as keyof typeof defaultTasks] || []
      const newOnboarding: OnboardingTask = {
        id: Date.now().toString(),
        candidateId: formData.candidateId,
        candidateName: formData.candidateName,
        period: formData.period,
        tasks: defaultTaskList.map((task, index) => ({
          id: `${Date.now()}-${index}`,
          name: task,
          completed: false,
        })),
      }
      const updated = [...onboardings, newOnboarding]
      setOnboardings(updated)
      saveData(updated)
      setFormData({ candidateId: '', candidateName: '', period: 'Day 1' })
      setOpen(false)
    }
  }

  const handleDeleteOnboarding = (id: string) => {
    const updated = onboardings.filter(o => o.id !== id)
    setOnboardings(updated)
    saveData(updated)
  }

  const handleTaskToggle = (onboardingId: string, taskId: string) => {
    const updated = onboardings.map(o =>
      o.id === onboardingId
        ? {
            ...o,
            tasks: o.tasks.map(t =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          }
        : o
    )
    setOnboardings(updated)
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

  const acceptedOffers = localStorage.getItem('hiringData')
    ? JSON.parse(localStorage.getItem('hiringData')!).offers?.filter((o: any) => o.status === 'Accepted') || []
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Onboarding Module</h1>
          <p className="text-muted-foreground mt-2">Manage 30-60-90 day onboarding checklists</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
              Start Onboarding
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Employee Onboarding</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Employee</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={formData.candidateId}
                  onChange={(e) => handleCandidateSelect(e.target.value)}
                >
                  <option value="">Select an employee...</option>
                  {acceptedOffers.map((offer) => (
                    <option key={offer.candidateId} value={offer.candidateId}>
                      {offer.candidateName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Onboarding Period</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                >
                  <option value="Day 1">Day 1</option>
                  <option value="30-Day">30-Day</option>
                  <option value="60-Day">60-Day</option>
                  <option value="90-Day">90-Day</option>
                </select>
              </div>
              <Button onClick={handleAddOnboarding} className="w-full bg-primary text-primary-foreground">
                Create Checklist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {onboardings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No onboarding checklists created yet.</p>
          </Card>
        ) : (
          onboardings.map((onboarding) => {
            const completedTasks = onboarding.tasks.filter(t => t.completed).length
            const totalTasks = onboarding.tasks.length
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

            return (
              <Card key={onboarding.id} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">{onboarding.candidateName}</h3>
                    <p className="text-sm text-muted-foreground">{onboarding.period} Onboarding</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">{progress}%</p>
                      <p className="text-xs text-muted-foreground">
                        {completedTasks}/{totalTasks} completed
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteOnboarding(onboarding.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {onboarding.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(onboarding.id, task.id)}
                      />
                      <label
                        htmlFor={task.id}
                        className={`text-sm cursor-pointer flex-1 ${
                          task.completed ? 'text-muted-foreground line-through' : ''
                        }`}
                      >
                        {task.name}
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
