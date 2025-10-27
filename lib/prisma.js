import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Database connection retry logic
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pooling optimization for Vercel
    ...(process.env.NODE_ENV === 'production' && {
      __internal: {
        engine: {
          connectionLimit: 1,
        },
      },
    }),
  })
}

// Retry connection logic for production
const connectWithRetry = async (prismaClient, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await prismaClient.$connect()
      console.log('Database connected successfully')
      return prismaClient
    } catch (error) {
      console.error(
        `Database connection attempt ${i + 1} failed:`,
        error.message
      )
      if (i === maxRetries - 1) {
        console.error('All database connection attempts failed')
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
    }
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

// Connect with retry in production
if (process.env.NODE_ENV === 'production') {
  connectWithRetry(prisma).catch((error) => {
    console.error('Failed to establish database connection:', error)
  })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
