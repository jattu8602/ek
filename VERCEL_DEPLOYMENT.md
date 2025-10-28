# 🚀 Vercel Deployment Guide - OAuth Fix

## Critical Environment Variables

**IMPORTANT**: These environment variables MUST be set correctly in Vercel for OAuth to work in production.

### Required Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

```env
# NextAuth - CRITICAL FOR OAUTH
NEXTAUTH_URL=https://ek-qnty.vercel.app
NEXTAUTH_SECRET=your-production-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=your-mongodb-connection-string

# Other
NEXT_PUBLIC_URL=https://ek-qnty.vercel.app
```

### ⚠️ Critical: NEXTAUTH_URL

**THE NEXTAUTH_URL MUST EXACTLY MATCH YOUR VERCEL PRODUCTION URL**

- ✅ Correct: `https://ek-qnty.vercel.app` (no trailing slash)
- ❌ Wrong: `http://ek-qnty.vercel.app` (http instead of https)
- ❌ Wrong: `https://ek-qnty.vercel.app/` (trailing slash)
- ❌ Wrong: `https://www.ek-qnty.vercel.app` (www subdomain if not used)

### Google OAuth Authorized Redirect URI

In Google Cloud Console, add this redirect URI:

```
https://ek-qnty.vercel.app/api/auth/callback/google
```

**Replace `ek-qnty.vercel.app` with your actual Vercel domain.**

## What Was Fixed

### 1. Cookie Configuration

- ✅ Added proper secure cookie settings for production (HTTPS)
- ✅ Used `__Secure-` prefix for production cookies
- ✅ Set `httpOnly`, `sameSite: lax`, and `secure` flags

### 2. Session Configuration

- ✅ Removed custom session token generator that was breaking cookies
- ✅ Set proper session duration (30 days)
- ✅ Added `useSecureCookies` for production

### 3. Redirect Handling

- ✅ Enhanced redirect callback to handle production URL
- ✅ Added proper URL validation for Vercel deployment

## Testing the Fix

After deploying with correct environment variables:

1. Go to your production URL
2. Click "Sign in with Google"
3. Authenticate with Google
4. You should be redirected back and **stay logged in**
5. Check browser cookies - you should see `__Secure-next-auth.session-token`

## Troubleshooting

### Session appears then disappears

- **Cause**: `NEXTAUTH_URL` doesn't match your actual domain
- **Fix**: Set `NEXTAUTH_URL` to exact production URL in Vercel

### Cookie not being set

- **Cause**: Google redirect URI mismatch
- **Fix**: Add exact callback URL in Google Cloud Console

### "Configuration error" in logs

- **Cause**: Missing `NEXTAUTH_SECRET`
- **Fix**: Generate a secret: `openssl rand -base64 32` and add to Vercel

## Environment Variable Checklist

Before deploying, verify:

- [ ] `NEXTAUTH_URL` is set to production URL (https, no trailing slash)
- [ ] `NEXTAUTH_SECRET` is set (generate with `openssl rand -base64 32`)
- [ ] `GOOGLE_CLIENT_ID` is set
- [ ] `GOOGLE_CLIENT_SECRET` is set
- [ ] Google Cloud Console has correct redirect URI
- [ ] All environment variables are set for "Production" environment in Vercel

## After Deployment

1. Redeploy your Vercel project after setting environment variables
2. Clear your browser cookies for the domain
3. Test OAuth login flow
4. Check Vercel logs for any errors

## Support

If issues persist, check Vercel logs:

- Go to Vercel Dashboard → Your Project → Logs
- Look for NextAuth debug logs with session/JWT information
