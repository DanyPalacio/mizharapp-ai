/**
 * Admin News & Articles Management
 * POST /api/admin/news - Create/publish articles
 * GET /api/admin/news - List articles
 * PUT /api/admin/news/[id] - Update article
 * DELETE /api/admin/news/[id] - Delete article
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

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const limit = request.nextUrl.searchParams.get('limit') || '50';
    const offset = request.nextUrl.searchParams.get('offset') || '0';
    const status = request.nextUrl.searchParams.get('status');

    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' })
      .order('published_date', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        articles: data || [],
        total: count || 0,
        page: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
        pageSize: parseInt(limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('News retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve articles' },
      { status: 500 }
    );
  }
}

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
    const { title, content, excerpt, category, tags, featured_image, infographics, status } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('news_articles')
      .insert({
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        content,
        excerpt: excerpt || content.substring(0, 200),
        category,
        tags: tags || [],
        featured_image,
        infographics: infographics || [],
        status: status || 'draft',
        created_by: request.headers.get('x-admin-id') || 'admin',
        created_at: new Date(),
        published_date: status === 'published' ? new Date() : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, article: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Article creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, title, content, excerpt, category, tags, featured_image, infographics, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('news_articles')
      .update({
        title,
        content,
        excerpt,
        category,
        tags,
        featured_image,
        infographics,
        status,
        updated_at: new Date(),
        published_date: status === 'published' ? new Date() : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, article: data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Article update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: 'Article deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Article deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
