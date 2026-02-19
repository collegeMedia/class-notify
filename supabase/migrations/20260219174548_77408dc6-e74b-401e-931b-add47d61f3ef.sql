
-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'department_admin', 'teacher', 'student');
CREATE TYPE public.department_type AS ENUM (
  'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
  'Biology', 'Chemistry', 'Mathematics', 'Physics', 'Business', 'Economics', 'Psychology'
);
CREATE TYPE public.semester_type AS ENUM ('Fall 2023', 'Spring 2024', 'Summer 2024', 'Fall 2024');

-- Profiles table (extends auth users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  department department_type,
  avatar TEXT,
  semester semester_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (for secure role checking)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  department department_type NOT NULL,
  professor_id UUID REFERENCES public.profiles(id),
  description TEXT,
  semester semester_type NOT NULL,
  credits INTEGER DEFAULT 3,
  prerequisites TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  department department_type,
  important BOOLEAN DEFAULT false,
  semester semester_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT NOT NULL,
  department department_type NOT NULL,
  subject TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  attachments TEXT[],
  semester semester_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lectures table
CREATE TABLE public.lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  department department_type NOT NULL,
  subject TEXT NOT NULL,
  professor_id UUID REFERENCES public.profiles(id),
  materials TEXT[],
  semester semester_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat groups table
CREATE TABLE public.chat_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id),
  teacher_id UUID REFERENCES public.profiles(id),
  semester semester_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id),
  chat_group_id UUID REFERENCES public.chat_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles RLS
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Subjects RLS
CREATE POLICY "Everyone can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and admins can insert subjects" ON public.subjects FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'department_admin')
);
CREATE POLICY "Teachers and admins can update subjects" ON public.subjects FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'department_admin')
);

-- Announcements RLS
CREATE POLICY "Everyone can view announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and admins can insert announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'department_admin')
);
CREATE POLICY "Authors and admins can update announcements" ON public.announcements FOR UPDATE TO authenticated USING (
  auth.uid() = author_id OR public.has_role(auth.uid(), 'admin')
);

-- Assignments RLS
CREATE POLICY "Everyone can view assignments" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and admins can insert assignments" ON public.assignments FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'department_admin')
);
CREATE POLICY "Authors and admins can update assignments" ON public.assignments FOR UPDATE TO authenticated USING (
  auth.uid() = author_id OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Authors and admins can delete assignments" ON public.assignments FOR DELETE TO authenticated USING (
  auth.uid() = author_id OR public.has_role(auth.uid(), 'admin')
);

-- Lectures RLS
CREATE POLICY "Everyone can view lectures" ON public.lectures FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and admins can insert lectures" ON public.lectures FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'department_admin')
);
CREATE POLICY "Professors and admins can update lectures" ON public.lectures FOR UPDATE TO authenticated USING (
  auth.uid() = professor_id OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Professors and admins can delete lectures" ON public.lectures FOR DELETE TO authenticated USING (
  auth.uid() = professor_id OR public.has_role(auth.uid(), 'admin')
);

-- Chat groups RLS
CREATE POLICY "Everyone can view chat groups" ON public.chat_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers and admins can create chat groups" ON public.chat_groups FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')
);

-- Messages RLS
CREATE POLICY "Authenticated users can view messages" ON public.messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Auto-update updated_at for profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
