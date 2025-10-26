#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Sample data arrays
const sampleNames = [
  'Rajesh Kumar',
  'Priya Sharma',
  'Amit Singh',
  'Sunita Patel',
  'Vikram Gupta',
  'Meera Reddy',
  'Suresh Kumar',
  'Anita Joshi',
  'Ravi Verma',
  'Kavita Singh',
  'Manoj Tiwari',
  'Deepa Agarwal',
  'Sanjay Mehta',
  'Rekha Jain',
  'Arun Kumar',
  'Pooja Sharma',
  'Rohit Singh',
  'Neha Gupta',
  'Vishal Patel',
  'Shilpa Reddy',
  'Kiran Kumar',
  'Suman Verma',
  'Rajesh Tiwari',
  'Anjali Agarwal',
  'Mukesh Jain',
]

const sampleEmails = [
  'rajesh.kumar@email.com',
  'priya.sharma@email.com',
  'amit.singh@email.com',
  'sunita.patel@email.com',
  'vikram.gupta@email.com',
  'meera.reddy@email.com',
  'suresh.kumar@email.com',
  'anita.joshi@email.com',
  'ravi.verma@email.com',
  'kavita.singh@email.com',
  'manoj.tiwari@email.com',
  'deepa.agarwal@email.com',
  'sanjay.mehta@email.com',
  'rekha.jain@email.com',
  'arun.kumar@email.com',
  'pooja.sharma@email.com',
  'rohit.singh@email.com',
  'neha.gupta@email.com',
  'vishal.patel@email.com',
  'shilpa.reddy@email.com',
  'kiran.kumar@email.com',
  'suman.verma@email.com',
  'rajesh.tiwari@email.com',
  'anjali.agarwal@email.com',
  'mukesh.jain@email.com',
]

const samplePhones = [
  '9876543210',
  '9876543211',
  '9876543212',
  '9876543213',
  '9876543214',
  '9876543215',
  '9876543216',
  '9876543217',
  '9876543218',
  '9876543219',
  '9876543220',
  '9876543221',
  '9876543222',
  '9876543223',
  '9876543224',
  '9876543225',
  '9876543226',
  '9876543227',
  '9876543228',
  '9876543229',
  '9876543230',
  '9876543231',
  '9876543232',
  '9876543233',
  '9876543234',
]

const sampleAddresses = [
  {
    name: 'Rajesh Kumar',
    phone: '9876543210',
    address: '123 Main Street, Sector 15',
    city: 'Chandigarh',
    state: 'Punjab',
    pincode: '160015',
    landmark: 'Near City Center',
  },
  {
    name: 'Priya Sharma',
    phone: '9876543211',
    address: '456 Green Avenue, Block A',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    landmark: 'Opposite Metro Station',
  },
  {
    name: 'Amit Singh',
    phone: '9876543212',
    address: '789 Farm Road, Village Center',
    city: 'Ludhiana',
    state: 'Punjab',
    pincode: '141001',
    landmark: 'Near Agricultural Market',
  },
]

const sampleCities = [
  'Chandigarh',
  'Delhi',
  'Ludhiana',
  'Amritsar',
  'Jalandhar',
  'Patiala',
  'Bathinda',
  'Mohali',
]
const sampleStates = [
  'Punjab',
  'Delhi',
  'Haryana',
  'Himachal Pradesh',
  'Rajasthan',
]
const samplePincodes = [
  '160015',
  '110001',
  '141001',
  '143001',
  '144001',
  '147001',
  '151001',
  '140301',
]

