-- =====================================================
-- Goenka Transit – Complete Database Setup (Phase 2)
-- Run in Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. DROP existing tables
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS bus_change_requests CASCADE;
DROP TABLE IF EXISTS industrial_visits CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS buses CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS routes CASCADE;

-- 2. CREATE TABLES

CREATE TABLE routes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_point TEXT,
  city TEXT DEFAULT 'New Delhi',
  color TEXT DEFAULT '#6c5ce7'
);

CREATE TABLE drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  bus_id TEXT,
  status TEXT DEFAULT 'on_duty',
  experience TEXT,
  rating NUMERIC DEFAULT 4.5,
  conductor_name TEXT,
  conductor_phone TEXT
);

CREATE TABLE buses (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER DEFAULT 40,
  total_seats INTEGER DEFAULT 40,
  route_id TEXT REFERENCES routes(id),
  driver_id TEXT REFERENCES drivers(id),
  status TEXT DEFAULT 'active'
);

CREATE TABLE stops (
  id SERIAL PRIMARY KEY,
  route_id TEXT REFERENCES routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pickup_time TEXT,
  stop_order INTEGER DEFAULT 0
);

CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  route_id TEXT REFERENCES routes(id),
  bus_id TEXT,
  seat_number TEXT,
  fee_paid BOOLEAN DEFAULT false,
  semester TEXT DEFAULT 'Spring 2026',
  role TEXT DEFAULT 'student'
);

CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  student_id TEXT,
  student_name TEXT,
  bus_id TEXT,
  category TEXT DEFAULT 'Other',
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE seats (
  id SERIAL PRIMARY KEY,
  bus_id TEXT NOT NULL,
  seat_number TEXT NOT NULL,
  student_id TEXT,
  is_booked BOOLEAN DEFAULT false,
  UNIQUE(bus_id, seat_number)
);

CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'student',
  phone TEXT,
  bus_id TEXT,
  avatar TEXT DEFAULT '🧑‍🎓',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bus_change_requests (
  id SERIAL PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT,
  current_bus_id TEXT,
  requested_bus_id TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE industrial_visits (
  id SERIAL PRIMARY KEY,
  faculty_id TEXT NOT NULL,
  faculty_name TEXT,
  destination TEXT NOT NULL,
  visit_date TEXT,
  num_students INTEGER DEFAULT 0,
  purpose TEXT,
  status TEXT DEFAULT 'pending',
  bus_assigned TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS POLICIES (open for development)

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON routes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON buses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON stops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON complaints FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON seats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON bus_change_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON industrial_visits FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED DATA – ROUTES (from GDGU Excel)

INSERT INTO routes (id, name, start_point, city, color) VALUES
  ('R01', 'Route 01 – Rohini West Metro',         'ROHINI WEST METRO STATION, N.D.',              'New Delhi',  '#6c5ce7'),
  ('R02', 'Route 02 – R.K. Ashram Marg',          'R.K. ASHRAM MARG (CANNAUGHT PLACE), N.D.',     'New Delhi',  '#00b894'),
  ('R03', 'Route 03 – Nehru Place',                'NEHRU PLACE, NEW DELHI',                       'New Delhi',  '#e17055'),
  ('R04', 'Route 04 – Chatterpur Metro',           'CHATTERPUR METRO STATION (NEW DELHI)',          'New Delhi',  '#0984e3'),
  ('R05', 'Route 05 – Janakpuri via Dwarka',       'DISTRICT CENTER JANAKPURI VIA-DWARKA, N.D.',   'New Delhi',  '#fdcb6e'),
  ('R06', 'Route 06 – Dwarka More',                'DWARKA MORE, NEW DELHI',                       'New Delhi',  '#e84393'),
  ('R07', 'Route 07 – Najafgarh via Palam Vihar',  'NAJAFGARH VIA PALAM VIHAR ROUTE',              'New Delhi',  '#00cec9'),
  ('R08', 'Route 08 – Ashok Vihar, Gurugram',      'ASHOK VIHAR PHASE-III, GURGAON',               'Gurugram',   '#a29bfe'),
  ('R09', 'Route 09 – Huda City Center',           'HUDA CITY CENTER METRO STATION, GURGAON',      'Gurugram',   '#fab1a0'),
  ('R10', 'Route 10 – Manesar',                    'SECTOR 91-92, 83-84 MANESAR, GURGAON',         'Gurugram',   '#55efc4'),
  ('R11', 'Route 11 – Ballabhgarh via Faridabad',  'BALLABHGARH VIA FARIDABAD',                    'Faridabad',  '#74b9ff');

-- DRIVERS
INSERT INTO drivers (id, name, phone, bus_id, conductor_name, conductor_phone, status, rating) VALUES
  ('DRV01', 'Shashi Lal',       '+91 9971349452', 'BUS01', 'Rahul Saini',       '+91 9871632122', 'on_duty', 4.8),
  ('DRV02', 'Rumal Singh',      '+91 9810981547', 'BUS02', 'SC Das Adhikari',   '+91 8860482101', 'on_duty', 4.6),
  ('DRV03', 'Anil Kumar',       '+91 7303991843', 'BUS03', 'Vijay Morya',       '+91 9650863415', 'on_duty', 4.5),
  ('DRV04', 'Ramvakil',         '+91 9557591338', 'BUS04', 'Virender',          '+91 9971971123', 'on_duty', 4.7),
  ('DRV05', 'Bacchu Singh',     '+91 9311210008', 'BUS05', 'Govind',            '+91 9634759519', 'on_duty', 4.3),
  ('DRV06', 'Satbir Sharma',    '+91 7011563329', 'BUS06', 'Maan Singh',        '+91 7834813540', 'on_duty', 4.4),
  ('DRV07', 'Vinod',            '+91 9468032912', 'BUS07', 'Dinesh',            '+91 7988985801', 'on_duty', 4.2),
  ('DRV08', 'Naresh Kumar',     '+91 8059088438', 'BUS08', 'Pravesh Kumar',     '+91 7988302039', 'on_duty', 4.6),
  ('DRV09', 'Neeraj',           '+91 9588146175', 'BUS09', 'Sriram',            '+91 9918663271', 'on_duty', 4.1),
  ('DRV10', 'Mahender',         '+91 7056574055', 'BUS10', 'Santosh',           '+91 9211528110', 'on_duty', 4.7),
  ('DRV11', 'Baldev',           '+91 9458856713', 'BUS11', 'Premraj',           '+91 8607542254', 'on_duty', 4.3);

-- BUSES
INSERT INTO buses (id, number, name, capacity, total_seats, route_id, driver_id, status) VALUES
  ('BUS01', 'GK-01', 'Rohini Express',        40, 40, 'R01', 'DRV01', 'active'),
  ('BUS02', 'GK-02', 'CP Connector',          40, 40, 'R02', 'DRV02', 'active'),
  ('BUS03', 'GK-03', 'Nehru Place Shuttle',   40, 40, 'R03', 'DRV03', 'active'),
  ('BUS04', 'GK-04', 'Chatterpur Rider',      40, 40, 'R04', 'DRV04', 'active'),
  ('BUS05', 'GK-05', 'Janakpuri Express',     40, 40, 'R05', 'DRV05', 'active'),
  ('BUS06', 'GK-06', 'Dwarka Link',           40, 40, 'R06', 'DRV06', 'active'),
  ('BUS07', 'GK-07', 'Najafgarh Cruiser',     40, 40, 'R07', 'DRV07', 'active'),
  ('BUS08', 'GK-08', 'Ashok Vihar Bus',       40, 40, 'R08', 'DRV08', 'active'),
  ('BUS09', 'GK-09', 'Huda City Shuttle',     40, 40, 'R09', 'DRV09', 'active'),
  ('BUS10', 'GK-10', 'Manesar Connect',       40, 40, 'R10', 'DRV10', 'active'),
  ('BUS11', 'GK-11', 'Faridabad Express',     40, 40, 'R11', 'DRV11', 'active');

-- STOPS (all 172 from Excel)
-- Route 01: Rohini West Metro (13 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R01', 'Rohini West Metro, New Delhi', '06:50 AM', 1),
  ('R01', 'Rohini East Metro, New Delhi', '06:52 AM', 2),
  ('R01', 'Pitampura Metro Station, New Delhi', '06:58 AM', 3),
  ('R01', 'Kohat Enclave Metro Station, New Delhi', '07:01 AM', 4),
  ('R01', 'Netaji Shubhash Place, New Delhi', '07:05 AM', 5),
  ('R01', 'Wazirpur Bus Depot, New Delhi', '07:07 AM', 6),
  ('R01', 'Britania Chowk, New Delhi', '07:08 AM', 7),
  ('R01', 'Punjabi Bagh Chowk, New Delhi', '07:10 AM', 8),
  ('R01', 'Punjabi Bagh Club, New Delhi', '07:11 AM', 9),
  ('R01', 'Rajouri Garden, New Delhi', '07:15 AM', 10),
  ('R01', 'Marble Market, Rajouri Garden, N.D.', '07:16 AM', 11),
  ('R01', 'Delhi Cant Metro Station, N.D.', '07:25 AM', 12),
  ('R01', 'G D Goenka Education City', '09:00 AM', 13);

-- Route 02: R.K. Ashram Marg (22 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R02', 'R.K. Ashram Metro Station, New Delhi', '06:55 AM', 1),
  ('R02', 'Karol Bagh Metro Station, New Delhi', '07:05 AM', 2),
  ('R02', 'Rajendra Palace Metro Station, N.D.', '07:07 AM', 3),
  ('R02', 'Satyaniketan, New Delhi', '07:20 AM', 4),
  ('R02', 'Motibagh Bus Stop, New Delhi', '07:25 AM', 5),
  ('R02', 'Vasant Vihar Village, New Delhi', '07:30 AM', 6),
  ('R02', 'Subrato Park, New Delhi', '07:32 AM', 7),
  ('R02', 'Mahipalpur, New Delhi', '07:40 AM', 8),
  ('R02', 'Rangpuri, Mahipalpur, New Delhi', '07:43 AM', 9),
  ('R02', 'Rajokari, New Delhi', '07:48 AM', 10),
  ('R02', 'Sector 31, Red Light, Gurugram', '08:02 AM', 11),
  ('R02', 'Jharsa Chowk, Gurugram', '08:05 AM', 12),
  ('R02', 'Rajiv Chowk, Gurugram', '08:08 AM', 13),
  ('R02', 'JMD Garden, Sohna Road, Gurugram', '08:10 AM', 14),
  ('R02', 'Subhash Chowk, Sohna Road, Gurugram', '08:12 AM', 15),
  ('R02', 'Malibu Towne, Gurugram Sohna Road', '08:13 AM', 16),
  ('R02', 'Omexe Mall, Sohna Road, Gurugram', '08:15 AM', 17),
  ('R02', 'Uppal Southend, Gurugram', '08:16 AM', 18),
  ('R02', 'Vatika Business Park, Main Sohna Road, Gurugram', '08:18 AM', 19),
  ('R02', 'Vatika City Red Light, Gurugram', '08:19 AM', 20),
  ('R02', 'G D Goenka Education City', '09:00 AM', 21);

-- Route 03: Nehru Place (19 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R03', 'Pampos Enclave, New Delhi', '06:40 AM', 1),
  ('R03', 'NSIC Okhla Metro Station, N.D.', '06:45 AM', 2),
  ('R03', 'Lajpat Nagar, New Delhi', '06:52 AM', 3),
  ('R03', 'Moolchand Metro Station, New Delhi', '06:55 AM', 4),
  ('R03', 'Chirag Delhi, N.D.', '07:00 AM', 5),
  ('R03', 'Panchsheel Metro Station, N.D.', '07:03 AM', 6),
  ('R03', 'Hauz Khas Metro Station, N.D.', '07:05 AM', 7),
  ('R03', 'Capital Court Munirka, New Delhi', '07:10 AM', 8),
  ('R03', 'Vasant Vihar Police Station, N.D.', '07:13 AM', 9),
  ('R03', 'JNU, New Delhi', '07:15 AM', 10),
  ('R03', 'Kishangarh, New Delhi', '07:25 AM', 11),
  ('R03', 'Chatterpur Metro Station, N.D.', '07:30 AM', 12),
  ('R03', 'New Manlapuri, New Delhi', '07:35 AM', 13),
  ('R03', 'Sultanpur Metro Station, N.D.', '07:38 AM', 14),
  ('R03', 'Ghitorni Metro Station, N.D.', '07:44 AM', 15),
  ('R03', 'Hotel Hyatt, Sector 66, Gurugram', '08:10 AM', 16),
  ('R03', 'Paras Trinity, Sector 60, Gurugram', '08:15 AM', 17),
  ('R03', 'Ansal Assencia, Sector 67, Gurugram', '08:20 AM', 18),
  ('R03', 'G D Goenka Education City', '09:00 AM', 19);

-- Route 04: Chatterpur Metro (24 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R04', 'Vasant Kunj, New Delhi', '06:55 AM', 1),
  ('R04', 'Masoodpur, Vasant Kunj, New Delhi', '07:00 AM', 2),
  ('R04', 'Chatterpur Metro Station, N.D.', '07:10 AM', 3),
  ('R04', 'New Manlapuri, New Delhi', '07:15 AM', 4),
  ('R04', 'Sultanpur Metro Station, N.D.', '07:16 AM', 5),
  ('R04', 'Ghitorni Village, New Delhi', '07:20 AM', 6),
  ('R04', 'Nathupur, DLF Phase 3, Gurugram', '07:25 AM', 7),
  ('R04', 'Dronacharya Metro Station, Gurugram', '07:35 AM', 8),
  ('R04', 'DLF City Court Sector 24, Gurugram', '07:38 AM', 9),
  ('R04', 'Sikanderpur Metro Station, Gurugram', '07:40 AM', 10),
  ('R04', 'DLF Phase 01 Rapid Metro, Gurugram', '07:45 AM', 11),
  ('R04', 'Sector 42-43 Rapid Metro, Gurugram', '07:50 AM', 12),
  ('R04', 'Genpact, Sector 43, Gurugram', '07:52 AM', 13),
  ('R04', 'Sector 53-54 Rapid Metro, Gurugram', '07:55 AM', 14),
  ('R04', 'Suncity, Sector 54, Gurugram', '07:57 AM', 15),
  ('R04', 'AIT Chowk, Gurugram', '08:00 AM', 16),
  ('R04', 'Sector 55-56 Rapid Metro, Gurugram', '08:01 AM', 17),
  ('R04', 'Kendriya Vihar, Sector 56, Gurugram', '08:03 AM', 18),
  ('R04', 'Hong Kong Market, Gurugram', '08:05 AM', 19),
  ('R04', 'Pioneer Park, Sector 61, Gurugram', '08:10 AM', 20),
  ('R04', 'World Mark, Sector 60, Gurugram', '08:15 AM', 21),
  ('R04', 'M3M Merlin, Sector 67, Gurugram', '08:17 AM', 22),
  ('R04', 'Ansal Assencia, Sector 67, Gurugram', '08:20 AM', 23),
  ('R04', 'G D Goenka Education City', '09:00 AM', 24);

-- Route 05: Janakpuri via Dwarka (10 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R05', 'District Center Janakpuri, New Delhi', '06:55 AM', 1),
  ('R05', 'Uttam Nagar Bus Terminal, New Delhi', '07:00 AM', 2),
  ('R05', 'Dabri More, New Delhi', '07:10 AM', 3),
  ('R05', 'Power House Dwarka, New Delhi', '07:18 AM', 4),
  ('R05', 'Bhagat Chandra Hospital, Dwarka, N.D.', '07:22 AM', 5),
  ('R05', 'Sector 1, Dwarka, New Delhi', '07:25 AM', 6),
  ('R05', 'Dwarka Sec 6-7, New Delhi', '07:28 AM', 7),
  ('R05', 'Dwarka Sector 8-9 Metro, New Delhi', '07:30 AM', 8),
  ('R05', 'Paramount School Sector 22, N.D.', '07:38 AM', 9),
  ('R05', 'G D Goenka Education City', '09:00 AM', 10);

-- Route 06: Dwarka More (10 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R06', 'Dwarka More, New Delhi', '07:00 AM', 1),
  ('R06', 'Sector 3-4, Red Light, Dwarka, N.D.', '07:10 AM', 2),
  ('R06', 'Sector 12, Red Light, Dwarka, N.D.', '07:13 AM', 3),
  ('R06', 'Ashirwad Chowk, Sector 04/05, Dwarka', '07:20 AM', 4),
  ('R06', 'Sector 10 Market, Dwarka, New Delhi', '07:23 AM', 5),
  ('R06', 'Sector 08-09 DTC Depot, Dwarka, N.D.', '07:28 AM', 6),
  ('R06', 'Sector 08-09 Metro Station, Dwarka', '07:30 AM', 7),
  ('R06', 'Sector 21 Metro Station, Dwarka, N.D.', '07:40 AM', 8),
  ('R06', 'Samalakha Red Light, New Delhi', '07:45 AM', 9),
  ('R06', 'G D Goenka Education City', '09:00 AM', 10);

-- Route 07: Najafgarh via Palam Vihar (19 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R07', 'Dhansa Metro Station, Najafgarh, N.D.', '07:05 AM', 1),
  ('R07', 'Bahadurgarh More, Najafgarh', '07:07 AM', 2),
  ('R07', 'Delhi Gate, Najafgarh, New Delhi', '07:15 AM', 3),
  ('R07', 'Chawala Stand, Najafgarh, New Delhi', '07:16 AM', 4),
  ('R07', 'New Roshanpura, Chawla Najafgarh Road', '07:20 AM', 5),
  ('R07', 'Deenpur, New Delhi', '07:25 AM', 6),
  ('R07', 'Chhawla Village, New Delhi', '07:30 AM', 7),
  ('R07', 'Bajghera Village, Gurugram', '07:37 AM', 8),
  ('R07', 'Mahindra Aura Appt., Bajghera, Gurugram', '07:42 AM', 9),
  ('R07', 'Krishna Chowk, Palam Vihar, Gurugram', '07:43 AM', 10),
  ('R07', 'Spanish Court, Sec 23, Palam Vihar', '07:45 AM', 11),
  ('R07', 'Columbia Asia Circle, Palam Vihar', '07:49 AM', 12),
  ('R07', 'Sector 23, Gate 03, Palam Vihar', '07:50 AM', 13),
  ('R07', 'Sector 23, Gate 01, Palam Vihar', '07:52 AM', 14),
  ('R07', 'Sector 22, Devilal Park, Palam Vihar', '07:53 AM', 15),
  ('R07', 'Sector 22, Main Market, Palam Vihar', '07:55 AM', 16),
  ('R07', 'Atul Kataria Chowk, Sector 17, Gurugram', '08:07 AM', 17),
  ('R07', 'MDI Chowk, Gurugram', '08:10 AM', 18),
  ('R07', 'G D Goenka Education City', '09:00 AM', 19);

-- Route 08: Ashok Vihar, Gurugram (10 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R08', 'Ashok Vihar Phase III, Gurugram', '07:50 AM', 1),
  ('R08', 'Sector 05 Circle, Gurugram', '07:55 AM', 2),
  ('R08', 'Baba Prakashpuri Chowk, Gurugram', '07:58 AM', 3),
  ('R08', 'Mata Chintpurni Mandir, Gurugram', '08:02 AM', 4),
  ('R08', 'Harish Bakery, Sector 07, Gurugram', '08:10 AM', 5),
  ('R08', 'Rajmahal Hotel, Colony More, Gurugram', '08:12 AM', 6),
  ('R08', 'Shiv Murti, Main Sadar Market Road', '08:14 AM', 7),
  ('R08', 'Sohna Chowk, Gurugram', '08:19 AM', 8),
  ('R08', 'Commissioner Office, Gurugram', '08:22 AM', 9),
  ('R08', 'G D Goenka Education City', '09:00 AM', 10);

-- Route 09: Huda City Center (12 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R09', 'Millennium City Centre Metro, Gurugram', '07:40 AM', 1),
  ('R09', 'Sector 40 Red Light, Gurugram', '07:50 AM', 2),
  ('R09', 'Cyber Park, Sector 46, Gurugram', '07:52 AM', 3),
  ('R09', 'ISKCON Temple, Sector 46, Gurugram', '07:56 AM', 4),
  ('R09', 'Sector 52, Gurugram', '08:00 AM', 5),
  ('R09', 'Artemis Hospital, Gurugram', '08:02 AM', 6),
  ('R09', 'White House, Sector 57, Gurugram', '08:04 AM', 7),
  ('R09', 'Sector 57, Boom Plaza, Gurugram', '08:07 AM', 8),
  ('R09', 'St. Xavier School, Sector 56, Gurugram', '08:15 AM', 9),
  ('R09', 'MGF Emmar, Palm Drive, Sector 66', '08:18 AM', 10),
  ('R09', 'Vatika City, Sector 49, Gurugram', '08:19 AM', 11),
  ('R09', 'G D Goenka Education City', '09:00 AM', 12);

-- Route 10: Manesar (15 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R10', 'Sare Home Sec 92, Gurugram', '07:20 AM', 1),
  ('R10', 'DLF Heights Sec 91, Gurugram', '07:30 AM', 2),
  ('R10', 'Sec 84, Bada Chowk, Gurugram', '07:34 AM', 3),
  ('R10', 'Circle 03, Sec 84, Gurugram', '07:42 AM', 4),
  ('R10', 'Park View Spa Signature, Sec 81', '07:45 AM', 5),
  ('R10', 'Sapphire Mall, Sec 83, Gurugram', '07:50 AM', 6),
  ('R10', 'Vatika India Next, Sec 82, Gurugram', '07:55 AM', 7),
  ('R10', 'Police Station, Near Hyatt Regency', '08:00 AM', 8),
  ('R10', 'Sector 77, SPR, Gurugram', '08:05 AM', 9),
  ('R10', 'Sector 75A, SPR, Gurugram', '08:10 AM', 10),
  ('R10', 'Sector 69, SPR, Gurugram', '08:15 AM', 11),
  ('R10', 'Sector 70, SPR, Gurugram', '08:18 AM', 12),
  ('R10', 'Vatika City Red Light, Gurugram', '08:20 AM', 13),
  ('R10', 'Badshahpur, Gurugram', '08:22 AM', 14),
  ('R10', 'G D Goenka Education City', '09:00 AM', 15);

-- Route 11: Ballabhgarh via Faridabad (18 stops)
INSERT INTO stops (route_id, name, pickup_time, stop_order) VALUES
  ('R11', 'Sikiri, Faridabad', '07:05 AM', 1),
  ('R11', 'Jhar Saintali, Faridabad', '07:10 AM', 2),
  ('R11', 'Ballabhgarh Petrol Pump, Bus Terminal', '07:15 AM', 3),
  ('R11', 'Ballabhgarh Metro Station', '07:20 AM', 4),
  ('R11', 'Sihi Metro Station, Faridabad', '07:22 AM', 5),
  ('R11', 'Escort Mujeser Metro Station', '07:25 AM', 6),
  ('R11', 'Bata Metro Station, Faridabad', '07:27 AM', 7),
  ('R11', 'Neelam Metro Station, Faridabad', '07:30 AM', 8),
  ('R11', 'Old Flyover, Sector 16, Faridabad', '07:32 AM', 9),
  ('R11', 'Badkal Metro Station, Faridabad', '07:35 AM', 10),
  ('R11', 'Asian Hospital, Faridabad', '07:40 AM', 11),
  ('R11', 'Sector 21C Block, Faridabad', '07:45 AM', 12),
  ('R11', 'Sector 48, Faridabad', '07:50 AM', 13),
  ('R11', 'Sainik Colony Chowk, Faridabad', '07:55 AM', 14),
  ('R11', 'Sainik Colony Chowk, Gate 3, Faridabad', '07:57 AM', 15),
  ('R11', 'Achiever''s Apartment, Faridabad', '08:00 AM', 16),
  ('R11', 'Pali Village, Faridabad', '08:05 AM', 17),
  ('R11', 'G D Goenka Education City', '09:00 AM', 18);

-- SAMPLE STUDENTS
INSERT INTO students (id, name, email, phone, route_id, bus_id, seat_number, fee_paid) VALUES
  ('STU001', 'Arjun Sharma',  'arjun@student.goenka.edu',  '+91 70000 11111', 'R01', 'BUS01', 'A3',  true),
  ('STU002', 'Priya Patel',   'priya@student.goenka.edu',  '+91 70000 22222', 'R01', 'BUS01', 'B2',  true),
  ('STU003', 'Rahul Verma',   'rahul@student.goenka.edu',  '+91 70000 33333', 'R02', 'BUS02', 'A1',  false),
  ('STU004', 'Sneha Gupta',   'sneha@student.goenka.edu',  '+91 70000 44444', 'R03', 'BUS03', 'C2',  true),
  ('STU005', 'Vikram Singh',  'vikram@student.goenka.edu', '+91 70000 55555', 'R04', 'BUS04', 'A5',  true);

-- SAMPLE PROFILES
INSERT INTO profiles (id, name, email, role, phone, bus_id) VALUES
  ('TH001', 'Dr. Rajesh Kumar',    'transport@goenka.edu',           'transport_head', '+91 98765 43210', NULL),
  ('STU001', 'Arjun Sharma',       'arjun@student.goenka.edu',       'student',        '+91 70000 11111', 'BUS01'),
  ('FAC001', 'Prof. Meera Iyer',   'meera@faculty.goenka.edu',       'faculty',        '+91 98765 00001', 'BUS03');

-- SAMPLE COMPLAINTS
INSERT INTO complaints (student_id, student_name, bus_id, category, subject, message, status) VALUES
  ('STU001', 'Arjun Sharma', 'BUS01', 'Driver',    'Rash driving complaint',   'Rash driving near Pitampura junction',  'pending'),
  ('STU002', 'Priya Patel',  'BUS01', 'Seat',      'Broken seat cushion',      'Seat B2 cushion is torn',               'in_progress'),
  ('STU005', 'Vikram Singh', 'BUS04', 'Conductor', 'Unprofessional conductor', 'Conductor refused to stop at my stop',  'resolved');

-- 5. ENABLE REALTIME
begin;
  -- remove the supabase_realtime publication
  drop publication if exists supabase_realtime;
  -- re-create the supabase_realtime publication with no tables
  create publication supabase_realtime;
commit;

-- add tables to the publication
alter publication supabase_realtime add table complaints;
alter publication supabase_realtime add table bus_change_requests;
alter publication supabase_realtime add table industrial_visits;
alter publication supabase_realtime add table drivers;
alter publication supabase_realtime add table seats;

-- 6. VERIFY
SELECT 'routes' AS tbl, count(*) FROM routes
UNION ALL SELECT 'stops', count(*) FROM stops
UNION ALL SELECT 'buses', count(*) FROM buses
UNION ALL SELECT 'drivers', count(*) FROM drivers
UNION ALL SELECT 'students', count(*) FROM students
UNION ALL SELECT 'profiles', count(*) FROM profiles
UNION ALL SELECT 'complaints', count(*) FROM complaints
UNION ALL SELECT 'bus_change_requests', count(*) FROM bus_change_requests
UNION ALL SELECT 'industrial_visits', count(*) FROM industrial_visits
UNION ALL SELECT 'seats', count(*) FROM seats;
