/**
 * Admin Newsletter Management API
 * POST - Create and send newsletters
 * GET - List sent newsletters
 * PUT - Update draft newsletter
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Email transporter configuration
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

/**
 * Verify admin authorization
 */
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const adminToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_TOKEN || 'admin-token';
  return adminToken === expectedToken;
}

/**
 * GET - List newsletters with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    let query = supabase
      .from('newsletters')
      .select('*', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        data: {
          newsletters: data || [],
          total: count || 0,
          page: Math.floor(offset / limit) + 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create and/or send newsletter
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

    const { action, ...newsletterData } = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'action is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create': {
        const { title, subject, content, htmlContent, targetAudience = 'all' } = newsletterData;

        if (!title || !subject || !content) {
          return NextResponse.json(
            { success: false, error: 'title, subject, and content are required' },
            { status: 400 }
          );
        }

        const { data, error } = await supabase
          .from('newsletters')
          .insert([
            {
              title,
              subject,
              content,
              html_content: htmlContent || null,
              status: 'draft',
              target_audience: targetAudience,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ])
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json(
          { success: true, data, message: 'Newsletter created as draft' },
          { status: 201 }
        );
      }

      case 'send': {
        const { newsletterId, testEmail } = newsletterData;

        if (!newsletterId) {
          return NextResponse.json(
            { success: false, error: 'newsletterId is required' },
            { status: 400 }
          );
        }

        // Fetch newsletter
        const { data: newsletter, error: fetchError } = await supabase
          .from('newsletters')
          .select('*')
          .eq('id', newsletterId)
          .single();

        if (fetchError || !newsletter) {
          return NextResponse.json(
            { success: false, error: 'Newsletter not found' },
            { status: 404 }
          );
        }

        // Get recipients based on target audience
        let query = supabase.from('users').select('email');

        const { data: recipients, error: recipientError } = await query;

        if (recipientError) throw recipientError;

        const emails = testEmail ? [testEmail] : (recipients || []).map((r: any) => r.email);

        // Send emails
        let successCount = 0;
        let failureCount = 0;

        for (const email of emails) {
          try {
            await transporter.sendMail({
              from: process.env.SMTP_FROM_EMAIL || 'noreply@mizhar.ai',
              to: email,
              subject: newsletter.subject,
              html: newsletter.html_content || `<div>${newsletter.content.replace(/\n/g, '<br>')}</div>`,
            });
            successCount++;
          } catch (err) {
            failureCount++;
          }
        }

        // Update newsletter status
        await supabase
          .from('newsletters')
          .update({
            status: failureCount === 0 ? 'sent' : 'failed',
            sent_time: new Date(),
            recipient_count: emails.length,
            updated_at: new Date(),
          })
          .eq('id', newsletterId);

        return NextResponse.json(
          {
            success: failureCount === 0,
            data: {
              totalRecipients: emails.length,
              successCount,
              failureCount,
            },
            message: `Newsletter ${failureCount === 0 ? 'sent successfully' : 'sent with failures'}`,
          },
          { status: failureCount === 0 ? 200 : 207 }
        );
      }

      case 'schedule': {
        const { newsletterId, scheduledTime } = newsletterData;

        if (!newsletterId || !scheduledTime) {
          return NextResponse.json(
            { success: false, error: 'newsletterId and scheduledTime are required' },
            { status: 400 }
          );
        }

        const { data, error } = await supabase
          .from('newsletters')
          .update({
            status: 'scheduled',
            scheduled_time: new Date(scheduledTime),
            updated_at: new Date(),
          })
          .eq('id', newsletterId)
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json(
          { success: true, data, message: 'Newsletter scheduled' },
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
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process newsletter' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update draft newsletter
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

    const { newsletterId, ...updateData } = await request.json();

    if (!newsletterId) {
      return NextResponse.json(
        { success: false, error: 'newsletterId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('newsletters')
      .update({
        ...updateData,
        updated_at: new Date(),
      })
      .eq('id', newsletterId)
      .eq('status', 'draft')
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data, message: 'Newsletter updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update newsletter' },
      { status: 500 }
    );
  }
}
