'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, Edit2 } from 'lucide-react'

interface Role {
  id: string
  department: string
  role: string
  hiringReason: string
  priority: string
}

export default function ManpowerPlanning() {
  const [roles, setRoles] = useState<Role[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    department: '',
    role: '',
    hiringReason: '',
    priority: 'Medium',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('hiringData')
    if (saved) {
      const data = JSON.parse(saved)
      setRoles(data.roles || [])
    }
  }

  const saveData = (newRoles: Role[]) => {
    const saved = localStorage.getItem('hiringData')
    const data = saved ? JSON.parse(saved) : {}
    data.roles = newRoles
    localStorage.setItem('hiringData', JSON.stringify(data))
  }

  const handleAddRole = () => {
    if (formData.department && formData.role) {
      const newRole: Role = {
        id: Date.now().toString(),
        ...formData,
      }
      const updated = [...roles, newRole]
      setRoles(updated)
      saveData(updated)
      setFormData({ department: '', role: '', hiringReason: '', priority: 'Medium' })
      setOpen(false)
    }
  }

  const handleEditRole = (id: string) => {
    const role = roles.find(r => r.id === id)
    if (role) {
      setFormData({
        department: role.department,
        role: role.role,
        hiringReason: role.hiringReason,
        priority: role.priority,
      })
      setEditId(id)
      setOpen(true)
    }
  }

  const handleUpdateRole = () => {
    if (editId && formData.department && formData.role) {
      const updated = roles.map(r =>
        r.id === editId ? { ...r, ...formData } : r
      )
      setRoles(updated)
      saveData(updated)
      setFormData({ department: '', role: '', hiringReason: '', priority: 'Medium' })
      setEditId(null)
      setOpen(false)
    }
  }

  const handleDeleteRole = (id: string) => {
    const updated = roles.filter(r => r.id !== id)
    setRoles(updated)
    saveData(updated)
  }

  const handleOpenDialog = () => {
    setEditId(null)
    setFormData({ department: '', role: '', hiringReason: '', priority: 'Medium' })
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manpower Planning</h1>
          <p className="text-muted-foreground mt-2">Manage your open roles and hiring requirements</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="gap-2 bg-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Role' : 'Add New Role'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Department</Label>
                <Input
                  placeholder="e.g., Engineering, Sales"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  placeholder="e.g., Senior Developer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <Label>Hiring Reason</Label>
                <Input
                  placeholder="e.g., Expansion, Replacement"
                  value={formData.hiringReason}
                  onChange={(e) => setFormData({ ...formData, hiringReason: e.target.value })}
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={editId ? handleUpdateRole : handleAddRole} className="w-full bg-primary text-primary-foreground">
                {editId ? 'Update Role' : 'Add Role'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        {roles.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No roles added yet. Create your first role to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Hiring Reason</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.department}</TableCell>
                  <TableCell>{role.role}</TableCell>
                  <TableCell>{role.hiringReason}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      role.priority === 'High' ? 'bg-red-100 text-red-800' :
                      role.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {role.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRole(role.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
