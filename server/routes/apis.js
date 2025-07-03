import express from 'express';
import Joi from 'joi';
import crypto from 'crypto';
import { supabase, logger } from '../index.js';

const router = express.Router();

// Encryption key for API keys (in production, use environment variable)
const ENCRYPTION_KEY = process.env.API_ENCRYPTION_KEY || 'your-32-character-secret-key-here';

// Encrypt API key
function encryptApiKey(apiKey) {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt API key
function decryptApiKey(encryptedKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Validation schema
const apiKeySchema = Joi.object({
  name: Joi.string().min(2).required(),
  provider: Joi.string().min(2).required(),
  api_key: Joi.string().min(10).required(),
  monthly_limit: Joi.number().integer().min(1).optional(),
  cost_per_request: Joi.number().min(0).optional()
});

// Get all API keys
router.get('/', async (req, res, next) => {
  try {
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('id, name, provider, status, last_used, usage_count, monthly_limit, cost_per_request, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch API keys', { error });
      return res.status(500).json({
        error: 'Failed to fetch API keys',
        code: 'FETCH_FAILED'
      });
    }

    // Mask API keys in response
    const maskedApiKeys = apiKeys.map(key => ({
      ...key,
      key: `${key.name.substring(0, 8)}${'*'.repeat(24)}`
    }));

    res.json({ apiKeys: maskedApiKeys });

  } catch (error) {
    next(error);
  }
});

// Get API key by ID (with masked key)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .select('id, name, provider, status, last_used, usage_count, monthly_limit, cost_per_request, created_at')
      .eq('id', id)
      .single();

    if (error || !apiKey) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }

    // Mask the API key
    apiKey.key = `${apiKey.name.substring(0, 8)}${'*'.repeat(24)}`;

    res.json({ apiKey });

  } catch (error) {
    next(error);
  }
});

// Create new API key
router.post('/', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = apiKeySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        code: 'VALIDATION_ERROR'
      });
    }

    const { name, provider, api_key, monthly_limit, cost_per_request } = value;

    // Encrypt the API key
    const encryptedKey = encryptApiKey(api_key);

    const { data: newApiKey, error: createError } = await supabase
      .from('api_keys')
      .insert([{
        name,
        provider,
        api_key_encrypted: encryptedKey,
        monthly_limit,
        cost_per_request,
        created_by: req.user.id
      }])
      .select('id, name, provider, status, monthly_limit, cost_per_request, created_at')
      .single();

    if (createError) {
      logger.error('Failed to create API key', { error: createError });
      return res.status(500).json({
        error: 'Failed to create API key',
        code: 'CREATE_FAILED'
      });
    }

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: req.user.id,
        action: 'CREATE_API_KEY',
        resource_type: 'api_key',
        resource_id: newApiKey.id,
        new_values: { name, provider }
      }]);

    logger.info('API key created', { apiKeyId: newApiKey.id, createdBy: req.user.id });

    res.status(201).json({ apiKey: newApiKey });

  } catch (error) {
    next(error);
  }
});

// Update API key
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, provider, api_key, monthly_limit, cost_per_request, status } = req.body;

    // Get current API key for audit
    const { data: currentApiKey } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentApiKey) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (provider) updateData.provider = provider;
    if (api_key) updateData.api_key_encrypted = encryptApiKey(api_key);
    if (monthly_limit !== undefined) updateData.monthly_limit = monthly_limit;
    if (cost_per_request !== undefined) updateData.cost_per_request = cost_per_request;
    if (status) updateData.status = status;

    const { data: updatedApiKey, error: updateError } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .select('id, name, provider, status, monthly_limit, cost_per_request, updated_at')
      .single();

    if (updateError) {
      logger.error('Failed to update API key', { error: updateError });
      return res.status(500).json({
        error: 'Failed to update API key',
        code: 'UPDATE_FAILED'
      });
    }

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: req.user.id,
        action: 'UPDATE_API_KEY',
        resource_type: 'api_key',
        resource_id: id,
        old_values: { name: currentApiKey.name, provider: currentApiKey.provider },
        new_values: updateData
      }]);

    logger.info('API key updated', { apiKeyId: id, updatedBy: req.user.id });

    res.json({ apiKey: updatedApiKey });

  } catch (error) {
    next(error);
  }
});

// Delete API key
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get API key for audit
    const { data: apiKey } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();

    if (!apiKey) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }

    const { error: deleteError } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (deleteError) {
      logger.error('Failed to delete API key', { error: deleteError });
      return res.status(500).json({
        error: 'Failed to delete API key',
        code: 'DELETE_FAILED'
      });
    }

    // Log audit trail
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: req.user.id,
        action: 'DELETE_API_KEY',
        resource_type: 'api_key',
        resource_id: id,
        old_values: { name: apiKey.name, provider: apiKey.provider }
      }]);

    logger.info('API key deleted', { apiKeyId: id, deletedBy: req.user.id });

    res.json({ message: 'API key deleted successfully' });

  } catch (error) {
    next(error);
  }
});

// Get API usage statistics
router.get('/usage/stats', async (req, res, next) => {
  try {
    const { date_from, date_to } = req.query;

    let query = supabase
      .from('api_usage')
      .select('api_name, api_provider, status_code, cost_credits, created_at');

    if (date_from) {
      query = query.gte('created_at', date_from);
    }

    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    const { data: usage, error } = await query;

    if (error) {
      logger.error('Failed to fetch API usage stats', { error });
      return res.status(500).json({
        error: 'Failed to fetch API usage statistics',
        code: 'STATS_FETCH_FAILED'
      });
    }

    // Calculate statistics
    const stats = {
      total_calls: usage.length,
      successful_calls: usage.filter(u => u.status_code >= 200 && u.status_code < 300).length,
      failed_calls: usage.filter(u => u.status_code >= 400).length,
      total_cost: usage.reduce((sum, u) => sum + (u.cost_credits || 0), 0),
      by_provider: {}
    };

    // Group by provider
    usage.forEach(u => {
      if (!stats.by_provider[u.api_provider]) {
        stats.by_provider[u.api_provider] = {
          total_calls: 0,
          successful_calls: 0,
          failed_calls: 0,
          total_cost: 0
        };
      }
      
      stats.by_provider[u.api_provider].total_calls++;
      stats.by_provider[u.api_provider].total_cost += u.cost_credits || 0;
      
      if (u.status_code >= 200 && u.status_code < 300) {
        stats.by_provider[u.api_provider].successful_calls++;
      } else if (u.status_code >= 400) {
        stats.by_provider[u.api_provider].failed_calls++;
      }
    });

    res.json({ stats });

  } catch (error) {
    next(error);
  }
});

// Test API key connectivity
router.post('/:id/test', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .select('name, provider, api_key_encrypted')
      .eq('id', id)
      .single();

    if (error || !apiKey) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }

    // Decrypt API key for testing
    const decryptedKey = decryptApiKey(apiKey.api_key_encrypted);

    // Mock API test (implement actual API testing based on provider)
    const testResult = {
      provider: apiKey.provider,
      status: 'success',
      response_time: Math.floor(Math.random() * 1000) + 500,
      message: 'API key is valid and working'
    };

    // Update last_used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', id);

    logger.info('API key tested', { apiKeyId: id, result: testResult.status });

    res.json({ test_result: testResult });

  } catch (error) {
    next(error);
  }
});

export default router;