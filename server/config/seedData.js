import Product from '../models/Product.js';
import MandiRate from '../models/MandiRate.js';
import { Guide, Scheme, Thread, Review } from '../models/Community.js';

export async function seedAllDatabaseData() {
  try {
    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        {
          title: 'Premium Organic Sharbati Wheat',
          category: 'Grains',
          farmerId: 'f-1',
          farmerName: 'Sardar Ramesh Singh',
          farmerLocation: 'Ludhiana, Punjab',
          farmerRating: 4.9,
          farmerReviewsCount: 38,
          isVerifiedFarmer: true,
          pricePerUnit: 2400,
          unit: 'Quintal',
          availableQuantity: 150,
          minOrderQuantity: 10,
          harvestDate: '2026-03-15',
          isOrganic: true,
          listingType: 'auction',
          currentHighestBid: 2450,
          minBidIncrement: 50,
          auctionEndsAt: '2026-08-25T18:00:00',
          totalBids: 14,
          bidsHistory: [
            { bidderName: 'Garg Trading Co.', amount: 2450, time: '10 mins ago' },
            { bidderName: 'AgroExports Ltd', amount: 2400, time: '2 hours ago' },
            { bidderName: 'Sunrise Mills', amount: 2350, time: '5 hours ago' }
          ],
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
          description: '100% naturally grown Sharbati wheat, sun-dried and machine cleaned. Zero chemical pesticides used.'
        },
        {
          title: 'Fresh Farm-Pick Tomatoes (A-Grade)',
          category: 'Vegetables',
          farmerId: 'f-2',
          farmerName: 'Sunita Patil',
          farmerLocation: 'Nashik, Maharashtra',
          farmerRating: 4.8,
          farmerReviewsCount: 52,
          isVerifiedFarmer: true,
          pricePerUnit: 1800,
          unit: 'Quintal',
          availableQuantity: 45,
          minOrderQuantity: 5,
          harvestDate: '2026-08-18',
          isOrganic: false,
          listingType: 'fixed',
          currentHighestBid: null,
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
          description: 'Juicy, firm red tomatoes harvested fresh this morning. Ideal for long distance transport.'
        },
        {
          title: 'Aroma Basmati Rice 1121 Extra Long',
          category: 'Grains',
          farmerId: 'f-3',
          farmerName: 'Gurpreet Singh Sidhu',
          farmerLocation: 'Karnal, Haryana',
          farmerRating: 5.0,
          farmerReviewsCount: 94,
          isVerifiedFarmer: true,
          pricePerUnit: 4400,
          unit: 'Quintal',
          availableQuantity: 200,
          minOrderQuantity: 20,
          harvestDate: '2025-11-10',
          isOrganic: true,
          listingType: 'auction',
          currentHighestBid: 4600,
          minBidIncrement: 100,
          auctionEndsAt: '2026-08-24T20:00:00',
          totalBids: 22,
          bidsHistory: [
            { bidderName: 'Global Agri Exports', amount: 4600, time: '1 hour ago' },
            { bidderName: 'Taj Food Industries', amount: 4500, time: '3 hours ago' }
          ],
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
          description: 'Aged 12 months for exceptional length expansion up to 22mm when cooked.'
        },
        {
          title: 'Organic Export-Quality Alphonso Mangoes',
          category: 'Fruits',
          farmerId: 'f-4',
          farmerName: 'Milind Deshmukh',
          farmerLocation: 'Ratnagiri, Maharashtra',
          farmerRating: 4.9,
          farmerReviewsCount: 61,
          isVerifiedFarmer: true,
          pricePerUnit: 950,
          unit: 'Box (12 Pcs)',
          availableQuantity: 80,
          minOrderQuantity: 5,
          harvestDate: '2026-05-02',
          isOrganic: true,
          listingType: 'fixed',
          image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop',
          description: 'GI Tagged authentic Ratnagiri Hapus Alphonso. Naturally tree-ripened.'
        },
        {
          title: 'Red Jyoti New Crop Potatoes',
          category: 'Vegetables',
          farmerId: 'f-5',
          farmerName: 'Ramprasad Yadav',
          farmerLocation: 'Agra, Uttar Pradesh',
          farmerRating: 4.7,
          farmerReviewsCount: 29,
          isVerifiedFarmer: true,
          pricePerUnit: 1280,
          unit: 'Quintal',
          availableQuantity: 300,
          minOrderQuantity: 50,
          harvestDate: '2026-02-28',
          isOrganic: false,
          listingType: 'auction',
          currentHighestBid: 1320,
          minBidIncrement: 20,
          auctionEndsAt: '2026-08-22T17:30:00',
          totalBids: 8,
          bidsHistory: [
            { bidderName: 'Chipotle Snacks Co', amount: 1320, time: '25 mins ago' }
          ],
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop',
          description: 'High dry matter content potatoes perfect for processing or storage.'
        }
      ]);
      console.log('✅ Products seeded into MongoDB');
    }

    // 2. Seed Mandi Rates if empty
    const mandiCount = await MandiRate.countDocuments();
    if (mandiCount === 0) {
      await MandiRate.insertMany([
        { crop: 'Wheat (Sharbati)', location: 'Khanna Mandi, PB', price: 2350, unit: 'Quintal', change: '+2.4%' },
        { crop: 'Basmati Rice 1121', location: 'Karnal Mandi, HR', price: 4200, unit: 'Quintal', change: '+1.8%' },
        { crop: 'Organic Tomato', location: 'Nashik Mandi, MH', price: 1850, unit: 'Quintal', change: '-0.5%' },
        { crop: 'Alphonso Mango', location: 'Ratnagiri, MH', price: 850, unit: 'Box (12kg)', change: '+3.1%' },
        { crop: 'Long Grain Rice', location: 'Cuttack Mandi, OD', price: 2900, unit: 'Quintal', change: '+0.9%' },
        { crop: 'Fresh Potato (Jyoti)', location: 'Agra Mandi, UP', price: 1250, unit: 'Quintal', change: '+1.2%' },
        { crop: 'Organic Cotton', location: 'Rajkot Mandi, GJ', price: 7100, unit: 'Quintal', change: '+2.7%' },
        { crop: 'Sugarcane (Co 0238)', location: 'Muzaffarnagar, UP', price: 390, unit: 'Quintal', change: '0.0%' }
      ]);
      console.log('✅ Mandi Rates seeded into MongoDB');
    }

    // 3. Seed Advisory Guides if empty
    const guideCount = await Guide.countDocuments();
    if (guideCount === 0) {
      await Guide.insertMany([
        {
          title: 'Drip Irrigation Setup: Save 60% Water & Boost Yields',
          category: 'Water Management',
          readTime: '6 min read',
          author: 'Dr. V. K. Kurien (Agri Scientist)',
          summary: 'A step-by-step guide to installing low-cost drip emitter lines in wheat and vegetable crops to increase fertilizer efficiency.',
          image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600&auto=format&fit=crop'
        },
        {
          title: 'Natural Pest Control with Neem Oil & Jeevamrut',
          category: 'Organic Farming',
          readTime: '8 min read',
          author: 'Subhash Palekar Agro Trust',
          summary: 'Learn how to prepare zero-budget organic pest repellent formulas at home using cow urine, neem leaves, and jaggery.',
          image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600&auto=format&fit=crop'
        },
        {
          title: 'e-NAM & Direct Mandi Selling Process Explained',
          category: 'Market Advisory',
          readTime: '5 min read',
          author: 'Ministry of Agriculture Guide',
          summary: 'How farmers can get maximum prices by bypassing middlemen commission agents through transparent online bidding.',
          image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=600&auto=format&fit=crop'
        }
      ]);
      console.log('✅ Community Guides seeded into MongoDB');
    }

    // 4. Seed Government Schemes if empty
    const schemeCount = await Scheme.countDocuments();
    if (schemeCount === 0) {
      await Scheme.insertMany([
        {
          title: 'PM-Kisan Samman Nidhi (PM-KISAN)',
          benefit: '₹6,000 / year direct bank transfer in 3 installments',
          eligibility: 'All small & marginal landholding farmer families',
          linkText: 'Check PM-Kisan Status'
        },
        {
          title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
          benefit: 'Comprehensive crop insurance cover against natural disasters & pests at 1.5% - 2% premium',
          eligibility: 'All farmers growing notified crops in notified areas',
          linkText: 'Apply Crop Insurance'
        },
        {
          title: 'Kisan Credit Card (KCC) Scheme',
          benefit: 'Short-term credit loans up to ₹3 Lakhs at concessional 4% interest rate',
          eligibility: 'Farmers, tenant farmers, sharecroppers, and SHGs',
          linkText: 'Apply KCC Online'
        }
      ]);
      console.log('✅ Government Schemes seeded into MongoDB');
    }

    // 5. Seed Forum Threads if empty
    const threadCount = await Thread.countDocuments();
    if (threadCount === 0) {
      await Thread.insertMany([
        {
          authorName: 'Baldev Singh (Punjab)',
          authorRole: 'Wheat & Rice Farmer',
          title: 'What is the best organic method to treat yellow rust in wheat?',
          content: 'My wheat field is showing early yellowing spots on leaves. Is sour buttermilk spray effective, or should I use bio-fungicide like Trichoderma?',
          likes: 24,
          repliesCount: 2,
          postedAt: '4 hours ago',
          replies: [
            { author: 'Dr. S. K. Sharma (Agronomist)', text: 'Spray 5% sour buttermilk mixed with copper extract twice at 10-day intervals. Ensure proper soil aeration.', time: '3 hours ago' },
            { author: 'Harpreet Farmer', text: 'Pseudomonas fluorescens @ 10g per liter works very well for me in Ludhiana district.', time: '1 hour ago' }
          ]
        },
        {
          authorName: 'Priya Retailers (Delhi)',
          authorRole: 'Buyer / Retailer',
          title: 'Looking for 500 Quintals organic Basmati rice supplier in Haryana',
          content: 'We need APEDA certified organic Basmati rice for export packaging. Sellers with lab test certificates please reply.',
          likes: 18,
          repliesCount: 1,
          postedAt: '1 day ago',
          replies: [
            { author: 'Gurpreet Singh Sidhu', text: 'I have 200 Quintals 1121 Basmati fully organic tested crop ready in Karnal. Let us connect!', time: '18 hours ago' }
          ]
        }
      ]);
      console.log('✅ Forum Threads seeded into MongoDB');
    }

    // 6. Seed Reviews if empty
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany([
        {
          buyerName: 'Garg Trading Co.',
          rating: 5,
          date: '12 Aug 2026',
          cropTitle: 'Premium Organic Sharbati Wheat',
          comment: 'Exceptional wheat quality! Moisture level was under 11%, exact weight as promised, and smooth transit from Ludhiana. Will buy again.',
          verifiedPurchase: true
        },
        {
          buyerName: 'Apex Supermarkets',
          rating: 5,
          date: '05 Aug 2026',
          cropTitle: 'Organic Export Alphonso Mangoes',
          comment: 'Zero spoilage during transport. Very authentic sweetness. Farmers provided live harvesting videos.',
          verifiedPurchase: true
        },
        {
          buyerName: 'Subhash Vegetable Mart',
          rating: 4,
          date: '28 Jul 2026',
          cropTitle: 'Fresh Farm-Pick Tomatoes',
          comment: 'Good produce grade. Highly satisfied with seller communication and quick packaging.',
          verifiedPurchase: true
        }
      ]);
      console.log('✅ Trust Reviews seeded into MongoDB');
    }
  } catch (err) {
    console.error('Database seed error:', err.message);
  }
}
