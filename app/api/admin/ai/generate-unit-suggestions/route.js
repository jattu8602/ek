import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    const { currentUnit, existingUnits, productName, category } =
      await request.json()

    if (!currentUnit || !productName || !category) {
      return NextResponse.json(
        { error: 'Current unit, product name, and category are required' },
        { status: 400 }
      )
    }

    // Get admin's OpenAI API key or use fallback
    let openaiApiKey = process.env.OPENAI_API_KEY // Fallback from .env

    try {
      const adminSettings = await prisma.adminSettings.findUnique({
        where: { userId: session.user.id },
      })

      if (adminSettings?.openaiApiKey) {
        openaiApiKey = adminSettings.openaiApiKey
      }
    } catch (error) {
      console.log('Using fallback OpenAI API key')
    }

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 400 }
      )
    }

    console.log(
      'Using OpenAI API key for unit suggestions:',
      openaiApiKey.substring(0, 10) + '...'
    )

    // Generate unit suggestions using OpenAI API
    const prompt = `You are an expert agricultural product pricing analyst. Generate smart unit suggestions for "${productName}" in the ${category} category.

Current Unit: ${currentUnit.number} ${currentUnit.type} - ₹${
      currentUnit.actualPrice
    } (₹${currentUnit.discountedPrice} discounted)
Existing Units: ${existingUnits
      .map((u) => `${u.number} ${u.type} - ₹${u.actualPrice}`)
      .join(', ')}

Generate 2-3 smart unit suggestions that would make sense for this product:

1. Consider common unit sizes for this product type
2. Calculate appropriate pricing based on the current unit
3. Consider bulk pricing discounts
4. Think about what farmers typically buy

Format your response as:
SUGGESTION 1: [number] [type] - ₹[actualPrice] (₹[discountedPrice] discounted)
SUGGESTION 2: [number] [type] - ₹[actualPrice] (₹[discountedPrice] discounted)
SUGGESTION 3: [number] [type] - ₹[actualPrice] (₹[discountedPrice] discounted)

Make sure the suggestions are realistic and follow agricultural product pricing patterns.`

    // Try different OpenAI models
    const models = ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo']
    let response
    let lastError

    for (const model of models) {
      try {
        console.log('Trying OpenAI model for unit suggestions:', model)
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert agricultural product pricing analyst. Generate smart unit suggestions for agricultural products based on existing pricing patterns and market standards.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: 300,
            temperature: 0.7,
            top_p: 1,
          }),
        })

        if (response.ok) {
          console.log('Success with OpenAI model for unit suggestions:', model)
          break
        } else {
          const errorText = await response.text()
          console.log(`Failed with ${model}:`, response.status, errorText)
          lastError = new Error(
            `OpenAI API error: ${response.status} - ${errorText}`
          )
        }
      } catch (error) {
        console.log(`Error with ${model}:`, error.message)
        lastError = error
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error('All OpenAI API models failed')
    }

    const data = await response.json()
    console.log(
      'OpenAI API Response for unit suggestions:',
      JSON.stringify(data, null, 2)
    )

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI API response structure:', data)
      throw new Error('Invalid response from OpenAI API')
    }

    const generatedContent = data.choices[0].message.content
    console.log('Generated unit suggestions:', generatedContent)

    // Parse the response to extract suggestions
    const suggestions = []
    const suggestionRegex =
      /SUGGESTION \d+: (\d+(?:\.\d+)?) (\w+) - ₹(\d+(?:\.\d+)?) \(₹(\d+(?:\.\d+)?) discounted\)/g
    let match

    while ((match = suggestionRegex.exec(generatedContent)) !== null) {
      suggestions.push({
        number: match[1],
        type: match[2],
        actualPrice: match[3],
        discountedPrice: match[4],
      })
    }

    // If parsing failed, generate fallback suggestions
    if (suggestions.length === 0) {
      const basePrice = parseFloat(currentUnit.actualPrice)
      const baseNumber = parseFloat(currentUnit.number)

      suggestions.push({
        number: (baseNumber * 2).toString(),
        type: currentUnit.type,
        actualPrice: (basePrice * 2).toString(),
        discountedPrice: (basePrice * 2 * 0.9).toString(),
      })

      suggestions.push({
        number: (baseNumber * 5).toString(),
        type: currentUnit.type,
        actualPrice: (basePrice * 5).toString(),
        discountedPrice: (basePrice * 5 * 0.9).toString(),
      })
    }

    return NextResponse.json({
      suggestions: suggestions,
      generatedContent: generatedContent,
    })
  } catch (error) {
    console.error('Error generating unit suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate unit suggestions' },
      { status: 500 }
    )
  }
}
