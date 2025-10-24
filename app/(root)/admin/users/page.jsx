'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  ArrowLeft,
  UserPlus,
  Shield,
  User,
} from 'lucide-react'
import Link from 'next/link'

export default function AdminUsers() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  // Mock users data
  const users = [
    {
      id: 'USER-001',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'CUSTOMER',
      status: 'Active',
      joinDate: '2024-01-15',
      orders: 12,
    },
    {
      id: 'USER-002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'CUSTOMER',
      status: 'Active',
      joinDate: '2024-02-20',
      orders: 8,
    },
    {
      id: 'USER-003',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      status: 'Active',
      joinDate: '2024-01-01',
      orders: 0,
    },
    {
      id: 'USER-004',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'CUSTOMER',
      status: 'Inactive',
      joinDate: '2024-03-10',
      orders: 3,
    },
    {
      id: 'USER-005',
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'CUSTOMER',
      status: 'Active',
      joinDate: '2024-02-28',
      orders: 15,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">
                Manage customer accounts and permissions
              </p>
            </div>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-10" />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage user accounts and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      {user.role === 'ADMIN' ? (
                        <Shield className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            user.role === 'ADMIN' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                        <Badge
                          variant={
                            user.status === 'Active' ? 'default' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Joined: {user.joinDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Orders: {user.orders}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {user.role !== 'ADMIN' && (
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {users.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                No users match your current filters
              </p>
              <Button variant="outline">Clear Filters</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

