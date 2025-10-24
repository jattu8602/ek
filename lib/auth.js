import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000, // Increase timeout to 10 seconds
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          console.log('Google sign in attempt:', {
            email: user.email,
            name: user.name,
          })

          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            console.log('Creating new user:', user.email)
            // Create new user with CUSTOMER role by default
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: 'CUSTOMER',
              },
            })
            console.log('User created successfully')
          } else {
            console.log('Existing user found:', existingUser.email)

            // Check if account is already linked
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: 'google',
                providerAccountId: account.providerAccountId,
              },
            })

            if (!existingAccount) {
              console.log('Linking Google account to existing user')
              // Link the Google account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: 'oauth',
                  provider: 'google',
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              })
              console.log('Account linked successfully')
            } else {
              console.log('Account already linked')
            }
          }
          return true
        } catch (error) {
          console.error('Error during sign in:', error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true, // Required for Vercel deployment
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('Sign in event:', {
        user: user.email,
        provider: account?.provider,
      })
    },
    async signOut({ session, token }) {
      console.log('Sign out event:', { user: session?.user?.email })
    },
  },
}

export default authOptions
