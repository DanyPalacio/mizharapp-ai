-- Create blog_posts table for storing published blog posts
-- Generated from blog_generator.py output

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  case_id INTEGER,
  case_name VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  sectors TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP DEFAULT NOW(),
  author VARCHAR(255) DEFAULT 'MIZHAR Analysis',
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_case FOREIGN KEY(case_id) REFERENCES startup_cases(id) ON DELETE SET NULL
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_sectors ON blog_posts USING GIN(sectors);
CREATE INDEX IF NOT EXISTS idx_blog_case_id ON blog_posts(case_id);

-- Enable RLS for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Anyone can read published posts" ON blog_posts
  FOR SELECT
  USING (published = true);

-- Service role can do everything
CREATE POLICY "Service role full access" ON blog_posts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
