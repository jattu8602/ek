# 🌱 Database Seeding Guide

This guide explains how to populate your database with comprehensive dummy data for testing and development.

## 🚀 Quick Start

### 1. Run the Seeding Script

```bash
npm run db:seed
```

This will:

- Clear all existing data from the database
- Create comprehensive dummy data for all models
- Set up realistic relationships between data

## 📊 What Gets Seeded

### 👥 Users (21 total)

- **1 Admin User**
  - Email: `admin@ekta.com`
  - Password: `admin123`
  - Role: `ADMIN`
- **20 Regular Users**
  - Email: `user@email.com` (various)
  - Password: `password123`
  - Role: `CUSTOMER`

### 🌱 Products (20 total)

- **Seeds Category (6 products)**
  - Maize, Paddy, Wheat, Tomato, Chili, Okra seeds
- **Fertilizers Category (6 products)**
  - NPK, Urea, DAP, Zinc Sulphate, Iron Chelate, Vermicompost
- **Crop Protection Category (6 products)**
  - Herbicides, Insecticides, Fungicides, Seed Treatments
- **Tools Category (2 products)**
  - Garden Spade, Watering Can, Pruning Shears

### ⭐ Reviews & Ratings

- **5-15 reviews per product** (random)
- **1-5 star ratings** (random)
- **Realistic review text** from predefined samples
- **Product ratings automatically calculated** from individual ratings

### 🏠 User Addresses

- **1-2 addresses per user** (random)
- **Realistic Indian addresses** with proper cities, states, pincodes
- **Default address marked** for each user

### 📦 Orders (15 total)

- **Various order statuses**: PENDING, APPROVED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- **1-4 items per order** (random)
- **Realistic pricing** based on product units
- **Payment information** included

### ❤️ Favorites

- **3-8 favorite products per user** (random)
- **Realistic user preferences**

### 🛒 Cart Items

- **60% of users have items in cart** (random)
- **1-3 items per cart** (random)
- **Various quantities** and product units

### 🕒 Recent Products

- **2-6 recently viewed products per user** (random)
- **View dates within last 7 days** (random)

### 📧 Newsletter Subscribers (5 total)

- **Active subscribers** for testing newsletter functionality

## 🔧 Technical Details

### Database Models Seeded

- ✅ Users (with roles)
- ✅ Products (with categories/subcategories)
- ✅ ProductUnits (with pricing and stock)
- ✅ Reviews & Ratings
- ✅ Orders & OrderItems
- ✅ UserAddresses
- ✅ Favorites
- ✅ CartItems
- ✅ RecentProducts
- ✅ NewsletterSubscribers

### Data Relationships

- All foreign key relationships are properly maintained
- Product ratings are calculated from individual user ratings
- Order totals are calculated from order items
- User addresses are linked to orders

### Categories & Subcategories Used

- **Seeds**: Maize, Paddy, Wheat, Vegetable
- **Fertilizers**: MajorNutrients, Micronutrients, Organic
- **CropProtection**: Herbicide, Insecticide, Fungicide, SeedTreatment
- **Tools**: HandTools, Irrigation

## 🎯 Testing Scenarios

After seeding, you can test:

### User Authentication

- Login as admin: `admin@ekta.com` / `admin123`
- Login as customer: Any user email / `password123`

### Product Browsing

- Browse by category: `/seeds`, `/fertilizers`, `/crop-protection`, `/tools`
- Browse by subcategory: `/crop-protection/seedtreatment`
- View product details with reviews and ratings

### Shopping Features

- Add products to cart
- Add products to favorites
- Place orders
- View order history

### Admin Features

- View all users, products, orders
- Manage product inventory
- Process orders

## ⚠️ Important Notes

1. **Data Clearing**: The script clears ALL existing data before seeding
2. **Realistic Data**: All data is designed to be realistic for an agricultural e-commerce platform
3. **Indian Context**: Addresses, names, and products are tailored for Indian agricultural market
4. **Random Generation**: Some data is randomly generated for variety

## 🔄 Re-seeding

To re-seed the database with fresh data:

```bash
npm run db:seed
```

This will clear existing data and create new random data.

## 🛠️ Customization

To modify the seeded data:

1. Edit `scripts/seed.js`
2. Modify the data arrays at the top of the file
3. Adjust the seeding functions as needed
4. Run `npm run db:seed` again

## 📈 Performance

The seeding script is optimized for:

- Batch operations where possible
- Proper foreign key handling
- Realistic data distribution
- Fast execution (typically completes in 10-30 seconds)

---

**Happy Testing! 🚀**
