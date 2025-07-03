import express from 'express';
import { supabase, logger } from '../index.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    // Get officer counts
    const { data: officers, error: officersError } = await supabase
      .from('officers')
      .select('status');

    if (officersError) {
      logger.error('Failed to fetch officer stats', { error: officersError });
      return res.status(500).json({
        error: 'Failed to fetch dashboard stats',
        code: 'STATS_FETCH_FAILED'
      });
    }

    const totalOfficers = officers.length;
    const activeOfficers = officers.filter(o => o.status === 'Active').length;

    // Get today's query stats
    const today = new Date().toISOString().split('T')[0];
    const { data: todayQueries, error: queriesError } = await supabase
      .from('requests')
      .select('status, credits_used, response_time_ms')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (queriesError) {
      logger.error('Failed to fetch query stats', { error: queriesError });
    }

    const totalQueriesToday = todayQueries?.length || 0;
    const successfulQueries = todayQueries?.filter(q => q.status === 'Success').length || 0;
    const failedQueries = todayQueries?.filter(q => q.status === 'Failed').length || 0;
    const totalCreditsUsed = todayQueries?.reduce((sum, q) => sum + q.credits_used, 0) || 0;
    
    // Calculate average response time
    const responseTimes = todayQueries?.filter(q => q.response_time_ms).map(q => q.response_time_ms) || [];
    const averageResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length / 1000 * 10) / 10
      : 0;

    // Calculate revenue (assuming ₹2 per credit)
    const revenueToday = totalCreditsUsed * 2;

    const stats = {
      total_officers: totalOfficers,
      active_officers: activeOfficers,
      total_queries_today: totalQueriesToday,
      successful_queries: successfulQueries,
      failed_queries: failedQueries,
      total_credits_used: totalCreditsUsed,
      revenue_today: revenueToday,
      average_response_time: averageResponseTime
    };

    res.json({ stats });

  } catch (error) {
    next(error);
  }
});

// Get recent activity
router.get('/activity', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    // Get recent officers
    const { data: recentOfficers, error: officersError } = await supabase
      .from('officers')
      .select('id, name, mobile, telegram_id, status, avatar_url, last_active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (officersError) {
      logger.error('Failed to fetch recent officers', { error: officersError });
    }

    // Get recent queries
    const { data: recentQueries, error: queriesError } = await supabase
      .from('requests')
      .select(`
        id, type, input, source, result_summary, credits_used, status, created_at,
        officers!inner(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (queriesError) {
      logger.error('Failed to fetch recent queries', { error: queriesError });
    }

    // Format recent queries
    const formattedQueries = recentQueries?.map(query => ({
      id: query.id,
      officer_name: query.officers.name,
      type: query.type,
      input: query.input,
      source: query.source,
      result_summary: query.result_summary,
      credits_used: query.credits_used,
      status: query.status,
      timestamp: query.created_at
    })) || [];

    res.json({
      recent_officers: recentOfficers || [],
      recent_queries: formattedQueries
    });

  } catch (error) {
    next(error);
  }
});

// Get system health
router.get('/health', async (req, res, next) => {
  try {
    // Check database connectivity
    const { data, error } = await supabase
      .from('system_settings')
      .select('key')
      .limit(1);

    const dbStatus = error ? 'unhealthy' : 'healthy';

    // Get API status (mock for now)
    const apiStatus = 'healthy';

    // Get system metrics
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const health = {
      status: dbStatus === 'healthy' && apiStatus === 'healthy' ? 'healthy' : 'unhealthy',
      database: dbStatus,
      apis: apiStatus,
      uptime: Math.floor(uptime),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      timestamp: new Date().toISOString()
    };

    res.json({ health });

  } catch (error) {
    next(error);
  }
});

export default router;