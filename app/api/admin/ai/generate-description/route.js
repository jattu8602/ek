import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Force dynamic rendering
export const dynamic = 'force-dynamic'




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

    const { productName, category, subcategory, language } =
      await request.json()

    if (!productName || !category) {
      return NextResponse.json(
        { error: 'Product name and category are required' },
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

    console.log('Using OpenAI API key:', openaiApiKey.substring(0, 10) + '...')

    // Generate description using OpenAI API
    const prompt = `You are an expert agricultural product description writer. Generate COMPLETE and MEANINGFUL product descriptions for "${productName}" in the ${category} category${
      subcategory ? `, specifically ${subcategory}` : ''
    }.

CRITICAL REQUIREMENTS:
- Generate TWO separate, COMPLETE descriptions
- Each description must be a COMPLETE SENTENCE with FULL MEANING
- Do NOT cut off or truncate any description
- Ensure proper grammar and sentence structure

1. ENGLISH VERSION (70-90 words):
- Write in clear, professional English
- Complete sentences with proper grammar
- Focus on agricultural benefits and features
- Use farming terminology
- Make it engaging for farmers
- END with a complete sentence

2. HINDI VERSION (70-90 words):
- Write in proper Hindi (Devanagari script)
- Complete sentences with proper Hindi grammar
- Use agricultural Hindi terminology
- Focus on किसानों के लिए benefits
- Make it natural and fluent Hindi
- END with a complete sentence

Both descriptions should be:
- Professional and informative
- Highlight key benefits and features
- Include relevant agricultural information
- Be suitable for farmers and agricultural professionals
- Make it impactful and engaging
- COMPLETE and MEANINGFUL

Format your response EXACTLY as:
ENGLISH: [Complete English description here]
HINDI: [Complete Hindi description here]`

    // Try different OpenAI models
    const models = ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo']
    let response
    let lastError

    for (const model of models) {
      try {
        console.log('Trying OpenAI model:', model)
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
                  'You are an expert agricultural product description writer. Generate professional, informative product descriptions for farmers and agricultural professionals.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: 400,
            temperature: 0.7,
            top_p: 1,
          }),
        })

        if (response.ok) {
          console.log('Success with OpenAI model:', model)
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
    console.log('OpenAI API Response:', JSON.stringify(data, null, 2))

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI API response structure:', data)
      throw new Error('Invalid response from OpenAI API')
    }

    const generatedContent = data.choices[0].message.content
    console.log('Generated content:', generatedContent)

    // Parse the response to extract English and Hindi descriptions
    const englishMatch = generatedContent.match(/ENGLISH:\s*(.+?)(?=HINDI:|$)/s)
    const hindiMatch = generatedContent.match(/HINDI:\s*(.+?)$/s)

    let englishDescription = englishMatch ? englishMatch[1].trim() : ''
    let hindiDescription = hindiMatch ? hindiMatch[1].trim() : ''

    // If parsing failed, try to extract from the full content
    if (!englishDescription && !hindiDescription) {
      // If no proper format found, use the full content as English
      englishDescription = generatedContent.trim()
      hindiDescription = generatedContent.trim()
    }

    // Ensure we have at least one description
    if (!englishDescription && !hindiDescription) {
      englishDescription = generatedContent.trim()
      hindiDescription = generatedContent.trim()
    }

    return NextResponse.json({
      description: {
        english: englishDescription,
        hindi: hindiDescription,
      },
      language: language,
    })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    )
  }
}