// Product data with proper categories and subcategories
const productData = [
  // Seeds Category
  {
    name: 'Pioneer Maize Seeds (3355)',
    urlSlug: 'pioneer-maize-3355',
    category: 'Seeds',
    subcategory: 'Maize',
    images: [
      '/product-maize-1.jpg',
      '/product-maize-1.jpg',
      '/product-maize-1.jpg',
    ],
    description:
      'High-quality Pioneer brand maize seeds for excellent yield. Suitable for all soil types. Resistant to common diseases and pests.',
    units: [
      {
        number: '1',
        type: 'kg',
        actualPrice: 500,
        discountedPrice: 420,
        stock: 100,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 2400,
        discountedPrice: 2000,
        stock: 50,
      },
      {
        number: '10',
        type: 'kg',
        actualPrice: 4500,
        discountedPrice: 3800,
        stock: 25,
      },
    ],
  },
  {
    name: 'Paddy Seeds Premium (IR-64)',
    urlSlug: 'paddy-seeds-premium-ir64',
    category: 'Seeds',
    subcategory: 'Paddy',
    images: ['/product-maize-1.jpg', '/product-maize-1.jpg'],
    description:
      'Premium quality paddy seeds with high germination rate. Suitable for both Kharif and Rabi seasons.',
    units: [
      {
        number: '1',
        type: 'kg',
        actualPrice: 800,
        discountedPrice: 650,
        stock: 80,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 3800,
        discountedPrice: 3200,
        stock: 40,
      },
      {
        number: '25',
        type: 'kg',
        actualPrice: 18000,
        discountedPrice: 15000,
        stock: 15,
      },
    ],
  },
  {
    name: 'Wheat Seeds HD-2967',
    urlSlug: 'wheat-seeds-hd2967',
    category: 'Seeds',
    subcategory: 'Wheat',
    images: ['/product-maize-1.jpg'],
    description:
      'High yielding wheat variety suitable for all regions. Excellent disease resistance and good grain quality.',
    units: [
      {
        number: '1',
        type: 'kg',
        actualPrice: 600,
        discountedPrice: 510,
        stock: 120,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 2900,
        discountedPrice: 2500,
        stock: 60,
      },
      {
        number: '25',
        type: 'kg',
        actualPrice: 14000,
        discountedPrice: 12000,
        stock: 20,
      },
    ],
  },
  {
    name: 'Tomato Seeds Hybrid (Pusa Ruby)',
    urlSlug: 'tomato-seeds-hybrid-pusa-ruby',
    category: 'Seeds',
    subcategory: 'Vegetable',
    images: ['/product-maize-1.jpg', '/product-maize-1.jpg'],
    description:
      'Hybrid tomato seeds with excellent disease resistance. High yield and good fruit quality.',
    units: [
      {
        number: '10',
        type: 'gm',
        actualPrice: 400,
        discountedPrice: 320,
        stock: 200,
      },
      {
        number: '50',
        type: 'gm',
        actualPrice: 1800,
        discountedPrice: 1500,
        stock: 100,
      },
      {
        number: '100',
        type: 'gm',
        actualPrice: 3500,
        discountedPrice: 2800,
        stock: 50,
      },
    ],
  },
  {
    name: 'Chili Seeds Hot Variety',
    urlSlug: 'chili-seeds-hot-variety',
    category: 'Seeds',
    subcategory: 'Vegetable',
    images: ['/product-maize-1.jpg'],
    description:
      'High yielding chili seeds with excellent pungency. Suitable for commercial cultivation.',
    units: [
      {
        number: '10',
        type: 'gm',
        actualPrice: 300,
        discountedPrice: 250,
        stock: 150,
      },
      {
        number: '50',
        type: 'gm',
        actualPrice: 1400,
        discountedPrice: 1200,
        stock: 75,
      },
      {
        number: '100',
        type: 'gm',
        actualPrice: 2700,
        discountedPrice: 2200,
        stock: 40,
      },
    ],
  },
  {
    name: 'Okra Seeds Green Long',
    urlSlug: 'okra-seeds-green-long',
    category: 'Seeds',
    subcategory: 'Vegetable',
    images: ['/product-maize-1.jpg'],
    description:
      'Premium okra seeds producing long, tender, and green pods. High yield potential.',
    units: [
      {
        number: '10',
        type: 'gm',
        actualPrice: 250,
        discountedPrice: 200,
        stock: 180,
      },
      {
        number: '50',
        type: 'gm',
        actualPrice: 1200,
        discountedPrice: 1000,
        stock: 90,
      },
      {
        number: '100',
        type: 'gm',
        actualPrice: 2300,
        discountedPrice: 1900,
        stock: 45,
      },
    ],
  },

  // Fertilizers Category
  {
    name: 'NPK Fertilizer 19:19:19',
    urlSlug: 'npk-fertilizer-19-19-19',
    category: 'Fertilizers',
    subcategory: 'MajorNutrients',
    images: ['/product-maize-1.jpg', '/product-maize-1.jpg'],
    description:
      'Balanced NPK fertilizer for all crops. Improves soil fertility and crop yield significantly.',
    units: [
      {
        number: '1',
        type: 'kg',
        actualPrice: 1500,
        discountedPrice: 1300,
        stock: 80,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 7200,
        discountedPrice: 6200,
        stock: 40,
      },
      {
        number: '25',
        type: 'kg',
        actualPrice: 35000,
        discountedPrice: 30000,
        stock: 15,
      },
      {
        number: '50',
        type: 'kg',
        actualPrice: 68000,
        discountedPrice: 58000,
        stock: 8,
      },
    ],
  },
  {
    name: 'Urea Fertilizer 46-0-0',
    urlSlug: 'urea-fertilizer-46-0-0',
    category: 'Fertilizers',
    subcategory: 'MajorNutrients',
    images: ['/product-maize-1.jpg'],
    description:
      'High nitrogen content urea fertilizer. Essential for vegetative growth of crops.',
    units: [
      {
        number: '1',
        type: 'kg',
        actualPrice: 800,
        discountedPrice: 700,
        stock: 100,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 3800,
        discountedPrice: 3300,
        stock: 50,
      },
      {
        number: '25',
        type: 'kg',
        actualPrice: 18000,
        discountedPrice: 16000,
        stock: 20,
      },
      {
        number: '50',
        type: 'kg',
        actualPrice: 35000,
        discountedPrice: 30000,
        stock: 10,
      },
    ],
  },
  {
    name: 'DAP Fertilizer 18-46-0',
    urlSlug: 'dap-fertilizer-18-46-0',
    category: 'Fertilizers',
    subcategory: 'MajorNutrients',
    images: ['/product-maize-1.jpg'],
    description:
      'Diammonium Phosphate fertilizer with high phosphorus content. Excellent for root development.',
    units: [
      {
        number: '1',
        type: 'kg',
        actualPrice: 1200,
        discountedPrice: 1000,
        stock: 90,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 5800,
        discountedPrice: 4800,
        stock: 45,
      },
      {
        number: '25',
        type: 'kg',
        actualPrice: 28000,
        discountedPrice: 23000,
        stock: 18,
      },
      {
        number: '50',
        type: 'kg',
        actualPrice: 55000,
        discountedPrice: 45000,
        stock: 9,
      },
    ],
  },
  {
    name: 'Zinc Sulphate Micronutrient',
    urlSlug: 'zinc-sulphate-micronutrient',
    category: 'Fertilizers',
    subcategory: 'Micronutrients',
    images: ['/product-maize-1.jpg'],
    description:
      'Essential micronutrient for healthy crop growth. Prevents zinc deficiency in plants.',
    units: [
      {
        number: '500',
        type: 'gm',
        actualPrice: 350,
        discountedPrice: 280,
        stock: 200,
      },
      {
        number: '1',
        type: 'kg',
        actualPrice: 650,
        discountedPrice: 520,
        stock: 100,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 3000,
        discountedPrice: 2500,
        stock: 50,
      },
    ],
  },
  {
    name: 'Iron Chelate Micronutrient',
    urlSlug: 'iron-chelate-micronutrient',
    category: 'Fertilizers',
    subcategory: 'Micronutrients',
    images: ['/product-maize-1.jpg'],
    description:
      'Chelated iron micronutrient for preventing iron deficiency. Highly effective and fast acting.',
    units: [
      {
        number: '500',
        type: 'gm',
        actualPrice: 450,
        discountedPrice: 380,
        stock: 150,
      },
      {
        number: '1',
        type: 'kg',
        actualPrice: 850,
        discountedPrice: 720,
        stock: 75,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 4000,
        discountedPrice: 3400,
        stock: 30,
      },
    ],
  },
  {
    name: 'Vermicompost Organic Fertilizer',
    urlSlug: 'vermicompost-organic-fertilizer',
    category: 'Fertilizers',
    subcategory: 'Organic',
    images: ['/product-maize-1.jpg'],
    description:
      '100% organic vermicompost made from cow dung and organic waste. Improves soil structure.',
    units: [
      {
        number: '1',
        type: 'kg',
        actualPrice: 200,
        discountedPrice: 180,
        stock: 300,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 950,
        discountedPrice: 850,
        stock: 150,
      },
      {
        number: '25',
        type: 'kg',
        actualPrice: 4500,
        discountedPrice: 4000,
        stock: 60,
      },
    ],
  },

  // Crop Protection Category
  {
    name: 'Herbicide Glyphosate 41%',
    urlSlug: 'herbicide-glyphosate-41',
    category: 'CropProtection',
    subcategory: 'Herbicide',
    images: ['/product-maize-1.jpg', '/product-maize-1.jpg'],
    description:
      'Effective weed killer for all types of weeds. Safe for crops when used as directed.',
    units: [
      {
        number: '500',
        type: 'ml',
        actualPrice: 900,
        discountedPrice: 750,
        stock: 120,
      },
      {
        number: '1',
        type: 'litre',
        actualPrice: 1700,
        discountedPrice: 1400,
        stock: 60,
      },
      {
        number: '5',
        type: 'litre',
        actualPrice: 8000,
        discountedPrice: 6800,
        stock: 20,
      },
    ],
  },
  {
    name: 'Insecticide Imidacloprid 17.8%',
    urlSlug: 'insecticide-imidacloprid-17-8',
    category: 'CropProtection',
    subcategory: 'Insecticide',
    images: ['/product-maize-1.jpg'],
    description:
      'Systemic insecticide for controlling sucking pests. Long-lasting protection.',
    units: [
      {
        number: '250',
        type: 'ml',
        actualPrice: 1200,
        discountedPrice: 1000,
        stock: 100,
      },
      {
        number: '500',
        type: 'ml',
        actualPrice: 2300,
        discountedPrice: 1900,
        stock: 50,
      },
      {
        number: '1',
        type: 'litre',
        actualPrice: 4500,
        discountedPrice: 3800,
        stock: 25,
      },
    ],
  },
  {
    name: 'Fungicide Mancozeb 75%',
    urlSlug: 'fungicide-mancozeb-75',
    category: 'CropProtection',
    subcategory: 'Fungicide',
    images: ['/product-maize-1.jpg'],
    description:
      'Broad spectrum fungicide for controlling various fungal diseases in crops.',
    units: [
      {
        number: '500',
        type: 'gm',
        actualPrice: 800,
        discountedPrice: 650,
        stock: 150,
      },
      {
        number: '1',
        type: 'kg',
        actualPrice: 1500,
        discountedPrice: 1200,
        stock: 75,
      },
      {
        number: '5',
        type: 'kg',
        actualPrice: 7200,
        discountedPrice: 5800,
        stock: 30,
      },
    ],
  },
  {
    name: 'Seed Treatment Thiram 75%',
    urlSlug: 'seed-treatment-thiram-75',
    category: 'CropProtection',
    subcategory: 'SeedTreatment',
    images: ['/product-maize-1.jpg'],
    description:
      'Seed treatment fungicide for protecting seeds from soil-borne diseases.',
    units: [
      {
        number: '100',
        type: 'gm',
        actualPrice: 300,
        discountedPrice: 250,
        stock: 200,
      },
      {
        number: '250',
        type: 'gm',
        actualPrice: 700,
        discountedPrice: 600,
        stock: 100,
      },
      {
        number: '500',
        type: 'gm',
        actualPrice: 1300,
        discountedPrice: 1100,
        stock: 50,
      },
    ],
  },
  {
    name: 'Super Shakti Pesticide',
    urlSlug: 'super-shakti-pesticide',
    category: 'CropProtection',
    subcategory: 'Insecticide',
    images: ['/product-maize-1.jpg'],
    description:
      'Effective pesticide for crop protection. Kills all major pests including aphids and whiteflies.',
    units: [
      {
        number: '500',
        type: 'ml',
        actualPrice: 1200,
        discountedPrice: 1000,
        stock: 80,
      },
      {
        number: '1',
        type: 'litre',
        actualPrice: 2300,
        discountedPrice: 1900,
        stock: 40,
      },
    ],
  },
  {
    name: 'Roundup Herbicide',
    urlSlug: 'roundup-herbicide',
    category: 'CropProtection',
    subcategory: 'Herbicide',
    images: ['/product-maize-1.jpg'],
    description:
      'Non-selective herbicide for total weed control. Fast acting and effective.',
    units: [
      {
        number: '500',
        type: 'ml',
        actualPrice: 1100,
        discountedPrice: 950,
        stock: 90,
      },
      {
        number: '1',
        type: 'litre',
        actualPrice: 2100,
        discountedPrice: 1800,
        stock: 45,
      },
    ],
  },

  // Tools Category
  {
    name: 'Garden Spade Steel',
    urlSlug: 'garden-spade-steel',
    category: 'Tools',
    subcategory: 'HandTools',
    images: ['/product-maize-1.jpg'],
    description:
      'Heavy duty steel garden spade for digging and soil preparation. Ergonomic handle design.',
    units: [
      {
        number: '1',
        type: 'piece',
        actualPrice: 800,
        discountedPrice: 650,
        stock: 50,
      },
      {
        number: '2',
        type: 'piece',
        actualPrice: 1500,
        discountedPrice: 1200,
        stock: 25,
      },
    ],
  },
  {
    name: 'Watering Can 10 Litre',
    urlSlug: 'watering-can-10-litre',
    category: 'Tools',
    subcategory: 'Irrigation',
    images: ['/product-maize-1.jpg'],
    description:
      'Plastic watering can with fine rose for gentle watering. Perfect for seedlings and small plants.',
    units: [
      {
        number: '1',
        type: 'piece',
        actualPrice: 600,
        discountedPrice: 500,
        stock: 80,
      },
      {
        number: '2',
        type: 'piece',
        actualPrice: 1100,
        discountedPrice: 900,
        stock: 40,
      },
    ],
  },
  {
    name: 'Pruning Shears Professional',
    urlSlug: 'pruning-shears-professional',
    category: 'Tools',
    subcategory: 'HandTools',
    images: ['/product-maize-1.jpg'],
    description:
      'Professional grade pruning shears for cutting branches and stems. Sharp stainless steel blades.',
    units: [
      {
        number: '1',
        type: 'piece',
        actualPrice: 1200,
        discountedPrice: 1000,
        stock: 60,
      },
      {
        number: '2',
        type: 'piece',
        actualPrice: 2200,
        discountedPrice: 1800,
        stock: 30,
      },
    ],
  },
]

