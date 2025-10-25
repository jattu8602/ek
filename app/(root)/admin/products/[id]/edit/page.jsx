'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function EditProduct({ params }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

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

    // Fetch product data
    fetchProduct()
  }, [session, status, router, params.slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/products/${params.slug}`)

      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!product) return

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/products/${params.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          urlSlug: product.urlSlug,
          category: product.category,
          subcategory: product.subcategory,
          description: product.description,
          status: product.status,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      router.push('/admin/products')
    } catch (err) {
      setError(err.message)
      console.error('Error updating product:', err)
    } finally {
      setSaving(false)
    }
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
          <Button onClick={fetchProduct}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Product not found</p>
          <Link href="/admin/products">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Product Name
              </label>
              <Input
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">URL Slug</label>
              <Input
                value={product.urlSlug}
                onChange={(e) =>
                  setProduct({ ...product, urlSlug: e.target.value })
                }
                placeholder="product-url-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select
                value={product.category}
                onValueChange={(value) =>
                  setProduct({ ...product, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Seeds">Seeds</SelectItem>
                  <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                  <SelectItem value="Crop Protection">
                    Crop Protection
                  </SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Subcategory
              </label>
              <Input
                value={product.subcategory}
                onChange={(e) =>
                  setProduct({ ...product, subcategory: e.target.value })
                }
                placeholder="Enter subcategory"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Description
            </label>
            <Textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              placeholder="Enter product description"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={product.status}
              onValueChange={(value) =>
                setProduct({ ...product, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Units */}
      {product.units && product.units.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Product Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.units.map((unit, index) => (
                <div key={unit.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      Unit {index + 1}: {unit.number} {unit.type}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Actual Price:
                      </span>
                      <p className="font-medium">₹{unit.actualPrice}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Discounted Price:
                      </span>
                      <p className="font-medium">₹{unit.discountedPrice}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stock:</span>
                      <p className="font-medium">{unit.stock || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium">{unit.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Images */}
      {product.images && product.images.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-muted rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
