export const seedUsers = [
  {
    name: 'Sardar Ramesh Singh',
    email: 'farmer@kheti.com',
    password: 'password123',
    role: 'farmer',
    location: 'Ludhiana, Punjab',
    phone: '+91-98765-43210',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    verified: true,
    joinedDate: 'Jan 2024',
    acresCount: 28,
    businessType: 'Organic Cereal Producer',
    bio: 'Dedicated progressive organic farmer from Punjab specializing in Sharbati Wheat, Pusa Basmati, and Mustard with certified organic farming practices.'
  },
  {
    name: 'Kavita Patel',
    email: 'kavita@kheti.com',
    password: 'password123',
    role: 'farmer',
    location: 'Anand, Gujarat',
    phone: '+91-98123-45678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    verified: true,
    joinedDate: 'Mar 2024',
    acresCount: 16,
    businessType: 'Vegetable & Cash Crop Farmer',
    bio: 'Pioneering drip-irrigated horticulture and cash crop cultivation with zero-budget natural farming techniques.'
  },
  {
    name: 'Mahadev Patil',
    email: 'mahadev@kheti.com',
    password: 'password123',
    role: 'farmer',
    location: 'Nashik, Maharashtra',
    phone: '+91-94231-78901',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    rating: 5.0,
    verified: true,
    joinedDate: 'Feb 2024',
    acresCount: 22,
    businessType: 'Grape & Onion Specialist',
    bio: 'Export-grade red onions and table grapes grower using solar cold storage and precision fertigation.'
  },
  {
    name: 'Gurpreet Singh',
    email: 'gurpreet@kheti.com',
    password: 'password123',
    role: 'farmer',
    location: 'Amritsar, Punjab',
    phone: '+91-98711-22334',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    verified: true,
    joinedDate: 'Nov 2023',
    acresCount: 35,
    businessType: 'Large Scale Grain Farmer',
    bio: 'Multi-generational farmer utilizing combine harvesting and grain silos for top-grade Basmati and Barley.'
  },
  {
    name: 'Amit Agrawal',
    email: 'buyer@kheti.com',
    password: 'password123',
    role: 'buyer',
    location: 'Azadpur Mandi, Delhi',
    phone: '+91-98100-99887',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    verified: true,
    joinedDate: 'Jan 2024',
    businessType: 'Wholesale Agro Distributor & Exporter',
    bio: 'Bulk buyer procuring wheat, pulses, and spices directly from verified farmer clusters across North India.'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@kheti.com',
    password: 'password123',
    role: 'buyer',
    location: 'Vashi, Navi Mumbai',
    phone: '+91-98200-11223',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    rating: 5.0,
    verified: true,
    joinedDate: 'Apr 2024',
    businessType: 'Organic Retail Chain Founder',
    bio: 'Sourcing 100% certified residue-free fruits, vegetables, and pulses for premium farm-to-table consumer outlets.'
  }
];

