-- ==============================================================================
-- GOENKA TRANSIT - FIX SCRIPT (Run this in Supabase SQL Editor)
-- This fixes RLS policy violations and Realtime subscription issues
-- ==============================================================================

-- 1. Ensure all tables exist (safe to re-run)
CREATE TABLE IF NOT EXISTS routes (id TEXT PRIMARY KEY, name TEXT NOT NULL, start_point TEXT, city TEXT, color TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS buses (id TEXT PRIMARY KEY, number TEXT NOT NULL, name TEXT, capacity INTEGER DEFAULT 51, route_id TEXT, driver_id TEXT, status TEXT DEFAULT 'active', total_seats INTEGER DEFAULT 51, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS drivers (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT, license TEXT, bus_id TEXT, status TEXT DEFAULT 'on_duty', experience TEXT, rating NUMERIC(3,1) DEFAULT 4.5, conductor_name TEXT, conductor_phone TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT, phone TEXT, route_id TEXT, bus_id TEXT, seat_number TEXT, fee_paid BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS complaints (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), student_id TEXT, student_name TEXT, bus_id TEXT, category TEXT, subject TEXT, message TEXT, status TEXT DEFAULT 'pending', response TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS industrial_visits (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), faculty_id TEXT, faculty_name TEXT, destination TEXT, visit_date DATE, num_students INTEGER, purpose TEXT, status TEXT DEFAULT 'pending', bus_assigned TEXT, admin_note TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS bus_change_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), student_id TEXT, student_name TEXT, current_bus_id TEXT, requested_bus_id TEXT, reason TEXT, status TEXT DEFAULT 'pending', admin_note TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS seats (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), bus_id TEXT, seat_number TEXT NOT NULL, student_id TEXT, status TEXT DEFAULT 'booked', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS stops (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), route_id TEXT, name TEXT NOT NULL, stop_order INTEGER NOT NULL, pickup_time TEXT, lat NUMERIC, lng NUMERIC, created_at TIMESTAMPTZ DEFAULT NOW());

-- 2. DISABLE Row Level Security on ALL tables
--    (This is the key fix - RLS was probably blocking inserts from anon users)
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE buses DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE bus_change_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE seats DISABLE ROW LEVEL SECURITY;
ALTER TABLE stops DISABLE ROW LEVEL SECURITY;

-- 3. Grant full access to anonymous users (the anon role used by the browser)
GRANT ALL ON complaints TO anon;
GRANT ALL ON industrial_visits TO anon;
GRANT ALL ON bus_change_requests TO anon;
GRANT ALL ON seats TO anon;
GRANT ALL ON routes TO anon;
GRANT ALL ON buses TO anon;
GRANT ALL ON drivers TO anon;
GRANT ALL ON students TO anon;
GRANT ALL ON stops TO anon;

-- 4. Fix Realtime - DO NOT drop the publication, just ADD tables to it
DO $$
BEGIN
  -- Add each table to realtime publication (ignore if already added)
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE complaints; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE industrial_visits; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE bus_change_requests; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE seats; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE buses; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE drivers; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- 5. Enable replica identity on tables (required for realtime DELETE events)
ALTER TABLE complaints REPLICA IDENTITY FULL;
ALTER TABLE industrial_visits REPLICA IDENTITY FULL;
ALTER TABLE bus_change_requests REPLICA IDENTITY FULL;
ALTER TABLE seats REPLICA IDENTITY FULL;
