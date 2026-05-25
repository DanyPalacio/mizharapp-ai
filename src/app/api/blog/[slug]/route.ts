/**
 * GET /api/blog/[slug]
 *
 * Fetch a single blog post by slug.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Fetch blog post by slug
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !post) {
      console.error('Blog post fetch error:', error);
      // Return mock data on error for demo purposes
      const mockPosts: Record<string, any> = {
        'why-anthropic-winning-ai-safety': {
          id: 1,
          title: 'Why Anthropic is Winning the AI Safety Race',
          slug: 'why-anthropic-winning-ai-safety',
          excerpt: 'An analysis of Anthropic\'s competitive advantages in the race to build safe, beneficial AI systems.',
          content: `Anthropic has emerged as a clear leader in AI safety, setting itself apart from competitors through a comprehensive approach that combines technical excellence with responsible development practices.

## Market Positioning

Anthropic's focus on Constitutional AI and safety-by-design has resonated strongly with enterprise customers who are increasingly concerned about AI risks. This differentiated approach has allowed them to command premium valuations and attract top-tier funding.

## Competitive Advantages

1. **Technical Moat**: Their research in AI alignment and interpretability is among the most advanced globally
2. **Talent**: Attracting top researchers from academia and industry
3. **Enterprise Trust**: Building strong relationships with enterprises seeking safe AI
4. **Capital Efficiency**: Strong unit economics and customer retention rates

## Investment Thesis

From a venture perspective, Anthropic represents a rare combination of:
- Large addressable market (enterprise AI)
- Sustainable competitive moat (safety research)
- Experienced founding team
- Strong market demand

The company is well-positioned to become a dominant player in the AI infrastructure space.`,
          case_id: 1,
          case_name: 'Anthropic',
          tags: ['AI Safety', 'Analysis', 'Investment'],
          sectors: ['AI', 'Software'],
          published_at: new Date(Date.now() - 86400000).toISOString(),
          author: 'MIZHAR Analysis',
          read_time: 8,
          published: true,
        },
        'databricks-lakehouse-platform-analysis': {
          id: 2,
          title: 'Databricks: The Lakehouse Platform Taking Over Data Engineering',
          slug: 'databricks-lakehouse-platform-analysis',
          excerpt: 'How Databricks is reshaping the data infrastructure landscape with its unified lakehouse approach.',
          content: `Databricks\' lakehouse platform represents a paradigm shift in data infrastructure, successfully combining the strengths of data warehouses and data lakes.

## The Problem They Solve

Organizations struggle with fragmented data architectures where data moves between multiple systems (data lakes, warehouses, BI tools), creating complexity and inefficiency.

## The Solution

The lakehouse unifies:
- Data storage and analytics in one system
- ACID transactions for data reliability
- Open standards (Apache Spark, Delta Lake)
- SQL and AI/ML workloads in one platform

## Market Impact

Databricks has achieved:
- Rapid enterprise adoption
- Strong product-market fit
- High customer retention (>95% net revenue retention)
- Clear ROI for customers

## Investment Perspective

The company benefits from:
- Large TAM (data infrastructure market growing 25%+ annually)
- Defensible technology
- Experienced leadership team
- Strong momentum in enterprise sales

Databricks is positioned to become the dominant data infrastructure platform.`,
          case_id: 2,
          case_name: 'Databricks',
          tags: ['Data Infrastructure', 'Market Analysis', 'Growth'],
          sectors: ['Data Platform', 'AI'],
          published_at: new Date(Date.now() - 172800000).toISOString(),
          author: 'MIZHAR Analysis',
          read_time: 10,
          published: true,
        },
        'mistral-open-source-ai-challenge': {
          id: 3,
          title: 'The Rise of Open Source AI Models: Mistral\'s Challenge to Closed Models',
          slug: 'mistral-open-source-ai-challenge',
          excerpt: 'Analyzing Mistral AI\'s strategy to compete in the large language model space through open-source models.',
          content: `Mistral AI represents a new wave of open-source AI innovation, challenging the dominance of closed-source models from OpenAI and Anthropic.

## Strategic Positioning

Mistral has carved out a unique niche by:
- Focusing on efficient, smaller models (7B, 8B parameters)
- Emphasizing model transparency and customization
- Building strong developer community
- Enabling local deployment and fine-tuning

## Technical Innovation

Their models achieve competitive performance with:
- Lower computational requirements
- Faster inference speeds
- Better fine-tuning capabilities
- Open-source transparency

## Market Opportunity

Mistral is targeting:
- Enterprises wanting to avoid vendor lock-in
- Edge deployment scenarios
- Custom model development
- Organizations with privacy concerns

## Investment Considerations

Strengths:
- Differentiated approach in crowded market
- Growing community adoption
- Strong technical team from Meta and Google
- EU-friendly positioning (data residency)

Risks:
- Intense competition from well-funded players
- OpenAI's dominance in enterprise
- Monetization challenges for open-source
- Talent attraction vs. larger companies

The company shows promise but faces significant headwinds.`,
          case_id: 3,
          case_name: 'Mistral AI',
          tags: ['Open Source', 'AI Models', 'Competition'],
          sectors: ['AI', 'Software'],
          published_at: new Date(Date.now() - 259200000).toISOString(),
          author: 'MIZHAR Analysis',
          read_time: 9,
          published: true,
        },
      };

      if (mockPosts[slug]) {
        return NextResponse.json({
          success: true,
          data: mockPosts[slug],
        });
      }

      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Blog detail API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch blog post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