export const seedProducts = [
  {
    title: 'Organic Sharbati Wheat Grade A',
    category: 'Grains',
    farmerName: 'Sardar Ramesh Singh',
    farmerLocation: 'Ludhiana, Punjab',
    farmerRating: 4.9,
    farmerReviewsCount: 42,
    isVerifiedFarmer: true,
    pricePerUnit: 2450,
    unit: 'Quintal',
    availableQuantity: 240,
    minOrderQuantity: 10,
    harvestDate: '2026-03-20',
    isOrganic: true,
    listingType: 'fixed',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
    description: 'Golden Sharbati wheat grains handpicked from fertile Punjab fields. High protein, sweet golden rotis, zero pesticide residue.'
  },
  {
    title: 'Premium 1121 Pusa Basmati Rice',
    category: 'Grains',
    farmerName: 'Gurpreet Singh',
    farmerLocation: 'Amritsar, Punjab',
    farmerRating: 4.9,
    farmerReviewsCount: 38,
    isVerifiedFarmer: true,
    pricePerUnit: 4800,
    unit: 'Quintal',
    availableQuantity: 180,
    minOrderQuantity: 15,
    harvestDate: '2026-03-10',
    isOrganic: true,
    listingType: 'auction',
    currentHighestBid: 5150,
    minBidIncrement: 50,
    auctionEndsAt: '2026-10-28T18:00:00.000Z',
    totalBids: 7,
    bidsHistory: [
      { bidderName: 'Amit Agrawal', amount: 5150, time: '20 mins ago' },
      { bidderName: 'North Agro Traders', amount: 5100, time: '1 hour ago' },
      { bidderName: 'Kisan Fresh Exports', amount: 5000, time: '3 hours ago' },
      { bidderName: 'Golden Grain Mills', amount: 4900, time: '5 hours ago' }
    ],
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
    description: 'Aromatic extra-long grain 1121 Basmati rice with an elongation ratio of 2.5x upon cooking. Moisture content under 12%.'
  },
  {
    title: 'Nashik Red Onion Export Grade',
    category: 'Vegetables',
    farmerName: 'Mahadev Patil',
    farmerLocation: 'Nashik, Maharashtra',
    farmerRating: 5.0,
    farmerReviewsCount: 56,
    isVerifiedFarmer: true,
    pricePerUnit: 1850,
    unit: 'Quintal',
    availableQuantity: 350,
    minOrderQuantity: 20,
    harvestDate: '2026-03-22',
    isOrganic: false,
    listingType: 'fixed',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=800&auto=format&fit=crop',
    description: 'Crisp, pungent medium-to-large size dark red onions cured under sun mesh. Long shelf life, ideal for wholesale and food chains.'
  },
  {
    title: 'Fresh Alphonso Mangoes (GI Tag Ratnagiri)',
    category: 'Fruits',
    farmerName: 'Mahadev Patil',
    farmerLocation: 'Ratnagiri, Maharashtra',
    farmerRating: 5.0,
    farmerReviewsCount: 29,
    isVerifiedFarmer: true,
    pricePerUnit: 1200,
    unit: 'Box',
    availableQuantity: 120,
    minOrderQuantity: 5,
    harvestDate: '2026-03-24',
    isOrganic: true,
    listingType: 'auction',
    currentHighestBid: 1450,
    minBidIncrement: 50,
    auctionEndsAt: '2026-10-29T15:00:00.000Z',
    totalBids: 5,
    bidsHistory: [
      { bidderName: 'Priya Sharma', amount: 1450, time: '40 mins ago' },
      { bidderName: 'Royal Fruits Delhi', amount: 1350, time: '2 hours ago' },
      { bidderName: 'Metro Food Mart', amount: 1250, time: '4 hours ago' }
    ],
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop',
    description: 'Authentic Ratnagiri Hapus mangoes naturally tree-ripened without calcium carbide. 12 pieces per box, sweet saffron pulp.'
  },
  {
    title: 'Organic Kashmiri Royal Delicious Apples',
    category: 'Fruits',
    farmerName: 'Farooq Ahmad Mir',
    farmerLocation: 'Shopian, Kashmir',
    farmerRating: 4.9,
    farmerReviewsCount: 31,
    isVerifiedFarmer: true,
    pricePerUnit: 160,
    unit: 'Kg',
    availableQuantity: 1500,
    minOrderQuantity: 50,
    harvestDate: '2026-03-18',
    isOrganic: true,
    listingType: 'fixed',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop',
    description: 'Crisp mountain apples grown in high altitude Kashmir orchards. Rich deep red color, sweet crunch, wax-free.'
  },
  {
    title: 'Vine-Ripened Hybrid Red Tomatoes',
    category: 'Vegetables',
    farmerName: 'Kavita Patel',
    farmerLocation: 'Anand, Gujarat',
    farmerRating: 4.8,
    farmerReviewsCount: 44,
    isVerifiedFarmer: true,
    pricePerUnit: 950,
    unit: 'Quintal',
    availableQuantity: 200,
    minOrderQuantity: 10,
    harvestDate: '2026-03-24',
    isOrganic: true,
    listingType: 'fixed',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    description: 'Firm, juicy hybrid tomatoes harvested at peak ripeness. Thick skin for long-haul transport and vibrant natural red color.'
  },
  {
    title: 'Desi Chana (Bengal Gram Unpolished)',
    category: 'Pulses',
    farmerName: 'Sardar Ramesh Singh',
    farmerLocation: 'Bathinda, Punjab',
    farmerRating: 4.9,
    farmerReviewsCount: 22,
    isVerifiedFarmer: true,
    pricePerUnit: 5650,
    unit: 'Quintal',
    availableQuantity: 140,
    minOrderQuantity: 10,
    harvestDate: '2026-03-12',
    isOrganic: true,
    listingType: 'fixed',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=800&auto=format&fit=crop',
    description: 'Unpolished protein-rich Desi Chana with earthy flavor and uniform grain size. Ideal for besan milling and sprout consumption.'
  },
  {
    title: 'Yellow Mustard Seeds (High Oil Content)',
    category: 'Cash Crops',
    farmerName: 'Gurpreet Singh',
    farmerLocation: 'Amritsar, Punjab',
    farmerRating: 4.9,
    farmerReviewsCount: 27,
    isVerifiedFarmer: true,
    pricePerUnit: 5400,
    unit: 'Quintal',
    availableQuantity: 110,
    minOrderQuantity: 10,
    harvestDate: '2026-03-14',
    isOrganic: true,
    listingType: 'auction',
    currentHighestBid: 5650,
    minBidIncrement: 50,
    auctionEndsAt: '2026-10-27T17:00:00.000Z',
    totalBids: 4,
    bidsHistory: [
      { bidderName: 'Kachi Ghani Oil Mills', amount: 5650, time: '1 hour ago' },
      { bidderName: 'Amit Agrawal', amount: 5550, time: '3 hours ago' }
    ],
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop',
    description: 'Bold yellow sarson seeds with lab-tested oil yield > 41%. Cleaned and sorted with gravity separators.'
  },
  {
    title: 'Long Staple Shankar-6 Raw Cotton',
    category: 'Cash Crops',
    farmerName: 'Kavita Patel',
    farmerLocation: 'Rajkot, Gujarat',
    farmerRating: 4.8,
    farmerReviewsCount: 19,
    isVerifiedFarmer: true,
    pricePerUnit: 7200,
    unit: 'Quintal',
    availableQuantity: 90,
    minOrderQuantity: 10,
    harvestDate: '2026-03-05',
    isOrganic: false,
    listingType: 'auction',
    currentHighestBid: 7450,
    minBidIncrement: 50,
    auctionEndsAt: '2026-10-28T12:00:00.000Z',
    totalBids: 6,
    bidsHistory: [
      { bidderName: 'Surat Textile Consortium', amount: 7450, time: '30 mins ago' },
      { bidderName: 'Vardhman Yarn Ltd', amount: 7350, time: '2 hours ago' }
    ],
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=800&auto=format&fit=crop',
    description: 'Shankar-6 variety ginning cotton with 28-29mm staple length and high tensile strength. Low trash content.'
  },
  {
    title: 'Lakadong High-Curcumin Turmeric Roots',
    category: 'Spices',
    farmerName: 'Wanroi Marbaniang',
    farmerLocation: 'Jaintia Hills, Meghalaya',
    farmerRating: 5.0,
    farmerReviewsCount: 33,
    isVerifiedFarmer: true,
    pricePerUnit: 12800,
    unit: 'Quintal',
    availableQuantity: 45,
    minOrderQuantity: 2,
    harvestDate: '2026-03-01',
    isOrganic: true,
    listingType: 'fixed',
    image: 'https://images.unsplash.com/photo-1615485290176-a0bf7543a6d7?q=80&w=800&auto=format&fit=crop',
    description: 'World-renowned Lakadong turmeric verified 7.5%+ curcumin content. Grown organically without chemical fertilizers in Meghalaya hills.'
  },
  {
    title: 'Agra Jyoti Table & Processing Potatoes',
    category: 'Vegetables',
    farmerName: 'Ravi Prakash',
    farmerLocation: 'Agra, Uttar Pradesh',
    farmerRating: 4.7,
    farmerReviewsCount: 25,
    isVerifiedFarmer: true,
    pricePerUnit: 1180,
    unit: 'Quintal',
    availableQuantity: 400,
    minOrderQuantity: 25,
    harvestDate: '2026-03-19',
    isOrganic: false,
    listingType: 'fixed',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop',
    description: 'High dry-matter Kufri Jyoti potatoes suited for chips manufacturing and kitchen culinary use. Cold-stored in nitrogen chambers.'
  },
  {
    title: 'Organic Soybeans (Non-GMO Yellow Seed)',
    category: 'Pulses',
    farmerName: 'Vikram Joshi',
    farmerLocation: 'Indore, Madhya Pradesh',
    farmerRating: 4.8,
    farmerReviewsCount: 28,
    isVerifiedFarmer: true,
    pricePerUnit: 4400,
    unit: 'Quintal',
    availableQuantity: 210,
    minOrderQuantity: 15,
    harvestDate: '2026-03-15',
    isOrganic: true,
    listingType: 'fixed',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    description: 'Certified Non-GMO yellow soybeans with 39% crude protein and low moisture. Perfect for tofu, soymilk, and cattle feed pellets.'
  }
];

