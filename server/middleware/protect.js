import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDemoUser } from '../config/demoUsers.js';

// ─── Protect Route Middleware ──────────────────────────────────────────────────
// Validates Bearer token or HTTP Cookie and attaches req.user
export const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization Bearer Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Check HTTP-only Cookie
  else if (req.cookies?.kheti_token || req.cookies?.accessToken) {
    token = req.cookies.kheti_token || req.cookies.accessToken;
  }

  // Token missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please login to access this route.'
    });
  }

  try {
    // Check for demo token
    if (token.startsWith('demo-access-')) {
      const isFarmer = token.includes('farmer');
      const isAdmin = token.includes('admin');
      const demoId = isAdmin ? 'admin-1' : isFarmer ? 'f-1' : 'b-100';
      const demoProfile = getDemoUser(demoId);

      req.user = demoProfile ? { ...demoProfile } : {
        _id: demoId,
        id: demoId,
        name: isAdmin ? 'Kheti Admin Officer' : isFarmer ? 'Sardar Ramesh Singh' : 'Ankit Gupta',
        email: isAdmin ? 'admin@kheti.com' : isFarmer ? 'farmer@kheti.com' : 'buyer@kheti.com',
        role: isAdmin ? 'admin' : isFarmer ? 'farmer' : 'buyer',
        location: isFarmer ? 'Ludhiana, Punjab' : isAdmin ? 'New Delhi, India' : 'Azadpur Mandi, Delhi',
        phone: isFarmer ? '+91 98765 43210' : isAdmin ? '+91 99999 88888' : '+91 98111 22334',
        avatar: isFarmer
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
          : isAdmin
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        rating: isFarmer ? 4.9 : isAdmin ? 5.0 : 4.95,
        verified: true,
        joinedDate: isFarmer ? 'Jan 2024' : isAdmin ? 'Jan 2024' : 'Mar 2024'
      };
      return next();
    }

    // Verify standard JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kheti_secret_key_2026');

    try {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    } catch {
      // If DB is offline or findById failed, populate from demo or token payload
      const fallbackDemo = getDemoUser(decoded.id);
      if (fallbackDemo) {
        req.user = { ...fallbackDemo };
        return next();
      }

      req.user = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role || 'buyer',
        name: decoded.name || 'Agri User',
        email: decoded.email || 'user@kheti.com',
        location: 'India',
        phone: '',
        rating: 5.0,
        verified: true,
        joinedDate: 'Recently'
      };
      return next();
    }

    // In case user wasn't found in DB, check demo store
    const fallbackDemo = getDemoUser(decoded.id);
    if (fallbackDemo) {
      req.user = { ...fallbackDemo };
      return next();
    }

    return res.status(401).json({ success: false, message: 'User account not found' });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.'
    });
  }
};
