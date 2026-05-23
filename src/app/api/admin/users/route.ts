/**
 * Admin Users Management API
 * GET /api/admin/users - List all users with registration data
 * POST /api/admin/users/:userId/details - Get user details
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Verify admin authorization
 */
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const adminToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_TOKEN || 'admin-token';
  return adminToken === expectedToken;
}

/**
 * GET - List all users with subscription and registration data
 */
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const filter = searchParams.get('filter'); // 'paid', 'free', 'active'
    const sortBy = searchParams.get('sortBy') || 'created_at'; // 'created_at', 'spent', 'last_login'

    // Build query
    let query = supabase
      .from('users')
      .select(
        `
        id,
        email,
        created_at,
        updated_at,
        country,
        city,
        signup_ip,
        device_type,
        subscriptions!inner (
          id,
          tier,
          status,
          created_at as subscription_created_at,
          trial_end_date,
          next_billing_date
        ),
        payment_history (
          id,
          amount,
          status,
          created_at as payment_date
        ),
        auth_audit_logs (
          id,
          event_type,
          timestamp
        )
      `,
        { count: 'exact' }
      );

    // Apply filters
    if (filter === 'paid') {
      query = query.eq('subscriptions.tier', 'pro').eq('subscriptions.status', 'ACTIVE');
    } else if (filter === 'free') {
      query = query.eq('subscriptions.tier', 'free');
    } else if (filter === 'active') {
      query = query.eq('subscriptions.status', 'ACTIVE');
    }

    // Apply sorting
    if (sortBy === 'spent') {
      query = query.order('payment_history', { ascending: false });
    } else if (sortBy === 'last_login') {
      query = query.order('auth_audit_logs', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform data to include computed fields
    const users = (data || []).map((user: any) => {
      const payments = user.payment_history || [];
      const totalSpent = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
      const lastLogin = user.auth_audit_logs
        ?.filter((log: any) => log.event_type === 'login_success')
        ?.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      return {
        id: user.id,
        email: user.email,
        country: user.country,
        city: user.city,
        device_type: user.device_type,
        signup_ip: user.signup_ip,
        signup_date: user.created_at,
        subscription_tier: user.subscriptions?.[0]?.tier || 'free',
        subscription_status: user.subscriptions?.[0]?.status || 'inactive',
        has_paid: user.subscriptions?.[0]?.tier === 'pro' && user.subscriptions?.[0]?.status === 'ACTIVE',
        total_spent: totalSpent,
        payment_count: payments.length,
        last_payment_date: payments.length > 0 ? payments[0].payment_date : null,
        trial_end_date: user.subscriptions?.[0]?.trial_end_date,
        next_billing_date: user.subscriptions?.[0]?.next_billing_date,
        last_login: lastLogin?.timestamp,
        login_count: user.auth_audit_logs?.filter((log: any) => log.event_type === 'login_success').length || 0,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          users,
          total: count || 0,
          page: Math.floor(offset / limit) + 1,
          pageSize: limit,
          filters: {
            applied: filter || 'none',
            sortBy,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Get detailed user information
 */
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Fetch user with all related data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(
        `
        *,
        subscriptions (*),
        payment_history (*),
        usage_limits (*),
        user_preferences (*),
        auth_audit_logs (*)
      `
      )
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate derived metrics
    const payments = userData.payment_history || [];
    const totalSpent = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const successfulLogins = (userData.auth_audit_logs || []).filter((log: any) => log.event_type === 'login_success');
    const failedLogins = (userData.auth_audit_logs || []).filter((log: any) => log.event_type === 'login_failure');

    const enrichedData = {
      ...userData,
      metrics: {
        total_spent: totalSpent,
        payment_count: payments.length,
        successful_logins: successfulLogins.length,
        failed_logins: failedLogins.length,
        failure_rate: successfulLogins.length > 0
          ? ((failedLogins.length / (successfulLogins.length + failedLogins.length)) * 100).toFixed(2) + '%'
          : '0%',
        days_active: Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        last_active: successfulLogins.length > 0
          ? successfulLogins.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp
          : null,
      },
      account_status: {
        is_active: userData.subscriptions?.[0]?.status === 'ACTIVE',
        is_locked: (userData.auth_audit_logs || []).some((log: any) => log.event_type === 'account_locked'),
        has_trial: userData.subscriptions?.[0]?.trial_end_date && new Date(userData.subscriptions?.[0]?.trial_end_date) > new Date(),
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: enrichedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user details',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update user subscription or status
 */
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { userId, action, ...updateData } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'userId and action are required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'updateSubscription': {
        const { tier, status, trialEndDate } = updateData;

        const { data, error } = await supabase
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              tier,
              status,
              trial_end_date: trialEndDate,
              updated_at: new Date(),
            },
            { onConflict: 'user_id' }
          )
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json(
          { success: true, data },
          { status: 200 }
        );
      }

      case 'updateStatus': {
        const { status } = updateData;

        const { data, error } = await supabase
          .from('users')
          .update({ updated_at: new Date(), ...updateData })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json(
          { success: true, data },
          { status: 200 }
        );
      }

      case 'deactivate': {
        // Deactivate subscriptions
        await supabase
          .from('subscriptions')
          .update({ status: 'CANCELLED' })
          .eq('user_id', userId);

        // Deactivate user
        const { data, error } = await supabase
          .from('users')
          .update({ is_active: false, updated_at: new Date() })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json(
          { success: true, data },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
      },
      { status: 500 }
    );
  }
}