const reviewTexts = [
  'Excellent product! Very satisfied with the quality and results.',
  'Good value for money. Would definitely recommend to others.',
  'Fast delivery and good packaging. Product as described.',
  'Amazing results! My crops are growing much better now.',
  'High quality seeds with good germination rate.',
  'Effective pesticide. Solved my pest problem completely.',
  'Great fertilizer. Plants are healthier and more productive.',
  'Good product but delivery was a bit slow.',
  'Excellent customer service and product quality.',
  'Very happy with this purchase. Will buy again.',
  'Product works as expected. Good quality.',
  'Fast acting and effective. Highly recommended.',
  'Good packaging and timely delivery.',
  'Excellent results in my field. Very satisfied.',
  'High quality product with reasonable price.',
  'Works well for my farming needs.',
  'Good germination rate and healthy plants.',
  'Effective against pests and diseases.',
  'Great value for money. Good quality.',
  'Excellent product for agricultural use.',
  'Very effective and easy to use.',
  'Good results in my garden.',
  'High quality and reliable product.',
  'Excellent customer support.',
  'Great product for farmers.',
]

const orderStatuses = [
  'PENDING',
  'APPROVED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomElements(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getRandomRating() {
  return Math.floor(Math.random() * 5) + 1
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function clearDatabase() {
  console.log('🧹 Clearing existing data...')

  // Delete in order to respect foreign key constraints
  await prisma.newsletterSubscriber.deleteMany()
  await prisma.sellerApplication.deleteMany()
  await prisma.contactSubmission.deleteMany()
  await prisma.passwordResetToken.deleteMany()
  await prisma.recentProduct.deleteMany()
  await prisma.adminSettings.deleteMany()
  await prisma.paymentTransaction.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.userAddress.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.productUnit.deleteMany()
  await prisma.product.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Database cleared')
}

async function seedUsers() {
  console.log('👥 Seeding users...')

  const users = []

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@ekta.com',
      password: hashedPassword,
      emailVerified: new Date(),
      role: 'ADMIN',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  })
  users.push(adminUser)

  // Create regular users
  for (let i = 0; i < 20; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        name: sampleNames[i],
        email: sampleEmails[i],
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'CUSTOMER',
        image: `https://images.unsplash.com/photo-${
          1500000000000 + i
        }?w=150&h=150&fit=crop&crop=face`,
      },
    })
    users.push(user)
  }

  console.log(`✅ Created ${users.length} users`)
  return users
}

