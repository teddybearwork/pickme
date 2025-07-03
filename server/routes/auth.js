import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { supabase, logger } from '../index.js';

const router = express.Router();

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid('admin', 'moderator').default('admin')
});

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        code: 'VALIDATION_ERROR'
      });
    }

    const { email, password } = value;

    // Find user
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, name, role, is_active')
      .eq('email', email)
      .single();

    if (userError || !user) {
      logger.warn('Login attempt with invalid email', { email });
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (!user.is_active) {
      logger.warn('Login attempt with inactive account', { email });
      return res.status(401).json({
        error: 'Account deactivated',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password', { email });
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    logger.info('Successful login', { userId: user.id, email });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
});

// Register endpoint
router.post('/register', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        code: 'VALIDATION_ERROR'
      });
    }

    const { email, password, name, role } = value;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('admin_users')
      .insert([{
        email,
        password_hash: hashedPassword,
        name,
        role
      }])
      .select('id, email, name, role')
      .single();

    if (createError) {
      logger.error('User creation failed', { error: createError, email });
      return res.status(500).json({
        error: 'Failed to create user',
        code: 'USER_CREATION_FAILED'
      });
    }

    logger.info('New user registered', { userId: newUser.id, email });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });

  } catch (error) {
    next(error);
  }
});

// Verify token endpoint
router.get('/verify', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token required',
        code: 'TOKEN_MISSING'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user || !user.is_active) {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }
    next(error);
  }
});

export default router;