export const seedMandiRates = [
  { crop: 'Wheat (Sharbati)', location: 'Khanna, Punjab', price: 2420, unit: 'Quintal', change: '+2.1%' },
  { crop: 'Basmati Rice (1121)', location: 'Karnal, Haryana', price: 4950, unit: 'Quintal', change: '+3.4%' },
  { crop: 'Red Onion', location: 'Lasalgaon, Maharashtra', price: 1820, unit: 'Quintal', change: '-2.5%' },
  { crop: 'Hybrid Tomato', location: 'Kolar, Karnataka', price: 920, unit: 'Quintal', change: '+5.0%' },
  { crop: 'Potato (Jyoti)', location: 'Agra, Uttar Pradesh', price: 1140, unit: 'Quintal', change: '+1.2%' },
  { crop: 'Raw Cotton', location: 'Rajkot, Gujarat', price: 7250, unit: 'Quintal', change: '-0.7%' },
  { crop: 'Mustard Seeds', location: 'Bharatpur, Rajasthan', price: 5380, unit: 'Quintal', change: '+2.8%' },
  { crop: 'Yellow Soybean', location: 'Indore, Madhya Pradesh', price: 4420, unit: 'Quintal', change: '+1.5%' },
  { crop: 'Desi Chana', location: 'Latur, Maharashtra', price: 5700, unit: 'Quintal', change: '+0.8%' },
  { crop: 'Turmeric Roots', location: 'Nizamabad, Telangana', price: 12900, unit: 'Quintal', change: '+4.1%' }
];