async function seedProducts(users) {
  console.log('🌱 Seeding products...')

  const products = []

  for (const productDataItem of productData) {
    // Create product
    const product = await prisma.product.create({
      data: {
        name: productDataItem.name,
        urlSlug: productDataItem.urlSlug,
        category: productDataItem.category,
        subcategory: productDataItem.subcategory,
        images: productDataItem.images,
        description: productDataItem.description,
        rating: 0, // Will be calculated from reviews
        reviewCount: 0, // Will be updated
        status: 'ACTIVE',
      },
    })

    // Create product units
    for (const unit of productDataItem.units) {
      await prisma.productUnit.create({
        data: {
          productId: product.id,
          number: unit.number,
          type: unit.type,
          actualPrice: unit.actualPrice,
          discountedPrice: unit.discountedPrice,
          stock: unit.stock,
          status: 'ACTIVE',
        },
      })
    }

    products.push(product)
  }

  console.log(`✅ Created ${products.length} products`)
  return products
}

async function seedReviewsAndRatings(users, products) {
  console.log('⭐ Seeding reviews and ratings...')

  let totalReviews = 0

  for (const product of products) {
    // Generate 5-15 reviews per product
    const reviewCount = getRandomInt(5, 15)
    const productUsers = getRandomElements(users, reviewCount)

    let totalRating = 0

    for (const user of productUsers) {
      const rating = getRandomRating()
      const reviewText = getRandomElement(reviewTexts)

      // Create rating
      await prisma.rating.create({
        data: {
          userId: user.id,
          productId: product.id,
          stars: rating,
        },
      })

      // Create review (80% chance)
      if (Math.random() < 0.8) {
        await prisma.review.create({
          data: {
            userId: user.id,
            productId: product.id,
            text: reviewText,
          },
        })
      }

      totalRating += rating
      totalReviews++
    }

    // Update product rating and review count
    const averageRating = totalRating / reviewCount
    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: reviewCount,
      },
    })
  }

  console.log(`✅ Created ${totalReviews} reviews and ratings`)
}

