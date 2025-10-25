'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

export default function AdminProducts() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentImageIndex, setCurrentImageIndex] = useState({})

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/admin/products?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

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

    // Fetch products when component mounts
    fetchProducts()
  }, [session, status, router])

  // Refetch when filters change
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchProducts()
    }
  }, [searchTerm, categoryFilter, statusFilter])

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete product')

      // Remove product from local state
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const nextImage = (productId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }))
  }

  const prevImage = (productId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages,
    }))
  }

  const getProductPriceRange = (units) => {
    if (!units || units.length === 0) return { min: 0, max: 0 }

    const prices = units.map((unit) => unit.discountedPrice)
    const min = Math.min(...prices)
    const max = Math.max(...prices)

    if (min === max) return { min, max, single: true }
    return { min, max, single: false }
  }

  const getTotalStock = (units) => {
    if (!units || units.length === 0) return 0
    return units.reduce((total, unit) => total + (unit.stock || 0), 0)
  }

  if (status === 'loading' || loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Seeds">Seeds</SelectItem>
                <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                <SelectItem value="Crop Protection">Crop Protection</SelectItem>
                <SelectItem value="Tools">Tools</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const currentIndex = currentImageIndex[product.id] || 0
          const hasMultipleImages = product.images && product.images.length > 1
          const priceRange = getProductPriceRange(product.units)
          const totalStock = getTotalStock(product.units)

          return (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-muted relative group">
                <img
                  src={product.images?.[currentIndex] || '/product-maize-1.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {hasMultipleImages && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        prevImage(product.id, product.images.length)
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        nextImage(product.id, product.images.length)
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {product.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      product.status === 'ACTIVE'
                        ? 'default'
                        : product.status === 'LOW_STOCK'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="text-xs"
                  >
                    {product.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                    {product.subcategory && (
                      <CardDescription className="text-xs">
                        {product.subcategory}
                      </CardDescription>
                    )}
                  </div>
                  <div className="text-right">
                    {priceRange.single ? (
                      <p className="text-lg font-bold">₹{priceRange.min}</p>
                    ) : (
                      <p className="text-lg font-bold">
                        ₹{priceRange.min} - ₹{priceRange.max}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Stock: {totalStock}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.units?.length || 0} unit
                      {product.units?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/product/${product.id}`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No products match your current filters'
                : 'Get started by adding your first product'}
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
              {(searchTerm ||
                categoryFilter !== 'all' ||
                statusFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setCategoryFilter('all')
                    setStatusFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
