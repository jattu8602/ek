'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Search,
  X,
  Image as ImageIcon,
  Package,
  Wand2,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  {
    value: 'Seeds',
    label: 'Seeds',
    subcategories: ['Maize', 'Paddy', 'Wheat', 'Vegetable'],
  },
  {
    value: 'Fertilizers',
    label: 'Fertilizers',
    subcategories: ['Micronutrients', 'MajorNutrients', 'Organic'],
  },
  {
    value: 'Crop Protection',
    label: 'Crop Protection',
    subcategories: ['Herbicide', 'Insecticide', 'Fungicide', 'SeedTreatment'],
  },
  { value: 'Tools', label: 'Tools', subcategories: [] },
]

const UNIT_TYPES = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'ml', label: 'Milliliter (ml)' },
]

const UNIT_NUMBERS = [
  '1',
  '2',
  '5',
  '10',
  '25',
  '50',
  '100',
  '250',
  '500',
  '1000',
]

export default function AddProduct() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { language, t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [allSelectedImages, setAllSelectedImages] = useState([]) // Combined images from all sources
  const [searchingImages, setSearchingImages] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [showBothVersions, setShowBothVersions] = useState(false)
  const [bothDescriptions, setBothDescriptions] = useState({
    english: '',
    hindi: '',
  })

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    units: [], // Array of unit objects with pricing and stock
    status: 'ACTIVE',
  })

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

  const generateUrlSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate URL slug when name changes
    if (field === 'name') {
      const slug = generateUrlSlug(value)
      setFormData((prev) => ({
        ...prev,
        urlSlug: slug,
      }))
    }
  }

  const addUnit = () => {
    const newUnit = {
      id: Date.now(), // Temporary ID
      number: '1',
      type: 'kg',
      actualPrice: '',
      discountedPrice: '',
      stock: '',
      status: 'ACTIVE',
    }
    setFormData((prev) => ({
      ...prev,
      units: [...prev.units, newUnit],
    }))
  }

  const removeUnit = (unitId) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.filter((unit) => unit.id !== unitId),
    }))
  }

  const updateUnit = (unitId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.map((unit) =>
        unit.id === unitId ? { ...unit, [field]: value } : unit
      ),
    }))
  }

  const generateUnitSuggestions = async (currentUnit, allUnits) => {
    try {
      // Call AI API to generate suggestions
      const response = await fetch('/api/admin/ai/generate-unit-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUnit,
          existingUnits: allUnits,
          productName: formData.name,
          category: formData.category,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate suggestions')

      const data = await response.json()
      return data.suggestions || []
    } catch (error) {
      console.error('Error generating unit suggestions:', error)
      // Fallback to local calculations
      return generateLocalSuggestions(currentUnit)
    }
  }

  const generateLocalSuggestions = (currentUnit) => {
    // Local fallback suggestions
    const suggestions = []

    if (currentUnit.number && currentUnit.type && currentUnit.actualPrice) {
      const basePrice = parseFloat(currentUnit.actualPrice)
      const baseNumber = parseFloat(currentUnit.number)

      if (currentUnit.type === 'kg') {
        suggestions.push({
          number: (baseNumber * 2).toString(),
          type: 'kg',
          actualPrice: (basePrice * 2).toString(),
          discountedPrice: (basePrice * 2 * 0.9).toString(),
        })
        suggestions.push({
          number: (baseNumber * 5).toString(),
          type: 'kg',
          actualPrice: (basePrice * 5).toString(),
          discountedPrice: (basePrice * 5 * 0.9).toString(),
        })
      }
    }

    return suggestions
  }

  const generateDescription = async () => {
    if (!formData.name || !formData.category) {
      alert('Please enter product name and category first')
      return
    }

    try {
      setGeneratingDescription(true)
      const response = await fetch('/api/admin/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.name,
          category: formData.category,
          subcategory: formData.subcategory,
          language: language,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate description')

      const data = await response.json()

      // Store both descriptions
      setBothDescriptions({
        english: data.description.english || '',
        hindi: data.description.hindi || '',
      })

      // Use the appropriate description based on current language
      const descriptionToUse =
        data.description[language] ||
        data.description.english ||
        data.description

      setFormData((prev) => ({
        ...prev,
        description: descriptionToUse,
      }))
    } catch (error) {
      console.error('Error generating description:', error)
      alert('Failed to generate description. Please try again.')
    } finally {
      setGeneratingDescription(false)
    }
  }

  const searchImages = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearchingImages(true)
      const response = await fetch('/api/admin/images/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) throw new Error('Failed to search images')

      const data = await response.json()
      setSearchResults(data.images || [])
    } catch (error) {
      console.error('Error searching images:', error)
      alert('Failed to search images. Please try again.')
    } finally {
      setSearchingImages(false)
    }
  }

  const addImageFromSearch = (image) => {
    const newImage = {
      id: Date.now(),
      url: image.url,
      thumb: image.thumb,
      alt: image.alt,
      source: 'search',
      order: allSelectedImages.length + 1,
    }
    setAllSelectedImages((prev) => [...prev, newImage])
  }

  const addImageFromUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage = {
        id: Date.now(),
        url: e.target.result,
        thumb: e.target.result,
        alt: file.name,
        source: 'upload',
        order: allSelectedImages.length + 1,
      }
      setAllSelectedImages((prev) => [...prev, newImage])
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (imageId) => {
    setAllSelectedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId)
      // Reorder remaining images
      return filtered.map((img, index) => ({ ...img, order: index + 1 }))
    })
  }

  const moveImageUp = (imageId) => {
    setAllSelectedImages((prev) => {
      const imageIndex = prev.findIndex((img) => img.id === imageId)
      if (imageIndex <= 0) return prev

      const newImages = [...prev]
      const temp = newImages[imageIndex]
      newImages[imageIndex] = newImages[imageIndex - 1]
      newImages[imageIndex - 1] = temp

      // Update order numbers
      return newImages.map((img, index) => ({ ...img, order: index + 1 }))
    })
  }

  const moveImageDown = (imageId) => {
    setAllSelectedImages((prev) => {
      const imageIndex = prev.findIndex((img) => img.id === imageId)
      if (imageIndex >= prev.length - 1) return prev

      const newImages = [...prev]
      const temp = newImages[imageIndex]
      newImages[imageIndex] = newImages[imageIndex + 1]
      newImages[imageIndex + 1] = temp

      // Update order numbers
      return newImages.map((img, index) => ({ ...img, order: index + 1 }))
    })
  }

  const uploadImages = async () => {
    const uploadedUrls = []

    for (const image of allSelectedImages) {
      try {
        const response = await fetch('/api/admin/images/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: image.url }),
        })

        if (!response.ok) throw new Error('Failed to upload image')

        const data = await response.json()
        uploadedUrls.push(data.url)
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Upload images
      const imageUrls = await uploadImages()

      // Process units data
      const processedUnits = formData.units.map((unit) => ({
        number: unit.number,
        type: unit.type,
        actualPrice: parseFloat(unit.actualPrice) || 0,
        discountedPrice: parseFloat(unit.discountedPrice) || 0,
        stock: unit.stock ? parseInt(unit.stock) : null,
        status: unit.status,
      }))

      // Create product
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          subcategory: formData.subcategory,
          description: formData.description,
          urlSlug: generateUrlSlug(formData.name),
          images: imageUrls,
          units: processedUnits,
          status: formData.status,
        }),
      })

      if (!response.ok) throw new Error('Failed to create product')

      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = CATEGORIES.find(
    (cat) => cat.value === formData.category
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product for your store
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange('category', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    handleInputChange('subcategory', value)
                  }
                  disabled={
                    !formData.category ||
                    !selectedCategory?.subcategories.length
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory?.subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="description">Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateDescription}
                  disabled={
                    generatingDescription ||
                    !formData.name ||
                    !formData.category
                  }
                >
                  {generatingDescription ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Description
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder={
                  language === 'hindi'
                    ? 'उत्पाद विवरण दर्ज करें या AI का उपयोग करके जेनरेट करें'
                    : 'Enter product description or generate using AI'
                }
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'hindi'
                  ? 'विवरण हिंदी और अंग्रेजी दोनों में जेनरेट होगा, आपकी भाषा के अनुसार दिखेगा'
                  : 'Description will be generated in both Hindi and English, will show according to your language'}
              </p>

              {/* Show both versions button */}
              {bothDescriptions.english && bothDescriptions.hindi && (
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBothVersions(!showBothVersions)}
                  >
                    {showBothVersions ? 'Hide' : 'Show'} Both Versions
                  </Button>
                </div>
              )}

              {/* Both versions display */}
              {showBothVersions &&
                bothDescriptions.english &&
                bothDescriptions.hindi && (
                  <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        English Version:
                      </h4>
                      <p className="text-sm">{bothDescriptions.english}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        Hindi Version:
                      </h4>
                      <p className="text-sm">{bothDescriptions.hindi}</p>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Pricing & Units */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Units</CardTitle>
            <CardDescription>
              Add multiple units with individual pricing and stock
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Unit Button */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Product Units</h3>
                <p className="text-sm text-muted-foreground">
                  Add different unit sizes with their own pricing
                </p>
              </div>
              <Button onClick={addUnit} variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </div>

            {/* Units List */}
            {formData.units.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No units added yet. Click "Add Unit" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.units.map((unit, index) => (
                  <Card key={unit.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold">Unit {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUnit(unit.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Unit Size */}
                      <div>
                        <Label>Unit Size</Label>
                        <div className="flex gap-2">
                          <Select
                            value={unit.number}
                            onValueChange={(value) =>
                              updateUnit(unit.id, 'number', value)
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {UNIT_NUMBERS.map((num) => (
                                <SelectItem key={num} value={num}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={unit.type}
                            onValueChange={(value) =>
                              updateUnit(unit.id, 'type', value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {UNIT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div>
                        <Label>Actual Price (₹)</Label>
                        <Input
                          type="number"
                          value={unit.actualPrice}
                          onChange={(e) =>
                            updateUnit(unit.id, 'actualPrice', e.target.value)
                          }
                          placeholder="Enter actual price"
                        />
                      </div>

                      <div>
                        <Label>Discounted Price (₹)</Label>
                        <Input
                          type="number"
                          value={unit.discountedPrice}
                          onChange={(e) =>
                            updateUnit(
                              unit.id,
                              'discountedPrice',
                              e.target.value
                            )
                          }
                          placeholder="Enter discounted price"
                        />
                      </div>

                      {/* Stock & Status */}
                      <div>
                        <Label>Stock Quantity (Optional)</Label>
                        <Input
                          type="number"
                          value={unit.stock}
                          onChange={(e) =>
                            updateUnit(unit.id, 'stock', e.target.value)
                          }
                          placeholder="Enter stock quantity"
                        />
                      </div>

                      <div>
                        <Label>Status</Label>
                        <Select
                          value={unit.status}
                          onValueChange={(value) =>
                            updateUnit(unit.id, 'status', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                            <SelectItem value="OUT_OF_STOCK">
                              Out of Stock
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* AI Suggestions */}
                      {index > 0 && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const suggestions =
                                  await generateUnitSuggestions(
                                    unit,
                                    formData.units
                                  )
                                if (suggestions.length > 0) {
                                  const suggestion = suggestions[0]
                                  updateUnit(
                                    unit.id,
                                    'number',
                                    suggestion.number
                                  )
                                  updateUnit(unit.id, 'type', suggestion.type)
                                  updateUnit(
                                    unit.id,
                                    'actualPrice',
                                    suggestion.actualPrice
                                  )
                                  updateUnit(
                                    unit.id,
                                    'discountedPrice',
                                    suggestion.discountedPrice
                                  )
                                }
                              } catch (error) {
                                console.error(
                                  'Error applying AI suggestions:',
                                  error
                                )
                                alert(
                                  'Failed to generate AI suggestions. Using local calculations.'
                                )
                              }
                            }}
                          >
                            <Wand2 className="h-4 w-4 mr-2" />
                            AI Suggestions
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Global Status */}
            <div>
              <Label htmlFor="status">Overall Product Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
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
      )}

      {/* Step 3: Images */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Add images for your product using AI search or manual upload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="search" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="search">AI Image Search</TabsTrigger>
                    <TabsTrigger value="upload">Manual Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="search" className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search for images..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchImages()}
                      />
                      <Button onClick={searchImages} disabled={searchingImages}>
                        {searchingImages ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>

                    {searchResults.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {searchResults.map((image, index) => (
                          <div
                            key={index}
                            className="relative group cursor-pointer"
                            onClick={() => addImageFromSearch(image)}
                          >
                            <img
                              src={image.thumb}
                              alt={image.alt}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                              <Check className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        Drag and drop images here, or click to select
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            Array.from(e.target.files).forEach(
                              addImageFromUpload
                            )
                          }
                        }}
                        className="mt-4"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Selected Images */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Images</CardTitle>
                <CardDescription>
                  {allSelectedImages.length} image
                  {allSelectedImages.length !== 1 ? 's' : ''} selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allSelectedImages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No images selected yet</p>
                    <p className="text-sm">
                      Use AI search or upload to add images
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allSelectedImages
                      .sort((a, b) => a.order - b.order)
                      .map((image, index) => (
                        <div key={image.id} className="relative group">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                              {image.order}
                            </div>
                            <img
                              src={image.thumb}
                              alt={image.alt}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {image.alt}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {image.source === 'search'
                                  ? 'AI Search'
                                  : 'Upload'}
                              </p>
                            </div>
                          </div>

                          {/* Image Controls */}
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-6 w-6 p-0"
                                onClick={() => moveImageUp(image.id)}
                                disabled={index === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-6 w-6 p-0"
                                onClick={() => moveImageDown(image.id)}
                                disabled={
                                  index === allSelectedImages.length - 1
                                }
                              >
                                ↓
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-6 w-6 p-0"
                                onClick={() => removeImage(image.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Submit</CardTitle>
            <CardDescription>
              Review your product details before creating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Category:</strong> {formData.category}
                  </p>
                  <p>
                    <strong>Subcategory:</strong> {formData.subcategory}
                  </p>
                  <p>
                    <strong>Description:</strong> {formData.description}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Product Units</h3>
                <div className="space-y-2 text-sm">
                  {formData.units.length > 0 ? (
                    <div className="space-y-3">
                      {formData.units.map((unit, index) => (
                        <div key={unit.id} className="p-3 bg-muted rounded-lg">
                          <p className="font-medium">
                            Unit {index + 1}: {unit.number} {unit.type}
                          </p>
                          <p>
                            <strong>Actual Price:</strong> ₹{unit.actualPrice}
                          </p>
                          <p>
                            <strong>Discounted Price:</strong> ₹
                            {unit.discountedPrice}
                          </p>
                          {unit.stock && (
                            <p>
                              <strong>Stock:</strong> {unit.stock}
                            </p>
                          )}
                          <p>
                            <strong>Status:</strong> {unit.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No units added</p>
                  )}
                  <p>
                    <strong>Overall Status:</strong> {formData.status}
                  </p>
                </div>
              </div>
            </div>

            {allSelectedImages.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  Selected Images ({allSelectedImages.length})
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {allSelectedImages
                    .sort((a, b) => a.order - b.order)
                    .map((image, index) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.thumb}
                          alt={image.alt}
                          className="w-full h-20 object-cover rounded"
                        />
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                          {image.order}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
            disabled={
              !formData.name ||
              !formData.category ||
              (currentStep === 2 && formData.units.length === 0)
            }
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating Product...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Create Product
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
