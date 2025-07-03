import express from 'express';
import Joi from 'joi';
import { supabase, logger } from '../index.js';

const router = express.Router();

// Validation schema for credit transactions
const creditTransactionSchema = Joi.object({
  officer_id: Joi.string().uuid().required(),
  action: Joi.string().valid('Renewal', 'Top-up', 'Refund', 'Adjustment').required(),
  credits: Joi.number().integer().min(1).required(),
  payment_mode: Joi.string().optional(),
  payment_reference: Joi.string().optional(),
  remarks: Joi.string().optional()
});

// Get all credit transactions
router.get('/transactions', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      action,
      officer_id,
      date_from,
      date_to,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    let query = supabase
      .from('credit_transactions')
      .select(`
        *,
        officers!inner(name, mobile)
      `, { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`remarks.ilike.%${search}%,payment_reference.ilike.%${search}%`);
    }

    if (action) {
      query = query.eq('action', action);
    }

    if (officer_id) {
      query = query.eq('officer_id', officer_id);
    }

    if (date_from) {
      query = query.gte('created_at', date_from);
    }

    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: transactions, error, count } = await query;

    if (error) {
      logger.error('Failed to fetch credit transactions', { error });
      return res.status(500).json({
        error: 'Failed to fetch credit transactions',
        code: 'FETCH_FAILED'
      });
    }

    // Format response
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      officer_id: transaction.officer_id,
      officer_name: transaction.officers.name,
      officer_mobile: transaction.officers.mobile,
      action: transaction.action,
      credits: transaction.credits,
      previous_balance: transaction.previous_balance,
      new_balance: transaction.new_balance,
      payment_mode: transaction.payment_mode,
      payment_reference: transaction.payment_reference,
      remarks: transaction.remarks,
      timestamp: transaction.created_at
    }));

    res.json({
      transactions: formattedTransactions,
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

// Add credits to officer
router.post('/add', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = creditTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        code: 'VALIDATION_ERROR'
      });
    }

    const { officer_id, action, credits, payment_mode, payment_reference, remarks } = value;

    // Get current officer balance
    const { data: officer, error: officerError } = await supabase
      .from('officers')
      .select('credits_remaining, total_credits')
      .eq('id', officer_id)
      .single();

    if (officerError || !officer) {
      return res.status(404).json({
        error: 'Officer not found',
        code: 'OFFICER_NOT_FOUND'
      });
    }

    const previousBalance = officer.credits_remaining;
    const newBalance = previousBalance + credits;
    const newTotalCredits = officer.total_credits + credits;

    // Start transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('credit_transactions')
      .insert([{
        officer_id,
        action,
        credits,
        previous_balance: previousBalance,
        new_balance: newBalance,
        payment_mode,
        payment_reference,
        remarks,
        processed_by: req.user.id
      }])
      .select()
      .single();

    if (transactionError) {
      logger.error('Failed to create credit transaction', { error: transactionError });
      return res.status(500).json({
        error: 'Failed to process credit transaction',
        code: 'TRANSACTION_FAILED'
      });
    }

    // Update officer credits
    const { error: updateError } = await supabase
      .from('officers')
      .update({
        credits_remaining: newBalance,
        total_credits: newTotalCredits
      })
      .eq('id', officer_id);

    if (updateError) {
      logger.error('Failed to update officer credits', { error: updateError });
      // TODO: Implement rollback mechanism
      return res.status(500).json({
        error: 'Failed to update officer credits',
        code: 'UPDATE_FAILED'
      });
    }

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: req.user.id,
        action: 'ADD_CREDITS',
        resource_type: 'officer',
        resource_id: officer_id,
        new_values: {
          credits_added: credits,
          new_balance: newBalance,
          transaction_id: transaction.id
        }
      }]);

    logger.info('Credits added to officer', {
      officerId: officer_id,
      credits,
      newBalance,
      processedBy: req.user.id
    });

    res.status(201).json({
      transaction,
      officer: {
        id: officer_id,
        previous_balance: previousBalance,
        new_balance: newBalance,
        credits_added: credits
      }
    });

  } catch (error) {
    next(error);
  }
});

