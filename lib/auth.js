import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions = {
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
    async redirect({ url, baseUrl }) {
      // After successful OAuth, allow the redirect to complete
      // The client-side useEffect will handle role-based routing
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async session({ session, user, token }) {
      console.log('Session callback:', {
        session: !!session,
        user: !!user,
        token: !!token,
        tokenSub: token?.sub,
        tokenRole: token?.role,
        sessionUser: session?.user?.email,
      })

      if (session?.user) {
        // For JWT strategy, token should be available
        if (token) {
          console.log('Using JWT token:', {
            sub: token.sub,
            role: token.role,
            emailVerified: token.emailVerified,
          })
          session.user.id = token.sub
          session.user.role = token.role
          session.user.emailVerified = token.emailVerified
        } else if (user) {
          console.log('Using user from database:', {
            id: user.id,
            role: user.role,
            emailVerified: user.emailVerified,
          })
          session.user.id = user.id
          session.user.role = user.role
          session.user.emailVerified = user.emailVerified
        }
      }

      console.log('Final session:', {
        user: session?.user?.email,
        id: session?.user?.id,
        role: session?.user?.role,
        emailVerified: session?.user?.emailVerified,
      })
      return session
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', {
        user: !!user,
        account: !!account,
        userId: user?.id,
        userIdLength: user?.id?.length,
        accountProvider: account?.provider,
      })
      if (user) {
        console.log('Setting JWT token with user data:', {
          id: user.id,
          idLength: user.id?.length,
          role: user.role,
        })

        // Validate that user.id is a proper MongoDB ObjectId (24 characters)
        if (user.id && user.id.length !== 24) {
          console.error('Invalid user ID in JWT callback:', {
            id: user.id,
            length: user.id.length,
            expectedLength: 24,
          })
          // Don't set the token if the ID is invalid
          return token
        }

        token.sub = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          console.log('Google sign in attempt:', {
            email: user.email,
            name: user.name,
            providerAccountId: account.providerAccountId,
          })

          // Add timeout protection for database operations
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error('Database operation timeout')),
              10000
            )
          })

          // Check if user exists with timeout protection
          const existingUser = await Promise.race([
            prisma.user.findUnique({
              where: { email: user.email },
            }),
            timeoutPromise,
          ])

          if (!existingUser) {
            console.log('Creating new user:', user.email)
            // Create new user with CUSTOMER role by default and auto-verify email
            await Promise.race([
              prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  role: 'CUSTOMER',
                  emailVerified: new Date(), // Auto-verify Google users
                },
              }),
              timeoutPromise,
            ])
            console.log('User created successfully')
          } else {
            console.log('Existing user found:', existingUser.email)

            // Check if account is already linked with timeout protection
            const existingAccount = await Promise.race([
              prisma.account.findFirst({
                where: {
                  userId: existingUser.id,
                  provider: 'google',
                  providerAccountId: account.providerAccountId,
                },
              }),
              timeoutPromise,
            ])

            if (!existingAccount) {
              console.log('Linking Google account to existing user')
              // Link the Google account to the existing user with timeout protection
              await Promise.race([
                prisma.account.create({
                  data: {
                    userId: existingUser.id,
                    type: 'oauth',
                    provider: 'google',
                    providerAccountId: account.providerAccountId, // This is the Google user ID (21 chars)
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                  },
                }),
                timeoutPromise,
              ])
              console.log('Account linked successfully')
            } else {
              console.log('Account already linked')
            }
          }

          // Use the existing user data instead of querying again
          // finalUser is already available from existingUser or newly created user
          const finalUser =
            existingUser ||
            (await Promise.race([
              prisma.user.findUnique({
                where: { email: user.email },
              }),
              timeoutPromise,
            ]))

          // Temporarily disabled redirect to allow forgot-password page
          // if (finalUser && !finalUser.password) {
          //   // Redirect to verify-email page for password setup
          //   return '/verify-email?setup=password'
          // }

          // Update the user object with our database user data
          // This ensures the JWT callback gets the correct MongoDB ObjectId
          if (finalUser) {
            user.id = finalUser.id
            user.role = finalUser.role
            user.emailVerified = finalUser.emailVerified
            console.log('Updated user object with database data:', {
              id: user.id,
              idLength: user.id?.length,
              role: user.role,
            })
          }

          return true
        } catch (error) {
          // Detailed error logging for different failure modes
          if (error.message === 'Database operation timeout') {
            console.error('Google sign in failed - Database timeout:', {
              email: user?.email,
              providerAccountId: account?.providerAccountId,
              error: 'Database operation exceeded 10 second timeout',
            })
          } else if (error.code === 'P2002') {
            console.error('Google sign in failed - Duplicate entry:', {
              email: user?.email,
              error: 'User or account already exists',
              code: error.code,
            })
          } else if (error.code === 'P1001') {
            console.error('Google sign in failed - Database connection:', {
              email: user?.email,
              error: 'Cannot reach database server',
              code: error.code,
            })
          } else {
            console.error('Google sign in failed - Unknown error:', {
              error: error.message,
              stack: error.stack,
              email: user?.email,
              providerAccountId: account?.providerAccountId,
              code: error.code,
            })
          }
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
    updateAge: 60, // Update session every 60 seconds instead of 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug for production troubleshooting
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