async function seedUserAddresses(users) {
  console.log('🏠 Seeding user addresses...')

  for (const user of users) {
    // Each user gets 1-2 addresses
    const addressCount = getRandomInt(1, 2)

    for (let i = 0; i < addressCount; i++) {
      const address = getRandomElement(sampleAddresses)
      await prisma.userAddress.create({
        data: {
          userId: user.id,
          name: address.name,
          phone: address.phone,
          address: address.address,
          city: getRandomElement(sampleCities),
          state: getRandomElement(sampleStates),
          pincode: getRandomElement(samplePincodes),
          landmark: address.landmark,
          isDefault: i === 0, // First address is default
        },
      })
    }
  }

  console.log('✅ Created user addresses')
}

async function seedOrders(users, products) {
  console.log('📦 Seeding orders...')

  const orders = []

  for (let i = 0; i < 15; i++) {
    const user = getRandomElement(users)
    const userAddresses = await prisma.userAddress.findMany({
      where: { userId: user.id },
    })

    if (userAddresses.length === 0) continue

    const address = getRandomElement(userAddresses)
    const orderStatus = getRandomElement(orderStatuses)

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: orderStatus,
        totalAmount: 0, // Will be calculated
        phoneNumber: address.phone,
        shippingAddress: JSON.stringify(address),
        isShopPickup: Math.random() < 0.3, // 30% chance of shop pickup
        paymentId: `pay_${Date.now()}_${i}`,
        paymentStatus: orderStatus === 'CANCELLED' ? 'FAILED' : 'CAPTURED',
      },
    })

    // Add 1-4 items to each order
    const itemCount = getRandomInt(1, 4)
    const orderProducts = getRandomElements(products, itemCount)
    let totalAmount = 0

    for (const product of orderProducts) {
      const productUnits = await prisma.productUnit.findMany({
        where: { productId: product.id },
      })

      if (productUnits.length === 0) continue

      const unit = getRandomElement(productUnits)
      const quantity = getRandomInt(1, 5)
      const unitPrice = unit.discountedPrice
      const totalPrice = unitPrice * quantity

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          unitId: unit.id,
          selectedUnit: `${unit.number} ${unit.type}`,
          quantity: quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        },
      })

      totalAmount += totalPrice
    }

    // Update order total
    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount: totalAmount },
    })

    orders.push(order)
  }

  console.log(`✅ Created ${orders.length} orders`)
  return orders
}