// Deduct credits from officer (for manual adjustments)
router.post('/deduct', async (req, res, next) => {
  try {
    const { officer_id, credits, remarks } = req.body;

    if (!officer_id || !credits || credits <= 0) {
      return res.status(400).json({
        error: 'Officer ID and positive credit amount required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Get current officer balance
    const { data: officer, error: officerError } = await supabase
      .from('officers')
      .select('credits_remaining')
      .eq('id', officer_id)
      .single();

    if (officerError || !officer) {
      return res.status(404).json({
        error: 'Officer not found',
        code: 'OFFICER_NOT_FOUND'
      });
    }

    if (officer.credits_remaining < credits) {
      return res.status(400).json({
        error: 'Insufficient credits',
        code: 'INSUFFICIENT_CREDITS'
      });
    }

    const previousBalance = officer.credits_remaining;
    const newBalance = previousBalance - credits;

    // Create deduction transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('credit_transactions')
      .insert([{
        officer_id,
        action: 'Deduction',
        credits: -credits, // Negative for deduction
        previous_balance: previousBalance,
        new_balance: newBalance,
        payment_mode: 'Manual Adjustment',
        remarks: remarks || 'Manual credit deduction',
        processed_by: req.user.id
      }])
      .select()
      .single();

    if (transactionError) {
      logger.error('Failed to create deduction transaction', { error: transactionError });
      return res.status(500).json({
        error: 'Failed to process credit deduction',
        code: 'TRANSACTION_FAILED'
      });
    }

    // Update officer credits
    const { error: updateError } = await supabase
      .from('officers')
      .update({ credits_remaining: newBalance })
      .eq('id', officer_id);

    if (updateError) {
      logger.error('Failed to update officer credits', { error: updateError });
      return res.status(500).json({
        error: 'Failed to update officer credits',
        code: 'UPDATE_FAILED'
      });
    }

    logger.info('Credits deducted from officer', {
      officerId: officer_id,
      credits,
      newBalance,
      processedBy: req.user.id
    });

    res.json({
      transaction,
      officer: {
        id: officer_id,
        previous_balance: previousBalance,
        new_balance: newBalance,
        credits_deducted: credits
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get credit statistics
router.get('/stats', async (req, res, next) => {
  try {
    const { date_from, date_to } = req.query;

    let query = supabase
      .from('credit_transactions')
      .select('action, credits');

    if (date_from) {
      query = query.gte('created_at', date_from);
    }

    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    const { data: transactions, error } = await query;

    if (error) {
      logger.error('Failed to fetch credit stats', { error });
      return res.status(500).json({
        error: 'Failed to fetch credit statistics',
        code: 'STATS_FETCH_FAILED'
      });
    }

    const stats = {
      total_credits_issued: transactions
        .filter(t => ['Renewal', 'Top-up', 'Refund'].includes(t.action))
        .reduce((sum, t) => sum + t.credits, 0),
      total_credits_used: Math.abs(transactions
        .filter(t => t.action === 'Deduction')
        .reduce((sum, t) => sum + t.credits, 0)),
      total_transactions: transactions.length,
      renewals: transactions.filter(t => t.action === 'Renewal').length,
      topups: transactions.filter(t => t.action === 'Top-up').length,
      refunds: transactions.filter(t => t.action === 'Refund').length,
      deductions: transactions.filter(t => t.action === 'Deduction').length
    };

    // Calculate revenue (assuming ₹2 per credit used)
    stats.estimated_revenue = stats.total_credits_used * 2;

    res.json({ stats });

  } catch (error) {
    next(error);
  }
});

// Get officer credit history
router.get('/officer/:officer_id', async (req, res, next) => {
  try {
    const { officer_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const { data: transactions, error, count } = await supabase
      .from('credit_transactions')
      .select('*', { count: 'exact' })
      .eq('officer_id', officer_id)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      logger.error('Failed to fetch officer credit history', { error });
      return res.status(500).json({
        error: 'Failed to fetch credit history',
        code: 'FETCH_FAILED'
      });
    }

    res.json({
      transactions,
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

export default router;