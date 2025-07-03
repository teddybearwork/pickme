import express from 'express';
import Joi from 'joi';
import { supabase, logger } from '../index.js';

const router = express.Router();

// Get all queries with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      type,
      status,
      officer_id,
      date_from,
      date_to,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    let query = supabase
      .from('requests')
      .select(`
        *,
        officers!inner(name, mobile)
      `, { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`input.ilike.%${search}%,source.ilike.%${search}%,result_summary.ilike.%${search}%`);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (status) {
      query = query.eq('status', status);
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

    const { data: requests, error, count } = await query;

    if (error) {
      logger.error('Failed to fetch queries', { error });
      return res.status(500).json({
        error: 'Failed to fetch queries',
        code: 'FETCH_FAILED'
      });
    }

    // Format response
    const formattedRequests = requests.map(request => ({
      id: request.id,
      officer_id: request.officer_id,
      officer_name: request.officers.name,
      officer_mobile: request.officers.mobile,
      type: request.type,
      input: request.input,
      source: request.source,
      result_summary: request.result_summary,
      credits_used: request.credits_used,
      status: request.status,
      response_time_ms: request.response_time_ms,
      platform: request.platform,
      timestamp: request.created_at,
      completed_at: request.completed_at
    }));

    res.json({
      queries: formattedRequests,
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

// Get query by ID with full details
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: request, error } = await supabase
      .from('requests')
      .select(`
        *,
        officers!inner(name, mobile, telegram_id),
        request_logs(raw_json, file_urls, metadata),
        api_usage(api_name, api_provider, status_code, response_time_ms, cost_credits)
      `)
      .eq('id', id)
      .single();

    if (error || !request) {
      return res.status(404).json({
        error: 'Query not found',
        code: 'QUERY_NOT_FOUND'
      });
    }

    res.json({ query: request });

  } catch (error) {
    next(error);
  }
});

// Get query statistics
router.get('/stats/summary', async (req, res, next) => {
  try {
    const { date_from, date_to } = req.query;

    let query = supabase
      .from('requests')
      .select('type, status, credits_used, response_time_ms');

    if (date_from) {
      query = query.gte('created_at', date_from);
    }

    if (date_to) {
      query = query.lte('created_at', date_to);
    }

    const { data: requests, error } = await query;

    if (error) {
      logger.error('Failed to fetch query stats', { error });
      return res.status(500).json({
        error: 'Failed to fetch query statistics',
        code: 'STATS_FETCH_FAILED'
      });
    }

    const stats = {
      total_queries: requests.length,
      osint_queries: requests.filter(r => r.type === 'OSINT').length,
      pro_queries: requests.filter(r => r.type === 'PRO').length,
      successful_queries: requests.filter(r => r.status === 'Success').length,
      failed_queries: requests.filter(r => r.status === 'Failed').length,
      pending_queries: requests.filter(r => r.status === 'Pending').length,
      total_credits_used: requests.reduce((sum, r) => sum + r.credits_used, 0),
      average_response_time: requests.filter(r => r.response_time_ms).length > 0
        ? Math.round(requests.filter(r => r.response_time_ms).reduce((sum, r) => sum + r.response_time_ms, 0) / requests.filter(r => r.response_time_ms).length)
        : 0
    };

    res.json({ stats });

  } catch (error) {
    next(error);
  }
});

// Export queries to CSV
router.get('/export/csv', async (req, res, next) => {
  try {
    const {
      type,
      status,
      officer_id,
      date_from,
      date_to
    } = req.query;

    let query = supabase
      .from('requests')
      .select(`
        *,
        officers!inner(name, mobile)
      `);

    // Apply filters
    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);
    if (officer_id) query = query.eq('officer_id', officer_id);
    if (date_from) query = query.gte('created_at', date_from);
    if (date_to) query = query.lte('created_at', date_to);

    query = query.order('created_at', { ascending: false });

    const { data: requests, error } = await query;

    if (error) {
      logger.error('Failed to export queries', { error });
      return res.status(500).json({
        error: 'Failed to export queries',
        code: 'EXPORT_FAILED'
      });
    }

    // Generate CSV
    const csvHeaders = [
      'ID', 'Officer Name', 'Officer Mobile', 'Type', 'Input', 'Source',
      'Result Summary', 'Credits Used', 'Status', 'Response Time (ms)',
      'Platform', 'Created At', 'Completed At'
    ];

    const csvRows = requests.map(request => [
      request.id,
      request.officers.name,
      request.officers.mobile,
      request.type,
      request.input,
      request.source,
      request.result_summary || '',
      request.credits_used,
      request.status,
      request.response_time_ms || '',
      request.platform || '',
      request.created_at,
      request.completed_at || ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="queries_export_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);

  } catch (error) {
    next(error);
  }
});

export default router;