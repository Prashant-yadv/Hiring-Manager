'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  skills: string
  experience: string
  hiringStage: string
}

export default function ResumeScreening() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [appliedCandidates, setAppliedCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('hiringData')
    if (saved) {
      const data = JSON.parse(saved)
      const allCandidates = data.candidates || []
      setCandidates(allCandidates)
      setAppliedCandidates(allCandidates.filter((c: Candidate) => c.hiringStage === 'Applied'))
    }
  }

  const saveData = (newCandidates: Candidate[]) => {
    const saved = localStorage.getItem('hiringData')
    const data = saved ? JSON.parse(saved) : {}
    data.candidates = newCandidates
    localStorage.setItem('hiringData', JSON.stringify(data))
  }

  const handleScreenCandidate = (id: string, approve: boolean) => {
    const updated = candidates.map(c =>
      c.id === id ? { ...c, hiringStage: approve ? 'Screened' : 'Rejected' } : c
    )
    setCandidates(updated)
    saveData(updated)
    setAppliedCandidates(updated.filter((c: Candidate) => c.hiringStage === 'Applied'))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resume Screening</h1>
        <p className="text-muted-foreground mt-2">Review and screen candidate applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Applied</p>
          <p className="text-3xl font-bold">{appliedCandidates.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Screened</p>
          <p className="text-3xl font-bold">{candidates.filter(c => c.hiringStage === 'Screened').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Rejected</p>
          <p className="text-3xl font-bold">{candidates.filter(c => c.hiringStage === 'Rejected').length}</p>
        </Card>
      </div>

      <Card>
        {appliedCandidates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No candidates to screen. All candidates have been reviewed.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appliedCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell className="text-sm">{candidate.skills}</TableCell>
                  <TableCell className="text-sm">{candidate.experience}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleScreenCandidate(candidate.id, true)}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Shortlist
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleScreenCandidate(candidate.id, false)}
                      className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
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
