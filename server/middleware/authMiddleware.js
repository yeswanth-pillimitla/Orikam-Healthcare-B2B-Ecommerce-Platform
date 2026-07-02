import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }
      
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

// Admin middleware check
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Super Admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as an admin' });
  }
};
