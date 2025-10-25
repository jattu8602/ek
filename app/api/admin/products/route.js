import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    // Build where clause
    const where = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { subcategory: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          units: true,
          _count: {
            select: {
              reviews: true,
              ratings: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      urlSlug,
      category,
      subcategory,
      images,
      units,
      description,
      status,
    } = body

    // Validate required fields
    if (!name || !urlSlug || !category || !units || units.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if URL slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { urlSlug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this URL slug already exists' },
        { status: 400 }
      )
    }

    console.log('Creating product with data:', {
      name,
      urlSlug,
      category,
      subcategory,
      units: units.length,
    })

    // Create product with units
    const product = await prisma.product.create({
      data: {
        name,
        urlSlug,
        category,
        subcategory,
        images: images || [],
        description: description || '',
        status: status || 'ACTIVE',
        units: {
          create: units.map((unit) => ({
            number: unit.number,
            type: unit.type,
            actualPrice: unit.actualPrice,
            discountedPrice: unit.discountedPrice,
            stock: unit.stock,
            status: unit.status || 'ACTIVE',
          })),
        },
      },
      include: {
        units: true,
      },
    })

    console.log('Product created successfully:', product.id)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
