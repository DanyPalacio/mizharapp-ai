/**
 * Blog Index Page
 * Path: /app/blog
 *
 * Display all published case study blog posts.
 */

'use client';

import { useEffect, useState } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  case_id?: number;
  case_name?: string;
  tags: string[];
  sectors: string[];
  published_at: string;
  author: string;
  read_time: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allSectors, setAllSectors] = useState<string[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);

      // Fetch real blog posts from API
      const response = await fetch('/api/blog');

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const { data: dbPosts } = await response.json();

      // Use real data if available, otherwise use mock data for demo
      const postsToUse: BlogPost[] = dbPosts && dbPosts.length > 0 ? dbPosts : [
        {
          id: 1,
          title: 'Why Anthropic is Winning the AI Safety Race',
          slug: 'why-anthropic-winning-ai-safety',
          excerpt: 'An analysis of Anthropic\'s competitive advantages in the race to build safe, beneficial AI systems.',
          content: 'Anthropic has emerged as a clear leader in AI safety...',
          case_name: 'Anthropic',
          tags: ['AI Safety', 'Analysis', 'Investment'],
          sectors: ['AI', 'Software'],
          published_at: new Date(Date.now() - 86400000).toISOString(),
          author: 'MIZHAR Analysis',
          read_time: 8,
        },
        {
          id: 2,
          title: 'Databricks: The Lakehouse Platform Taking Over Data Engineering',
          slug: 'databricks-lakehouse-platform-analysis',
          excerpt: 'How Databricks is reshaping the data infrastructure landscape with its unified lakehouse approach.',
          content: 'Databricks\' lakehouse platform represents a paradigm shift...',
          case_name: 'Databricks',
          tags: ['Data Infrastructure', 'Market Analysis', 'Growth'],
          sectors: ['Data Platform', 'AI'],
          published_at: new Date(Date.now() - 172800000).toISOString(),
          author: 'MIZHAR Analysis',
          read_time: 10,
        },
        {
          id: 3,
          title: 'The Rise of Open Source AI Models: Mistral\'s Challenge to Closed Models',
          slug: 'mistral-open-source-ai-challenge',
          excerpt: 'Analyzing Mistral AI\'s strategy to compete in the large language model space through open-source models.',
          content: 'Mistral AI represents a new wave of open-source AI innovation...',
          case_name: 'Mistral AI',
          tags: ['Open Source', 'AI Models', 'Competition'],
          sectors: ['AI', 'Software'],
          published_at: new Date(Date.now() - 259200000).toISOString(),
          author: 'MIZHAR Analysis',
          read_time: 9,
        },
      ];

      setPosts(postsToUse);

      // Extract unique tags and sectors
      const tagSet = new Set<string>();
      const sectorSet = new Set<string>();
      postsToUse.forEach((post) => {
        post.tags.forEach((tag) => tagSet.add(tag));
        post.sectors.forEach((sector) => sectorSet.add(sector));
      });

      setAllTags(Array.from(tagSet).sort());
      setAllSectors(Array.from(sectorSet).sort());
    } catch (err) {
      console.error('Blog loading error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const tagMatch = selectedTag === 'all' || post.tags.includes(selectedTag);
    const sectorMatch = selectedSector === 'all' || post.sectors.includes(selectedSector);
    return tagMatch && sectorMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Analysis Blog</h1>
        <p className="text-lg text-gray-600">
          In-depth case studies and insights from MIZHAR's Challenge Mode analysis
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Topic
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tag"
                  value="all"
                  checked={selectedTag === 'all'}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">All Topics</span>
              </label>
              {allTags.map((tag) => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tag"
                    value={tag}
                    checked={selectedTag === tag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sector
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sector"
                  value="all"
                  checked={selectedSector === 'all'}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">All Sectors</span>
              </label>
              {allSectors.map((sector) => (
                <label key={sector} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sector"
                    value={sector}
                    checked={selectedSector === sector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{sector}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredPosts.length} Post{filteredPosts.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No posts match your filters</p>
            <button
              onClick={() => {
                setSelectedTag('all');
                setSelectedSector('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
