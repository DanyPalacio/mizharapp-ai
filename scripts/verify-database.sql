-- MIZHAR Platform - Database Verification Script
--
-- Run this in Supabase SQL Editor to verify database setup
-- Copy and paste this entire script into SQL Editor and click Run
--
-- This script verifies:
-- 1. All 3 tables exist
-- 2. All columns are present
-- 3. Indexes are created
-- 4. RLS policies are enabled
-- 5. Foreign key relationships work
-- 6. Data can be inserted and queried

-- =============================================================================
-- 1. VERIFY TABLES EXIST
-- =============================================================================

\echo '=== Verifying Tables Exist ==='

-- Check startup_cases table
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'startup_cases'
) as startup_cases_exists;

-- Check case_analyses table
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'case_analyses'
) as case_analyses_exists;

-- Check blog_posts table
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'blog_posts'
) as blog_posts_exists;

-- =============================================================================
-- 2. VERIFY BLOG_POSTS COLUMNS
-- =============================================================================

\echo '=== Verifying blog_posts Columns ==='

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

-- =============================================================================
-- 3. VERIFY INDEXES
-- =============================================================================

\echo '=== Verifying Indexes on blog_posts ==='

SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'blog_posts'
ORDER BY indexname;

-- =============================================================================
-- 4. VERIFY RLS POLICIES
-- =============================================================================

\echo '=== Verifying RLS Policies ==='

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('blog_posts', 'startup_cases', 'case_analyses')
ORDER BY tablename;

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'blog_posts'
ORDER BY tablename, policyname;

-- =============================================================================
-- 5. VERIFY FOREIGN KEY RELATIONSHIPS
-- =============================================================================

\echo '=== Verifying Foreign Key Constraints ==='

SELECT constraint_name, table_name, column_name,
       foreign_table_name, foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu USING (constraint_catalog, constraint_schema, constraint_name)
JOIN information_schema.referential_constraints rc USING (constraint_catalog, constraint_schema, constraint_name)
JOIN information_schema.key_column_usage kcu2 USING (constraint_catalog, constraint_schema, referential_constraint_name)
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'blog_posts';

-- =============================================================================
-- 6. VERIFY DATA CAN BE INSERTED (Test with sample data)
-- =============================================================================

\echo '=== Testing Data Insertion ==='

-- Insert test case if not exists
INSERT INTO startup_cases (name, description, stage, sectors, total_funding, data_source)
SELECT 'Test Case', 'Test Description', 'Seed', '{"AI", "Software"}', 1000000000, 'test'
WHERE NOT EXISTS (
    SELECT 1 FROM startup_cases WHERE name = 'Test Case'
);

-- Insert test blog post if not exists
INSERT INTO blog_posts (title, slug, excerpt, content, case_id, tags, sectors, published, author)
SELECT
    'Test Blog Post',
    'test-blog-post',
    'Test excerpt',
    'Test content',
    id,
    '{"test", "verification"}',
    '{"AI", "Software"}',
    false,
    'System Test'
FROM startup_cases
WHERE name = 'Test Case'
AND NOT EXISTS (
    SELECT 1 FROM blog_posts WHERE slug = 'test-blog-post'
);

-- =============================================================================
-- 7. VERIFY DATA CAN BE QUERIED
-- =============================================================================

\echo '=== Testing Data Queries ==='

-- Count rows in each table
SELECT 'startup_cases' as table_name, COUNT(*) as row_count FROM startup_cases
UNION ALL
SELECT 'case_analyses' as table_name, COUNT(*) as row_count FROM case_analyses
UNION ALL
SELECT 'blog_posts' as table_name, COUNT(*) as row_count FROM blog_posts
ORDER BY table_name;

-- =============================================================================
-- 8. DETAILED TABLE STRUCTURE
-- =============================================================================

\echo '=== Detailed blog_posts Table Structure ==='

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

-- =============================================================================
-- 9. CHECK DISK USAGE
-- =============================================================================

\echo '=== Table Size Information ==='

SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename IN ('startup_cases', 'case_analyses', 'blog_posts')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =============================================================================
-- 10. SUMMARY REPORT
-- =============================================================================

\echo '=== VERIFICATION SUMMARY ==='
\echo 'Database verification script completed.'
\echo 'Check results above for:'
\echo '  ✓ All tables exist'
\echo '  ✓ All columns present'
\echo '  ✓ Indexes created'
\echo '  ✓ RLS policies enabled'
\echo '  ✓ Foreign keys configured'
\echo '  ✓ Data insertion works'
\echo '  ✓ Data queries work'
\echo ''
\echo 'If all checks pass, database is ready for production!'
