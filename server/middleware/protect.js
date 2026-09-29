import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
      req.user = {
        _id: isAdmin ? 'admin-1' : isFarmer ? 'f-1' : 'b-100',
        name: isAdmin ? 'Kheti Admin Officer' : isFarmer ? 'Sardar Ramesh Singh' : 'Ankit Gupta',
        email: isAdmin ? 'admin@kheti.com' : isFarmer ? 'farmer@kheti.com' : 'buyer@kheti.com',
        role: isAdmin ? 'admin' : isFarmer ? 'farmer' : 'buyer'
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
      // If DB is offline, populate from token payload
      req.user = {
        _id: decoded.id,
        role: decoded.role || 'buyer'
      };
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