async function seedFavorites(users, products) {
  console.log('❤️ Seeding favorites...')

  let favoriteCount = 0

  for (const user of users) {
    // Each user favorites 3-8 products
    const favoriteCount = getRandomInt(3, 8)
    const favoriteProducts = getRandomElements(products, favoriteCount)

    for (const product of favoriteProducts) {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          productId: product.id,
        },
      })
    }
  }

  console.log('✅ Created user favorites')
}

async function seedCartItems(users, products) {
  console.log('🛒 Seeding cart items...')

  for (const user of users) {
    // 60% chance user has items in cart
    if (Math.random() < 0.6) {
      const cartItemCount = getRandomInt(1, 3)
      const cartProducts = getRandomElements(products, cartItemCount)

      for (const product of cartProducts) {
        const productUnits = await prisma.productUnit.findMany({
          where: { productId: product.id },
        })

        if (productUnits.length === 0) continue

        const unit = getRandomElement(productUnits)
        const quantity = getRandomInt(1, 3)

        await prisma.cartItem.create({
          data: {
            userId: user.id,
            productId: product.id,
            unitId: unit.id,
            selectedUnit: `${unit.number} ${unit.type}`,
            quantity: quantity,
          },
        })
      }
    }
  }

  console.log('✅ Created cart items')
}

