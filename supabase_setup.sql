-- ==============================================================================
-- SUPABASE SETUP SCRIPT FOR GOENKA TRANSIT
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor to create all necessary
-- tables, populate them, and ENABLE REAL-TIME SYNC.
-- Without this, data will not sync between different tabs/dashboards.
-- ==============================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_point TEXT,
    city TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buses (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    name TEXT,
    capacity INTEGER DEFAULT 51,
    route_id TEXT REFERENCES routes(id),
    driver_id TEXT,
    status TEXT DEFAULT 'active',
    total_seats INTEGER DEFAULT 51,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    license TEXT,
    bus_id TEXT REFERENCES buses(id),
    status TEXT DEFAULT 'on_duty',
    experience TEXT,
    rating NUMERIC(3,1) DEFAULT 4.5,
    conductor_name TEXT,
    conductor_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    route_id TEXT REFERENCES routes(id),
    bus_id TEXT REFERENCES buses(id),
    seat_number TEXT,
    fee_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT,
    student_name TEXT,
    bus_id TEXT REFERENCES buses(id),
    category TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS industrial_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id TEXT,
    faculty_name TEXT,
    destination TEXT,
    visit_date DATE,
    num_students INTEGER,
    purpose TEXT,
    status TEXT DEFAULT 'pending',
    bus_assigned TEXT REFERENCES buses(id),
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bus_change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT,
    student_name TEXT,
    current_bus_id TEXT REFERENCES buses(id),
    requested_bus_id TEXT REFERENCES buses(id),
    reason TEXT,
    status TEXT DEFAULT 'pending',
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id TEXT REFERENCES buses(id),
    seat_number TEXT NOT NULL,
    student_id TEXT,
    status TEXT DEFAULT 'booked',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id TEXT REFERENCES routes(id),
    name TEXT NOT NULL,
    stop_order INTEGER NOT NULL,
    pickup_time TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 2. Disable Row Level Security (RLS) for testing / open access
-- NOTE: In production, you would configure strict policies. Here we disable it
-- so the React app can read/write freely without throwing errors.
-- ==============================================================================
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE buses DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE bus_change_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE seats DISABLE ROW LEVEL SECURITY;
ALTER TABLE stops DISABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. Enable REAL-TIME sync for all interactive tables
-- This is what makes changes in one tab instantly show up in another tab!
-- ==============================================================================
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
    complaints, 
    industrial_visits, 
    bus_change_requests, 
    seats, 
    buses, 
    drivers;
