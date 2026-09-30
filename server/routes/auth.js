import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middleware/protect.js';
import { getDemoUser, updateDemoUser } from '../config/demoUsers.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'kheti_secret_key_2026';
const getRefreshSecret = () => process.env.REFRESH_SECRET || 'kheti_refresh_secret_key_2026';

// Auto-seed default accounts for genuine login
export async function seedUsers() {
  try {
    const farmerExists = await User.findOne({ email: 'farmer@kheti.com' });
    if (!farmerExists) {
      await User.create({
        name: 'Sardar Gurpreet Singh',
        email: 'farmer@kheti.com',
        password: 'password123',
        role: 'farmer',
        location: 'Ludhiana, Punjab',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        verified: true,
      });
    }
    const buyerExists = await User.findOne({ email: 'buyer@kheti.com' });
    if (!buyerExists) {
      await User.create({
        name: 'Rajesh Traders Pvt Ltd',
        email: 'buyer@kheti.com',
        password: 'password123',
        role: 'buyer',
        location: 'Navi Mumbai, Maharashtra',
        phone: '+91 91234 56789',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
        verified: true,
      });
    }
  } catch (err) {
    console.log('User seed notice:', err.message);
  }
}

// Generate Access Token (Short-Lived: 15 minutes)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), { expiresIn: '15m' });
};

// Generate Refresh Token (Long-Lived: 7 days)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, getRefreshSecret(), { expiresIn: '7d' });
};

// Send Token Response helper (AccessToken in memory JSON, RefreshToken in Cookie & JSON)
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set HTTP-only Cookie for Refresh Token
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('kheti_refresh_token', refreshToken, options)
    .json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        avatar: user.avatar,
        rating: user.rating,
        verified: user.verified,
        joinedDate: user.joinedDate
      }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already registered with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      location,
      phone
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public (Requires Refresh Token)
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.kheti_refresh_token || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(refreshToken, getRefreshSecret());
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token user' });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        avatar: user.avatar,
        rating: user.rating,
        verified: user.verified,
        joinedDate: user.joinedDate
      }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

// @desc    Logout user & Clear Cookie
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', (req, res) => {
  res.cookie('kheti_refresh_token', '', {
    expires: new Date(Date.now() - 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// Helper to format clean user profile response
const formatUserProfile = (user) => {
  return {
    id: user._id || user.id,
    name: user.name || 'User',
    email: user.email || '',
    role: user.role || 'buyer',
    location: user.location || 'India',
    phone: user.phone || '',
    avatar: user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name || 'User')}`,
    rating: user.rating ?? 5.0,
    verified: user.verified ?? true,
    joinedDate: user.joinedDate || 'Recently',
    acresCount: user.acresCount ?? null,
    businessType: user.businessType || '',
    department: user.department || '',
    bio: user.bio || ''
  };
};

// Handler for fetching current logged in user's profile
const getMyProfileHandler = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // 1. Try finding in MongoDB if valid ObjectId
    if (mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const dbUser = await User.findById(userId).select('-password');
        if (dbUser) {
          return res.status(200).json({
            success: true,
            user: formatUserProfile(dbUser)
          });
        }
      } catch (dbErr) {
        console.warn('[AUTH] MongoDB fetch failed, using fallback profile:', dbErr.message);
      }
    }

    // 2. Check demo profiles store
    const demoUser = getDemoUser(userId);
    if (demoUser) {
      return res.status(200).json({
        success: true,
        user: formatUserProfile(demoUser)
      });
    }

    // 3. Fallback to req.user object attached by protect middleware
    return res.status(200).json({
      success: true,
      user: formatUserProfile(req.user)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me & GET /api/auth/profile
// @access  Private
router.get('/me', protect, getMyProfileHandler);
router.get('/profile', protect, getMyProfileHandler);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.name !== undefined) fieldsToUpdate.name = req.body.name;
    if (req.body.location !== undefined) fieldsToUpdate.location = req.body.location;
    if (req.body.phone !== undefined) fieldsToUpdate.phone = req.body.phone;
    if (req.body.avatar !== undefined) fieldsToUpdate.avatar = req.body.avatar;
    if (req.body.role !== undefined) fieldsToUpdate.role = req.body.role;
    if (req.body.bio !== undefined) fieldsToUpdate.bio = req.body.bio;
    if (req.body.acresCount !== undefined) fieldsToUpdate.acresCount = req.body.acresCount;
    if (req.body.businessType !== undefined) fieldsToUpdate.businessType = req.body.businessType;
    if (req.body.department !== undefined) fieldsToUpdate.department = req.body.department;

    const userId = req.user._id || req.user.id;
    let updatedProfile = null;

    // 1. If valid Mongo ObjectId, update in DB
    if (mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const dbUser = await User.findByIdAndUpdate(
          userId,
          { $set: fieldsToUpdate },
          { new: true, runValidators: true }
        ).select('-password');

        if (dbUser) {
          updatedProfile = formatUserProfile(dbUser);
        }
      } catch (dbErr) {
        console.warn('[AUTH] MongoDB update failed, falling back to memory store:', dbErr.message);
      }
    }

    // 2. If demo user or DB update did not run, update demo memory store
    if (!updatedProfile) {
      const updatedDemo = updateDemoUser(userId, fieldsToUpdate);
      if (updatedDemo) {
        updatedProfile = formatUserProfile(updatedDemo);
      } else {
        // Generic memory merge
        const merged = { ...req.user, ...fieldsToUpdate };
        updatedProfile = formatUserProfile(merged);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedProfile
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get user profile by ID (public or authenticated)
// @route   GET /api/auth/profile/:id
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const dbUser = await User.findById(id).select('-password');
      if (dbUser) {
        return res.status(200).json({
          success: true,
          user: formatUserProfile(dbUser)
        });
      }
    }

    const demoUser = getDemoUser(id);
    if (demoUser) {
      return res.status(200).json({
        success: true,
        user: formatUserProfile(demoUser)
      });
    }

    res.status(404).json({ success: false, message: 'User profile not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

