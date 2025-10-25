import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

    const { query, count = 12 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Search images from Unsplash
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY

    if (!unsplashAccessKey) {
      return NextResponse.json(
        { error: 'Unsplash API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${unsplashAccessKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch images from Unsplash')
    }

    const data = await response.json()

    // Transform the response to include only the data we need
    const images = data.results.map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      alt: photo.alt_description || photo.description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error searching images:', error)
    return NextResponse.json(
      { error: 'Failed to search images' },
      { status: 500 }
    )
  }
}
