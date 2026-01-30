'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2, Edit2, Briefcase, TrendingUp, DollarSign, Calendar } from 'lucide-react'

interface Offer {
  id: string
  candidateId: string
  candidateName: string
  role: string
  salary: string
  joiningDate: string
  status: string
}

const statuses = ['Verbal', 'Written', 'Accepted', 'Rejected']

export default function OfferManagement() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    candidateId: '',
    candidateName: '',
    role: '',
    salary: '',
    joiningDate: '',
    status: 'Verbal',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('hiringData')
    if (saved) {
      const data = JSON.parse(saved)
      setOffers(data.offers || [])
      setCandidates(data.candidates || [])
    }
  }

  const saveData = (newOffers: Offer[]) => {
    const saved = localStorage.getItem('hiringData')
    const data = saved ? JSON.parse(saved) : {}
    data.offers = newOffers
    localStorage.setItem('hiringData', JSON.stringify(data))
  }

  const handleAddOffer = () => {
    if (formData.candidateId && formData.role && formData.salary) {
      const newOffer: Offer = {
        id: Date.now().toString(),
        ...formData,
      }
      const updated = [...offers, newOffer]
      setOffers(updated)
      saveData(updated)
      setFormData({ candidateId: '', candidateName: '', role: '', salary: '', joiningDate: '', status: 'Verbal' })
      setOpen(false)
    }
  }

  const handleEditOffer = (id: string) => {
    const offer = offers.find(o => o.id === id)
    if (offer) {
      setFormData({
        candidateId: offer.candidateId,
        candidateName: offer.candidateName,
        role: offer.role,
        salary: offer.salary,
        joiningDate: offer.joiningDate,
        status: offer.status,
      })
      setEditId(id)
      setOpen(true)
    }
  }

  const handleUpdateOffer = () => {
    if (editId && formData.candidateId && formData.role) {
      const updated = offers.map(o =>
        o.id === editId ? { ...o, ...formData } : o
      )
      setOffers(updated)
      saveData(updated)
      setFormData({ candidateId: '', candidateName: '', role: '', salary: '', joiningDate: '', status: 'Verbal' })
      setEditId(null)
      setOpen(false)
    }
  }

  const handleDeleteOffer = (id: string) => {
    const updated = offers.filter(o => o.id !== id)
    setOffers(updated)
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

  const handleOpenDialog = () => {
    setEditId(null)
    setFormData({ candidateId: '', candidateName: '', role: '', salary: '', joiningDate: '', status: 'Verbal' })
    setOpen(true)
  }

  const statusConfig = {
    Verbal: { color: 'from-blue-500 to-cyan-500', icon: '💬', bg: 'bg-blue-50 dark:bg-blue-950', badge: 'bg-blue-600' },
    Written: { color: 'from-purple-500 to-pink-500', icon: '📄', bg: 'bg-purple-50 dark:bg-purple-950', badge: 'bg-purple-600' },
    Accepted: { color: 'from-green-500 to-emerald-500', icon: '✅', bg: 'bg-green-50 dark:bg-green-950', badge: 'bg-green-600' },
    Rejected: { color: 'from-red-500 to-pink-500', icon: '❌', bg: 'bg-red-50 dark:bg-red-950', badge: 'bg-red-600' },
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white p-8 rounded-xl shadow-lg flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Offer Management</h1>
          <p className="text-orange-50">Create and track job offers throughout the hiring process</p>
        </div>
        <Briefcase className="w-12 h-12 opacity-80" />
      </div>

      <div className="flex items-center justify-between">
        <div></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog} className="gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-lg">
              <Plus className="w-4 h-4" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Offer' : 'Create Offer'}</DialogTitle>
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
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
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
                <Label>Salary (Annual)</Label>
                <Input
                  placeholder="e.g., 120000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
              <div>
                <Label>Joining Date</Label>
                <Input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Offer Status</Label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={editId ? handleUpdateOffer : handleAddOffer} className="w-full bg-primary text-primary-foreground">
                {editId ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2 uppercase tracking-wide">Total Offers</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">{offers.length}</p>
            </div>
            <Briefcase className="w-10 h-10 text-amber-600 opacity-30" />
          </div>
        </Card>
        <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wide">Verbal</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{offers.filter(o => o.status === 'Verbal').length}</p>
            </div>
            <span className="text-2xl">💬</span>
          </div>
        </Card>
        <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wide">Written</p>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{offers.filter(o => o.status === 'Written').length}</p>
            </div>
            <span className="text-2xl">📄</span>
          </div>
        </Card>
        <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2 uppercase tracking-wide">Accepted</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{offers.filter(o => o.status === 'Accepted').length}</p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </Card>
      </div>

      {offers.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-2">No offers yet</p>
          <p className="text-sm text-gray-500">Create your first offer to track candidate placements</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const config = statusConfig[offer.status as keyof typeof statusConfig] || statusConfig.Verbal
            return (
              <Card key={offer.id} className={`p-6 border-0 hover:shadow-xl transition-all ${config.bg} overflow-hidden`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`bg-gradient-to-r ${config.color} p-2 rounded-lg`}>
                        <span className="text-xl">{config.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{offer.candidateName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{offer.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Salary</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">${offer.salary}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Joining</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{offer.joiningDate || 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</p>
                        <span className={`${config.badge} text-white text-sm font-bold px-3 py-1 rounded-full inline-block mt-1`}>
                          {config.icon} {offer.status}
                        </span>
                      </div>
                      <div className="flex gap-2 items-end">
                        <Button
                          size="sm"
                          onClick={() => handleEditOffer(offer.id)}
                          className="flex-1 bg-white text-gray-900 hover:bg-gray-100 dark:bg-slate-700 dark:text-white"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
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
