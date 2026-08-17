-- =========================================================
-- CHANDIGARH UNIVERSITY CCS - SUPABASE POSTGRESQL SCHEMA
-- =========================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'teacher', 'student')) NOT NULL,
  name TEXT NOT NULL,
  profile_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Teachers Table
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emp_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department TEXT NOT NULL,
  designation TEXT NOT NULL, -- HOD, ACO, AO, Project Coordinator, etc.
  block_name TEXT NOT NULL,
  block_number TEXT NOT NULL, -- Block A1 to Block D8
  room_number TEXT NOT NULL,
  cabin_number TEXT NOT NULL,
  subjects TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('available', 'in_class', 'in_meeting', 'away')) DEFAULT 'available',
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  semester TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_uid TEXT NOT NULL,
  student_email TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  teacher_cabin TEXT NOT NULL,
  teacher_block TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  subject TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Allow public insert teachers" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update teachers" ON public.teachers FOR UPDATE USING (true);
CREATE POLICY "Allow public select students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Allow public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update appointments" ON public.appointments FOR UPDATE USING (true);
