import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Clear all existing account records to start fresh
    const deletedAccounts = await prisma.account.deleteMany({
      where: {
        provider: 'google',
      },
    })

    return NextResponse.json({
      status: 'success',
      message: 'Google accounts cleared',
      deletedCount: deletedAccounts.count,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        message: 'Failed to clear accounts',
      },
      { status: 500 }
    )
  }
}
