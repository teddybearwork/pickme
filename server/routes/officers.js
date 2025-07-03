import express from 'express';
import Joi from 'joi';
import { supabase, logger } from '../index.js';

const router = express.Router();

// Validation schemas
const officerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  mobile: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  telegram_id: Joi.string().optional(),
  whatsapp_id: Joi.string().optional(),
  email: Joi.string().email().optional(),
  department: Joi.string().optional(),
  rank: Joi.string().optional(),
  badge_number: Joi.string().optional(),
  credits_remaining: Joi.number().integer().min(0).default(50),
  total_credits: Joi.number().integer().min(0).default(50),
  pro_access_enabled: Joi.boolean().default(true),
  rate_limit_per_hour: Joi.number().integer().min(1).default(100)
});

const updateOfficerSchema = officerSchema.fork(['name', 'mobile'], (schema) => schema.optional());

// Get all officers
router.get('/', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search, 
      status, 
      department,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    let query = supabase
      .from('officers')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,mobile.ilike.%${search}%,telegram_id.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (department) {
      query = query.eq('department', department);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: officers, error, count } = await query;

    if (error) {
      logger.error('Failed to fetch officers', { error });
      return res.status(500).json({
        error: 'Failed to fetch officers',
        code: 'FETCH_FAILED'
      });
    }

    res.json({
      officers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get officer by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: officer, error } = await supabase
      .from('officers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !officer) {
      return res.status(404).json({
        error: 'Officer not found',
        code: 'OFFICER_NOT_FOUND'
      });
    }

    res.json({ officer });

  } catch (error) {
    next(error);
  }
});

// Create new officer
router.post('/', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = officerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        code: 'VALIDATION_ERROR'
      });
    }

    const { data: officer, error: createError } = await supabase
      .from('officers')
      .insert([value])
      .select()
      .single();

    if (createError) {
      if (createError.code === '23505') {
        return res.status(409).json({
          error: 'Officer with this mobile number already exists',
          code: 'DUPLICATE_MOBILE'
        });
      }
      
      logger.error('Failed to create officer', { error: createError });
      return res.status(500).json({
        error: 'Failed to create officer',
        code: 'CREATE_FAILED'
      });
    }

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: req.user.id,
        action: 'CREATE_OFFICER',
        resource_type: 'officer',
        resource_id: officer.id,
        new_values: officer
      }]);

    logger.info('Officer created', { officerId: officer.id, createdBy: req.user.id });

    res.status(201).json({ officer });

  } catch (error) {
    next(error);
  }
});

// Update officer
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate input
    const { error, value } = updateOfficerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        code: 'VALIDATION_ERROR'
      });
    }

    // Get current officer data for audit
    const { data: currentOfficer } = await supabase
      .from('officers')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentOfficer) {
      return res.status(404).json({
        error: 'Officer not found',
        code: 'OFFICER_NOT_FOUND'
      });
    }

    const { data: officer, error: updateError } = await supabase
      .from('officers')
      .update(value)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      logger.error('Failed to update officer', { error: updateError, officerId: id });
      return res.status(500).json({
        error: 'Failed to update officer',
        code: 'UPDATE_FAILED'
      });
    }

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: req.user.id,
        action: 'UPDATE_OFFICER',
        resource_type: 'officer',
        resource_id: id,
        old_values: currentOfficer,
        new_values: officer
      }]);

    logger.info('Officer updated', { officerId: id, updatedBy: req.user.id });

    res.json({ officer });

  } catch (error) {
    next(error);
  }
});

// Delete officer
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get officer data for audit
    const { data: officer } = await supabase
      .from('officers')
      .select('*')
      .eq('id', id)
      .single();

    if (!officer) {
      return res.status(404).json({
        error: 'Officer not found',
        code: 'OFFICER_NOT_FOUND'
      });
    }

    const { error: deleteError } = await supabase
      .from('officers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      logger.error('Failed to delete officer', { error: deleteError, officerId: id });
      return res.status(500).json({
        error: 'Failed to delete officer',
        code: 'DELETE_FAILED'
      });
    }

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: req.user.id,
        action: 'DELETE_OFFICER',
        resource_type: 'officer',
        resource_id: id,
        old_values: officer
      }]);

    logger.info('Officer deleted', { officerId: id, deletedBy: req.user.id });

    res.json({ message: 'Officer deleted successfully' });

  } catch (error) {
    next(error);
  }
});

// Update officer status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Suspended', 'Inactive'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be Active, Suspended, or Inactive',
        code: 'INVALID_STATUS'
      });
    }

    const { data: officer, error } = await supabase
      .from('officers')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !officer) {
      return res.status(404).json({
        error: 'Officer not found',
        code: 'OFFICER_NOT_FOUND'
      });
    }

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: req.user.id,
        action: 'UPDATE_OFFICER_STATUS',
        resource_type: 'officer',
        resource_id: id,
        new_values: { status }
      }]);

    logger.info('Officer status updated', { 
      officerId: id, 
      newStatus: status, 
      updatedBy: req.user.id 
    });

    res.json({ officer });

  } catch (error) {
    next(error);
  }
});

// Get officer statistics
router.get('/:id/stats', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get officer basic info
    const { data: officer, error: officerError } = await supabase
      .from('officers')
      .select('name, total_queries, credits_remaining, total_credits')
      .eq('id', id)
      .single();

    if (officerError || !officer) {
      return res.status(404).json({
        error: 'Officer not found',
        code: 'OFFICER_NOT_FOUND'
      });
    }

    // Get query statistics
    const { data: queryStats } = await supabase
      .from('requests')
      .select('type, status, credits_used')
      .eq('officer_id', id);

    const stats = {
      officer: officer.name,
      totalQueries: officer.total_queries,
      creditsRemaining: officer.credits_remaining,
      totalCredits: officer.total_credits,
      osintQueries: queryStats?.filter(q => q.type === 'OSINT').length || 0,
      proQueries: queryStats?.filter(q => q.type === 'PRO').length || 0,
      successfulQueries: queryStats?.filter(q => q.status === 'Success').length || 0,
      failedQueries: queryStats?.filter(q => q.status === 'Failed').length || 0,
      totalCreditsUsed: queryStats?.reduce((sum, q) => sum + q.credits_used, 0) || 0
    };

    res.json({ stats });

  } catch (error) {
    next(error);
  }
});

export default router;