export const seedGuides = [
  {
    title: 'Smart Organic Pest Management for Rabi Season Crops',
    category: 'Crop Protection',
    readTime: '6 min read',
    author: 'Dr. H.S. Gill, PAU Agronomist',
    summary: 'Step-by-step guidance on Neem oil emulsion (Azadirachtin 10,000 ppm), yellow sticky traps, and Trichoderma bio-fungicide to eliminate aphids without chemicals.',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Maximizing Crop Yield with Solar Micro-Drip Irrigation',
    category: 'Irrigation & Tech',
    readTime: '8 min read',
    author: 'Kheti Tech Advisory',
    summary: 'Save up to 60% water and 40% fertilizer via automated venturi fertigation systems coupled with PM-KUSUM solar water pumps.',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'How to Read Soil Health Cards & Balance NPK Nutrients',
    category: 'Soil Fertility',
    readTime: '5 min read',
    author: 'Central Soil Research Lab',
    summary: 'Avoid expensive chemical over-fertilization by calculating exact microbial zinc, boron, and organic carbon needs from soil test reports.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Direct Farm-to-Buyer Escrow: Protecting Your Produce Payment',
    category: 'Finance & Trade',
    readTime: '4 min read',
    author: 'KhetiConnect Legal & Finance',
    summary: 'How KhetiConnect’s digital escrow ensures 100% upfront buyer funds lock and instant bank payout upon cargo acceptance with zero defaults.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop'
  }
];

