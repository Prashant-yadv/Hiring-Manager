'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, Eye } from 'lucide-react'

interface JobDescription {
  id: string
  roleId: string
  title: string
  description: string
  requirements: string
  responsibilities: string
}

export default function JobDescriptionBuilder() {
  const [roles, setRoles] = useState<any[]>([])
  const [jds, setJds] = useState<JobDescription[]>([])
  const [open, setOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedJd, setSelectedJd] = useState<JobDescription | null>(null)
  const [formData, setFormData] = useState({
    roleId: '',
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('hiringData')
    if (saved) {
      const data = JSON.parse(saved)
      setRoles(data.roles || [])
      setJds(data.jobDescriptions || [])
    }
  }

  const saveData = (newJds: JobDescription[]) => {
    const saved = localStorage.getItem('hiringData')
    const data = saved ? JSON.parse(saved) : {}
    data.jobDescriptions = newJds
    localStorage.setItem('hiringData', JSON.stringify(data))
  }

  const handleAddJd = () => {
    if (formData.title && formData.roleId) {
      const newJd: JobDescription = {
        id: Date.now().toString(),
        ...formData,
      }
      const updated = [...jds, newJd]
      setJds(updated)
      saveData(updated)
      setFormData({ roleId: '', title: '', description: '', requirements: '', responsibilities: '' })
      setOpen(false)
    }
  }

  const handleDeleteJd = (id: string) => {
    const updated = jds.filter(j => j.id !== id)
    setJds(updated)
    saveData(updated)
  }

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    return role ? `${role.role} - ${role.department}` : 'Unknown Role'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Description Builder</h1>
          <p className="text-muted-foreground mt-2">Create and manage detailed job descriptions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
              New JD
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Job Description</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Role</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                >
                  <option value="">Choose a role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role} - {role.department}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Job Title</Label>
                <Input
                  placeholder="e.g., Senior Full Stack Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Write a comprehensive job description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Key Responsibilities</Label>
                <Textarea
                  placeholder="List the main responsibilities..."
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Requirements</Label>
                <Textarea
                  placeholder="List required skills and experience..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                />
              </div>
              <Button onClick={handleAddJd} className="w-full bg-primary text-primary-foreground">
                Create Job Description
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jds.length === 0 ? (
          <Card className="p-8 col-span-full text-center">
            <p className="text-muted-foreground">No job descriptions created yet. Create one to get started.</p>
          </Card>
        ) : (
          jds.map((jd) => (
            <Card key={jd.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{jd.title}</h3>
                  <p className="text-sm text-muted-foreground">{getRoleName(jd.roleId)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedJd(jd)
                      setPreviewOpen(true)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteJd(jd.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{jd.description}</p>
            </Card>
          ))
        )}
      </div>

      {selectedJd && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedJd.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">About the Role</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedJd.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Responsibilities</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedJd.responsibilities}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedJd.requirements}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
