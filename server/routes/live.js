import express from 'express';
import { supabase, logger } from '../index.js';

const router = express.Router();

// Get live/recent requests
router.get('/', async (req, res, next) => {
  try {
    const { limit = 20, status } = req.query;

    let query = supabase
      .from('requests')
      .select(`
        id,
        type,
        input,
        status,
        response_time_ms,
        platform,
        created_at,
        officers!inner(name, mobile)
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: requests, error } = await query;

    if (error) {
      logger.error('Failed to fetch live requests', { error });
      return res.status(500).json({
        error: 'Failed to fetch live requests',
        code: 'FETCH_FAILED'
      });
    }

    // Format response for live feed
    const liveRequests = requests.map(request => ({
      id: request.id,
      timestamp: request.created_at,
      officer: request.officers.mobile,
      officer_name: request.officers.name,
      type: request.type,
      query: request.input,
      status: request.status,
      response_time_ms: request.response_time_ms,
      platform: request.platform
    }));

    res.json({ live_requests: liveRequests });

  } catch (error) {
    next(error);
  }
});

// Get live statistics
router.get('/stats', async (req, res, next) => {
  try {
    // Get requests from last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: recentRequests, error } = await supabase
      .from('requests')
      .select('status, type, response_time_ms')
      .gte('created_at', oneHourAgo);

    if (error) {
      logger.error('Failed to fetch live stats', { error });
      return res.status(500).json({
        error: 'Failed to fetch live statistics',
        code: 'STATS_FETCH_FAILED'
      });
    }

    const stats = {
      total_requests_last_hour: recentRequests.length,
      processing_requests: recentRequests.filter(r => r.status === 'Processing').length,
      successful_requests: recentRequests.filter(r => r.status === 'Success').length,
      failed_requests: recentRequests.filter(r => r.status === 'Failed').length,
      osint_requests: recentRequests.filter(r => r.type === 'OSINT').length,
      pro_requests: recentRequests.filter(r => r.type === 'PRO').length,
      average_response_time: recentRequests.filter(r => r.response_time_ms).length > 0
        ? Math.round(recentRequests.filter(r => r.response_time_ms).reduce((sum, r) => sum + r.response_time_ms, 0) / recentRequests.filter(r => r.response_time_ms).length)
        : 0
    };

    res.json({ stats });

  } catch (error) {
    next(error);
  }
});

// Get active officers (those who made requests recently)
router.get('/active-officers', async (req, res, next) => {
  try {
    const { hours = 24 } = req.query;
    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const { data: activeOfficers, error } = await supabase
      .from('requests')
      .select(`
        officer_id,
        officers!inner(name, mobile, telegram_id, status)
      `)
      .gte('created_at', timeAgo)
      .group('officer_id');

    if (error) {
      logger.error('Failed to fetch active officers', { error });
      return res.status(500).json({
        error: 'Failed to fetch active officers',
        code: 'FETCH_FAILED'
      });
    }

    // Remove duplicates and format
    const uniqueOfficers = activeOfficers.reduce((acc, request) => {
      const officer = request.officers;
      if (!acc.find(o => o.id === request.officer_id)) {
        acc.push({
          id: request.officer_id,
          name: officer.name,
          mobile: officer.mobile,
          telegram_id: officer.telegram_id,
          status: officer.status
        });
      }
      return acc;
    }, []);

    res.json({ active_officers: uniqueOfficers });

  } catch (error) {
    next(error);
  }
});

// Get system performance metrics
router.get('/performance', async (req, res, next) => {
  try {
    const { hours = 1 } = req.query;
    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    // Get performance data
    const { data: requests, error } = await supabase
      .from('requests')
      .select('response_time_ms, status, created_at')
      .gte('created_at', timeAgo)
      .not('response_time_ms', 'is', null);

    if (error) {
      logger.error('Failed to fetch performance metrics', { error });
      return res.status(500).json({
        error: 'Failed to fetch performance metrics',
        code: 'METRICS_FETCH_FAILED'
      });
    }

    const responseTimes = requests.map(r => r.response_time_ms);
    
    const metrics = {
      total_requests: requests.length,
      average_response_time: responseTimes.length > 0 
        ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
        : 0,
      min_response_time: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
      max_response_time: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
      success_rate: requests.length > 0 
        ? Math.round((requests.filter(r => r.status === 'Success').length / requests.length) * 100)
        : 0,
      requests_per_minute: Math.round(requests.length / (hours * 60))
    };

    // Calculate percentiles
    if (responseTimes.length > 0) {
      const sorted = responseTimes.sort((a, b) => a - b);
      metrics.p50_response_time = sorted[Math.floor(sorted.length * 0.5)];
      metrics.p95_response_time = sorted[Math.floor(sorted.length * 0.95)];
      metrics.p99_response_time = sorted[Math.floor(sorted.length * 0.99)];
    }

    res.json({ performance: metrics });

  } catch (error) {
    next(error);
  }
});

// WebSocket endpoint for real-time updates (placeholder)
router.get('/websocket', (req, res) => {
  res.json({
    message: 'WebSocket endpoint for real-time updates',
    note: 'Implement WebSocket server for live request streaming'
  });
});

export default router;