export const seedSchemes = [
  {
    title: 'PM-KISAN Samman Nidhi Yojana',
    benefit: '₹6,000 annual direct cash transfer in 3 installments into Aadhaar-linked farmer bank accounts.',
    eligibility: 'All landholding farmer families across India having cultivable agricultural land.',
    linkText: 'Check Eligibility & Status'
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    benefit: 'Comprehensive crop insurance cover from pre-sowing to post-harvest against droughts, floods, pests, and cyclones with 1.5–2% farmer premium.',
    eligibility: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
    linkText: 'Apply for PMFBY'
  },
  {
    title: 'Kisan Credit Card (KCC) Low Interest Agri Credit',
    benefit: 'Collateral-free short-term crop loans up to ₹1.6 Lakhs at an effective interest rate of just 4% upon timely repayment.',
    eligibility: 'Individual/joint borrowers, tenant farmers, self-help groups, and joint liability farming groups.',
    linkText: 'Download KCC Form'
  },
  {
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    benefit: '40% to 50% government subsidy on modern tractors, rotavators, seed drills, and agricultural spray drones.',
    eligibility: 'Small, marginal, and women farmers registered on DBT Agriculture portals.',
    linkText: 'View Equipment Subsidy'
  }
];

export const seedThreads = [
  {
    authorName: 'Baldev Singh (Farmer, Punjab)',
    authorRole: 'Farmer',
    title: 'Yellow rust alert on late-sown wheat: preventive spray recommendations?',
    content: 'Noticed slight yellow powder streaks on leaf tips in my 10-acre Sharbati wheat field after recent cloudy weather. What is the most effective bio or chemical control to stop it spreading?',
    likes: 18,
    repliesCount: 3,
    postedAt: '2 hours ago',
    replies: [
      { author: 'Dr. H.S. Gill (Agronomist)', text: 'Spray Propiconazole 25% EC (Tilt) @ 1 ml per litre of water immediately. Repeat after 15 days if cloudy weather persists.', time: '1 hour ago' },
      { author: 'Gurpreet Singh', text: 'I treated with sour buttermilk (Khatta Matha) and copper decoction last week with 90% recovery. Highly recommend for organic plots.', time: '45 mins ago' }
    ]
  },
  {
    authorName: 'Sanjay Deshmukh (Nashik)',
    authorRole: 'Farmer',
    title: 'Solar cold storage subsidy release experience in Maharashtra',
    content: 'Has anyone installed a 5MT solar-powered micro cold storage on their farm? How long did the state subsidy take to credit to your account?',
    likes: 24,
    repliesCount: 2,
    postedAt: 'Yesterday',
    replies: [
      { author: 'Mahadev Patil', text: 'Got 35% subsidy credited in 65 days after district agriculture officer physical verification. Helps save onion and grape spoilage immensely.', time: '18 hours ago' }
    ]
  }
];

export const seedReviews = [
  {
    buyerName: 'Amit Agrawal (Delhi Agro Exports)',
    rating: 5,
    date: '2026-03-21',
    cropTitle: 'Organic Sharbati Wheat Grade A',
    comment: 'Exceptional quality wheat! Grain moisture was exactly 10.8%, zero foreign stones. Transferred full payment immediately through KhetiConnect escrow.',
    verifiedPurchase: true
  },
  {
    buyerName: 'Priya Sharma (Nature Fresh Organics)',
    rating: 5,
    date: '2026-03-23',
    cropTitle: 'Fresh Alphonso Mangoes Ratnagiri',
    comment: 'Truly authentic Devgad/Ratnagiri Alphonso taste and aroma. Packed perfectly in foam nets. Will be bidding on all future lots from Mahadev ji.',
    verifiedPurchase: true
  },
  {
    buyerName: 'Kailash Chand & Sons (Mandi Traders)',
    rating: 5,
    date: '2026-03-22',
    cropTitle: 'Premium 1121 Pusa Basmati Rice',
    comment: 'Won this lot through the live auction bidding. The length and aroma of this paddy exceeded expectations. Super seamless process.',
    verifiedPurchase: true
  }
];
