/**
 * Admin Knowledge Bank Management
 * POST /api/admin/knowledge - Upload PDFs, blueprints, guides
 * GET /api/admin/knowledge - List knowledge items
 * PUT /api/admin/knowledge/[id] - Update SEO and metadata
 * DELETE /api/admin/knowledge/[id] - Remove item
 */

import { NextRequest, NextResponse } from 'next/server';
import { FileProcessor } from '@/lib/file-processing';
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
    const type = request.nextUrl.searchParams.get('type'); // pdf, blueprint, guide

    let query = supabase
      .from('knowledge_items')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        items: data || [],
        total: count || 0,
        page: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Knowledge retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve knowledge items' },
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const type = formData.get('type') as string; // pdf, blueprint, guide
    const keywords = JSON.parse(formData.get('keywords') as string || '[]');
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;

    if (!file || !title || !category || !type) {
      return NextResponse.json(
        { success: false, error: 'File, title, category, and type are required' },
        { status: 400 }
      );
    }

    // Process file
    const processed = await FileProcessor.processFile(file);

    // Save to knowledge base
    const { data, error } = await supabase
      .from('knowledge_items')
      .insert({
        title,
        description: description || processed.content.substring(0, 500),
        content: processed.content,
        filetype: processed.filetype,
        category,
        type,
        keywords: keywords || processed.extracted_data.key_features || [],
        metadata: {
          ...processed.metadata,
          extracted_data: processed.extracted_data,
        },
        seo_title: seoTitle || title,
        seo_description: seoDescription || processed.content.substring(0, 155),
        seo_keywords: keywords.join(', '),
        uploaded_by: request.headers.get('x-admin-id') || 'admin',
        created_at: new Date(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        item: data,
        message: 'Knowledge item uploaded and indexed',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Knowledge upload error:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error}` },
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
    const { id, title, description, category, keywords, seoTitle, seoDescription, seoKeywords } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_items')
      .update({
        title,
        description,
        category,
        keywords,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, item: data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Knowledge update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
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
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('knowledge_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: 'Knowledge item deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Knowledge deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
