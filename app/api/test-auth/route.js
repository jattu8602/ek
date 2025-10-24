import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all users and their linked accounts
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
      },
    })

    return NextResponse.json({
      status: 'success',
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accounts: user.accounts.map((account) => ({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        })),
      })),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        message: 'Failed to fetch users',
      },
      { status: 500 }
    )
  }
}
