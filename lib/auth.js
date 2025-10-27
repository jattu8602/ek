import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('Email not verified')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          console.error('Credentials authorization error:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000, // Increase timeout to 10 seconds
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // console.log('Session callback:', {
      //   session: !!session,
      //   user: !!user,
      //   token: !!token,
      // })
      if (session?.user) {
        // For JWT strategy, token should be available
        if (token) {
          // console.log('Using JWT token:', { sub: token.sub, role: token.role })
          session.user.id = token.sub
          session.user.role = token.role
          session.user.emailVerified = token.emailVerified
        } else if (user) {
          // console.log('Using user from database:', {
          //   id: user.id,
          //   role: user.role,
          // })
          session.user.id = user.id
          session.user.role = user.role
          session.user.emailVerified = user.emailVerified
        }
      }
      // console.log('Final session:', session)
      return session
    },
    async jwt({ token, user, account }) {
      // console.log('JWT callback:', { user: !!user, account: !!account })
      if (user) {
        // console.log('Setting JWT token with user data:', {
        //   id: user.id,
        //   role: user.role,
        // })
        token.sub = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // console.log('Google sign in attempt:', {
          //   email: user.email,
          //   name: user.name,
          // })

          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            // console.log('Creating new user:', user.email)
            // Create new user with CUSTOMER role by default and auto-verify email
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: 'CUSTOMER',
                emailVerified: new Date(), // Auto-verify Google users
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
              // console.log('Linking Google account to existing user')
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

          // Check if user needs to set up password (Google users without password)
          const finalUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          // Temporarily disabled redirect to allow forgot-password page
          // if (finalUser && !finalUser.password) {
          //   // Redirect to verify-email page for password setup
          //   return '/verify-email?setup=password'
          // }

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
    strategy: 'jwt',
    maxAge: 1000 * 365 * 24 * 60 * 60, // 1000 years in seconds
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  trustHost: true, // Required for Vercel deployment
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // console.log('Sign in event:', {
      //   user: user.email,
      //   provider: account?.provider,
      // })
    },
    async signOut({ session, token }) {
      // console.log('Sign out event:', { user: session?.user?.email })
    },
  },
}

export default authOptions
