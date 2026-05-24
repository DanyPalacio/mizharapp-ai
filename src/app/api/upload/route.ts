/**
 * File Upload API
 * POST /api/upload - Upload .doc, .pdf, .md, .ppt, .xls files
 * Process documents for business plan generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { FileProcessor, generateBusinessPlanFromDocument } from '@/lib/file-processing';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

const ALLOWED_TYPES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'text/markdown',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

const ALLOWED_EXTENSIONS = ['.doc', '.docx', '.pdf', '.md', '.xls', '.xlsx', '.ppt', '.pptx'];

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const purpose = formData.get('purpose') || 'business_plan'; // or 'knowledge_bank'
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type) && 
        !ALLOWED_EXTENSIONS.some(ext => file.name.endsWith(ext))) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Allowed: .doc, .docx, .pdf, .md, .xls, .xlsx, .ppt, .pptx' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Process file
    const processed = await FileProcessor.processFile(file);

    if (purpose === 'business_plan') {
      // Generate business plan from document
      const businessPlan = generateBusinessPlanFromDocument(processed.extracted_data);

      // Save to database
      await supabase.from('user_uploads').insert({
        user_id: userId,
        filename: processed.filename,
        filetype: processed.filetype,
        content: processed.content,
        extracted_data: processed.extracted_data,
        business_plan: businessPlan,
        purpose: 'business_plan',
        created_at: new Date(),
      });

      return NextResponse.json(
        {
          success: true,
          message: 'File processed successfully',
          businessPlan: businessPlan,
          extractedData: processed.extracted_data,
          metadata: processed.metadata,
        },
        { status: 200 }
      );
    } else if (purpose === 'knowledge_bank') {
      // Save to knowledge bank
      await supabase.from('user_uploads').insert({
        user_id: userId,
        filename: processed.filename,
        filetype: processed.filetype,
        content: processed.content,
        extracted_data: processed.extracted_data,
        purpose: 'knowledge_bank',
        created_at: new Date(),
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Document added to knowledge bank',
          extractedData: processed.extracted_data,
          metadata: processed.metadata,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid purpose' },
      { status: 400 }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: `File processing failed: ${error}` },
      { status: 500 }
    );
  }
}
