/**
 * Admin Dashboard API
 * GET /api/admin/dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/admin-service';

export const dynamic = 'force-dynamic';

/**
 * Verify admin authorization
 */
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  // In production, verify JWT token and admin role
  // For now, check for admin header
  const adminToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_TOKEN || 'admin-token';
  return adminToken === expectedToken;
}

export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - Admin access required',
        },
        { status: 403 }
      );
    }

    const adminService = new AdminService();

    // Get comprehensive dashboard data
    const dashboardData = await adminService.getDashboardData();

    return NextResponse.json(
      {
        success: true,
        data: dashboardData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
      },
      { status: 500 }
    );
  }
}

/**
 * Get specific admin section
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

    const body = await request.json();
    const { section, action, data } = body;

    const adminService = new AdminService();

    // Route to appropriate service
    switch (section) {
      case 'users': {
        switch (action) {
          case 'getAll':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.users.getAllUsers(
                  data?.limit || 50,
                  data?.offset || 0
                ),
              },
              { status: 200 }
            );

          case 'getDetails':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.users.getUserDetails(data.userId),
              },
              { status: 200 }
            );

          case 'updateSubscription':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.users.updateUserSubscription(
                  data.userId,
                  data.tier,
                  data.status,
                  data.trialEndDate
                ),
              },
              { status: 200 }
            );

          case 'deactivate':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.users.deactivateUser(data.userId),
              },
              { status: 200 }
            );
        }
        break;
      }

      case 'knowledge': {
        switch (action) {
          case 'getSources':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.knowledge.getAllSources(
                  data?.limit || 50,
                  data?.offset || 0
                ),
              },
              { status: 200 }
            );

          case 'createSource':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.knowledge.createSource(data),
              },
              { status: 200 }
            );

          case 'updateQuality':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.knowledge.updateSourceQuality(
                  data.sourceId,
                  data.qualityScore
                ),
              },
              { status: 200 }
            );

          case 'deleteSource':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.knowledge.deleteSource(data.sourceId),
              },
              { status: 200 }
            );

          case 'getStats':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.knowledge.getKnowledgeStats(),
              },
              { status: 200 }
            );

          case 'getPopular':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.knowledge.getPopularChunks(
                  data?.limit || 10
                ),
              },
              { status: 200 }
            );
        }
        break;
      }

      case 'analytics': {
        switch (action) {
          case 'toolUsage':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.analytics.getToolUsageAnalytics(),
              },
              { status: 200 }
            );

          case 'revenue':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.analytics.getRevenueAnalytics(),
              },
              { status: 200 }
            );

          case 'dau':
            return NextResponse.json(
              {
                success: true,
                data: await adminService.analytics.getDailyActiveUsers(
                  data?.days || 7
                ),
              },
              { status: 200 }
            );
        }
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown section' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Admin error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
