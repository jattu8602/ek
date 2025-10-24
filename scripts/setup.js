#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up database...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')

    // You can add any initial data setup here
    console.log('✅ Database setup complete!')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
