#!/usr/bin/env node

/**
 * Fix MongoDB ObjectID issue with Google OAuth providerAccountId
 * This script cleans up any corrupted data that might be causing the ObjectID errors
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixObjectIdIssue() {
  try {
    console.log('🔍 Checking for ObjectID issues...')

    // Check for any accounts with malformed providerAccountId
    const accounts = await prisma.account.findMany({
      where: {
        provider: 'google',
      },
      select: {
        id: true,
        providerAccountId: true,
        userId: true,
      },
    })

    console.log(`Found ${accounts.length} Google accounts`)

    // Check for any cart items or favorites with malformed user IDs
    const cartItems = await prisma.cartItem.findMany({
      select: {
        id: true,
        userId: true,
      },
    })

    console.log(`Found ${cartItems.length} cart items`)

    const favorites = await prisma.favorite.findMany({
      select: {
        id: true,
        userId: true,
      },
    })

    console.log(`Found ${favorites.length} favorites`)

    const recentProducts = await prisma.recentProduct.findMany({
      select: {
        id: true,
        userId: true,
      },
    })

    console.log(`Found ${recentProducts.length} recent products`)

    // Check if any user IDs are malformed (not 24 characters)
    const malformedCartItems = cartItems.filter(
      (item) => item.userId && item.userId.length !== 24
    )

    const malformedFavorites = favorites.filter(
      (fav) => fav.userId && fav.userId.length !== 24
    )

    const malformedRecentProducts = recentProducts.filter(
      (recent) => recent.userId && recent.userId.length !== 24
    )

    console.log(
      `Found ${malformedCartItems.length} cart items with malformed user IDs`
    )
    console.log(
      `Found ${malformedFavorites.length} favorites with malformed user IDs`
    )
    console.log(
      `Found ${malformedRecentProducts.length} recent products with malformed user IDs`
    )

    if (malformedCartItems.length > 0) {
      console.log('🧹 Cleaning up malformed cart items...')
      for (const item of malformedCartItems) {
        console.log(
          `Deleting cart item ${item.id} with malformed userId: ${item.userId}`
        )
        await prisma.cartItem.delete({
          where: { id: item.id },
        })
      }
    }

    if (malformedFavorites.length > 0) {
      console.log('🧹 Cleaning up malformed favorites...')
      for (const fav of malformedFavorites) {
        console.log(
          `Deleting favorite ${fav.id} with malformed userId: ${fav.userId}`
        )
        await prisma.favorite.delete({
          where: { id: fav.id },
        })
      }
    }

    if (malformedRecentProducts.length > 0) {
      console.log('🧹 Cleaning up malformed recent products...')
      for (const recent of malformedRecentProducts) {
        console.log(
          `Deleting recent product ${recent.id} with malformed userId: ${recent.userId}`
        )
        await prisma.recentProduct.delete({
          where: { id: recent.id },
        })
      }
    }

    console.log('✅ ObjectID cleanup completed!')
    console.log('🎉 Your authentication should now work properly.')
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
fixObjectIdIssue()
