
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

// Generate Tokens
function sendToken(user, res, status = 200) {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('kheti_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(status).json({
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
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location, phone } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'farmer' ? 'farmer' : 'buyer',
      location,
      phone
    });

    sendToken(user, res, 201);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Refresh Access Token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.kheti_refresh_token || req.body?.refreshToken;

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ success: true, accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('kheti_refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

// Get My Profile
router.get(['/me', '/profile'], protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Update My Profile
router.put('/profile', protect, async (req, res) => {
  try {
    const fields = [
      'name',
      'location',
      'phone',
      'avatar',
      'bio',
      'acresCount',
      'businessType',
      'department'
    ];

    const updates = {};

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
