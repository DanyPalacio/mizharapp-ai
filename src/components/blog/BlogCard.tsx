/**
 * Blog Card Component
 * Displays summary of a blog post with metadata and excerpt.
 */

import Link from 'next/link';

interface BlogCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  case_name?: string;
  tags: string[];
  sectors: string[];
  published_at: string;
  author: string;
  read_time: number;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  case_name,
  tags,
  sectors,
  published_at,
  author,
  read_time,
}: BlogCardProps) {
  const publishedDate = new Date(published_at);
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${slug}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {title}
          </h2>
          {case_name && (
            <p className="text-sm text-gray-600 mb-2">
              Case Study: <span className="font-semibold">{case_name}</span>
            </p>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-gray-700 mb-4 line-clamp-2">
          {excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sectors */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sectors.map((sector) => (
            <span
              key={sector}
              className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
            >
              {sector}
            </span>
          ))}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-4">
            <span>{author}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
          <span className="font-medium">{read_time} min read</span>
        </div>
      </div>
    </Link>
  );
}
