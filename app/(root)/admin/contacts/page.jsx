'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Trash2,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Mail,
  Phone,
} from 'lucide-react'

export default function AdminContactsPage() {
  const { t } = useLanguage()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    REVIEWED: 'bg-blue-100 text-blue-800',
    RESPONDED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  }

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/contacts?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSubmissions(data.submissions)
      } else {
        setError(data.error || 'Failed to fetch submissions')
      }
    } catch (err) {
      setError('Failed to fetch submissions')
    } finally {
      setLoading(false)
    }
  }

  const updateSubmission = async (id, status, notes) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes: notes }),
      })

      if (response.ok) {
        fetchSubmissions()
        setIsDialogOpen(false)
        setAdminNotes('')
        setSelectedStatus('')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update submission')
      }
    } catch (err) {
      setError('Failed to update submission')
    }
  }

  const deleteSubmission = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSubmissions()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete submission')
      }
    } catch (err) {
      setError('Failed to delete submission')
    }
  }

  const openDialog = (submission) => {
    setSelectedSubmission(submission)
    setAdminNotes(submission.adminNotes || '')
    setSelectedStatus(submission.status)
    setIsDialogOpen(true)
  }

  useEffect(() => {
    fetchSubmissions()
  }, [statusFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.contacts.title')}</h1>
          <p className="text-muted-foreground">
            Manage contact form submissions
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="PENDING">
                {t('admin.status.pending')}
              </SelectItem>
              <SelectItem value="REVIEWED">
                {t('admin.status.reviewed')}
              </SelectItem>
              <SelectItem value="RESPONDED">
                {t('admin.status.responded')}
              </SelectItem>
              <SelectItem value="ARCHIVED">
                {t('admin.status.archived')}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchSubmissions} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions ({submissions.length})</CardTitle>
          <CardDescription>
            Review and manage customer contact form submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{submission.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {submission.user.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          {submission.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          {submission.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {submission.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[submission.status]}>
                        {t(`admin.status.${submission.status.toLowerCase()}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSubmission(submission.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>
              Review and update the contact submission
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <div className="p-2 bg-muted rounded">
                    {selectedSubmission.name}
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="p-2 bg-muted rounded">
                    {selectedSubmission.email}
                  </div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="p-2 bg-muted rounded">
                    {selectedSubmission.phone}
                  </div>
                </div>
                <div>
                  <Label>User Account</Label>
                  <div className="p-2 bg-muted rounded">
                    {selectedSubmission.user.name}
                  </div>
                </div>
              </div>

              <div>
                <Label>Message</Label>
                <div className="p-3 bg-muted rounded min-h-24">
                  {selectedSubmission.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">
                        {t('admin.status.pending')}
                      </SelectItem>
                      <SelectItem value="REVIEWED">
                        {t('admin.status.reviewed')}
                      </SelectItem>
                      <SelectItem value="RESPONDED">
                        {t('admin.status.responded')}
                      </SelectItem>
                      <SelectItem value="ARCHIVED">
                        {t('admin.status.archived')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Submitted</Label>
                  <div className="p-2 bg-muted rounded">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this submission..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    updateSubmission(
                      selectedSubmission.id,
                      selectedStatus,
                      adminNotes
                    )
                  }
                >
                  Update Submission
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
