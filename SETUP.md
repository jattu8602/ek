# 🚀 Ekta Krishi Kendra - Setup Guide

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console account

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ekta-krishi-kendra?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

#### MongoDB Atlas Setup:

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `DATABASE_URL` in `.env.local`

#### Push Schema to Database:

```bash
npm run db:push
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### 5. Generate Prisma Client

```bash
npm run db:generate
```

### 6. Test Database Connection

```bash
npm run setup
```

### 7. Start Development Server

```bash
npm run dev
```

## 🔐 Authentication Features

### User Roles:

- **CUSTOMER** (default) - Can browse, add to cart, favorites
- **ADMIN** - Full access to admin dashboard

### Authentication Flow:

1. User clicks "Add to Cart" or "Add to Favorites"
2. If not logged in → Redirects to `/login`
3. Google OAuth login
4. After login:
   - **Customer** → Redirects to `/`
   - **Admin** → Redirects to `/admin`

## 🛒 Cart & Favorites System

### Features:

- ✅ Add/remove items from cart
- ✅ Add/remove items from favorites
- ✅ Authentication guards
- ✅ Session persistence
- ✅ Real-time state management

### API Endpoints:

- `GET /api/cart` - Fetch user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart quantity
- `DELETE /api/cart` - Remove from cart
- `GET /api/favorites` - Fetch user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites

## 🗄️ Database Schema

### Models:

- **User** - User accounts with roles
- **CartItem** - Shopping cart items
- **Favorite** - User favorites
- **Account** - OAuth accounts
- **Session** - User sessions

## 🚀 Deployment

### Environment Variables for Production:

```env
NEXTAUTH_URL="https://yourdomain.com"
DATABASE_URL="your-production-mongodb-url"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-production-client-id"
GOOGLE_CLIENT_SECRET="your-production-client-secret"
```

### Build for Production:

```bash
npm run build
npm start
```

## 🔧 Troubleshooting

### Common Issues:

1. **NextAuth Version Conflict**: Use `--legacy-peer-deps` flag
2. **Database Connection**: Check MongoDB connection string
3. **Google OAuth**: Verify redirect URI matches exactly
4. **Prisma Issues**: Run `npm run db:generate` after schema changes

### Useful Commands:

```bash
# View database in browser
npm run db:studio

# Reset database
npx prisma db push --force-reset

# Check Prisma status
npx prisma db pull
```

## 📱 Features Implemented

- ✅ Google OAuth Authentication
- ✅ Role-based Access Control
- ✅ Shopping Cart System
- ✅ Favorites/Wishlist
- ✅ Session Management
- ✅ Protected Routes
- ✅ Multi-language Support
- ✅ Responsive Design
- ✅ Product Management
- ✅ Admin Dashboard
