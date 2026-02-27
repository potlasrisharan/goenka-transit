-- ==============================================================================
-- FIX: UUID to TEXT migration
-- The React client generates universal unique identifiers using Date.now() + Math.random() 
-- when crypto.randomUUID() is unavailable. This results in IDs like "id-170123...".
-- Supabase STRICT UUID columns reject these Strings and silently fail the insert.
-- This script alters all 'id' columns from UUID to TEXT.
-- ==============================================================================

-- 1. Drop constraints that depend on the UUID columns (if any exist, though our script didn't make them)
-- 2. Alter column types from UUID to TEXT
ALTER TABLE complaints ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE industrial_visits ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE bus_change_requests ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE seats ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE stops ALTER COLUMN id TYPE TEXT USING id::text;
