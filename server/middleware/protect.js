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
    // Verify standard JWT — no fallback secret; JWT_SECRET must be set
    if (!process.env.JWT_SECRET) {
      console.error('[FATAL] JWT_SECRET is not set. Cannot verify tokens.');
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.'
    });
  }
};