async function seedRecentProducts(users, products) {
  console.log('🕒 Seeding recent products...')

  for (const user of users) {
    // Each user has viewed 2-6 products recently
    const recentCount = getRandomInt(2, 6)
    const recentProducts = getRandomElements(products, recentCount)

    for (const product of recentProducts) {
      await prisma.recentProduct.create({
        data: {
          userId: user.id,
          productId: product.id,
          viewedAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ), // Within last 7 days
        },
      })
    }
  }

  console.log('✅ Created recent products')
}

async function seedNewsletterSubscribers() {
  console.log('📧 Seeding newsletter subscribers...')

  const emails = [
    'subscriber1@email.com',
    'subscriber2@email.com',
    'subscriber3@email.com',
    'subscriber4@email.com',
    'subscriber5@email.com',
  ]

  for (const email of emails) {
    await prisma.newsletterSubscriber.create({
      data: {
        email: email,
        isActive: true,
      },
    })
  }

  console.log('✅ Created newsletter subscribers')
}

async function main() {
  console.log('🚀 Starting database seeding...')

  try {
    // Clear existing data
    await clearDatabase()

    // Seed data in order
    const users = await seedUsers()
    const products = await seedProducts(users)
    await seedReviewsAndRatings(users, products)
    await seedUserAddresses(users)
    await seedOrders(users, products)
    await seedFavorites(users, products)
    await seedCartItems(users, products)
    await seedRecentProducts(users, products)
    await seedNewsletterSubscribers()

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Users: ${users.length}`)
    console.log(`- Products: ${products.length}`)
    console.log(
      '- Reviews, ratings, addresses, orders, favorites, cart items, and recent products'
    )
    console.log('\n🔑 Admin Login:')
    console.log('Email: admin@ekta.com')
    console.log('Password: admin123')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
