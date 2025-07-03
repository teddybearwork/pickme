import jwt from 'jsonwebtoken';
import { supabase } from '../index.js';
import { logger } from '../index.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Fetch user from database
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      logger.warn('Invalid token - user not found', { userId: decoded.userId });
      return res.status(401).json({
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }

    if (!user.is_active) {
      logger.warn('Inactive user attempted access', { userId: user.id });
      return res.status(401).json({
        error: 'Account deactivated',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    logger.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', { 
        userId: req.user.id, 
        userRole: req.user.role, 
        requiredRoles: roles 
      });
      
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};