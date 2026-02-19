import { supabase } from "@/integrations/supabase/client";
import { Announcement, Assignment, ChatGroup, Department, Lecture, Message, Semester, Subject, User } from "./types";

// ─── Helper: map DB row → User ──────────────────────────────────────────────
function mapProfile(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department,
    avatar: row.avatar ?? undefined,
    semester: row.semester ?? undefined,
  };
}

// ─── Users ──────────────────────────────────────────────────────────────────
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProfile);
};

export const getUserById = async (id: string): Promise<User> => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return mapProfile(data);
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { data, error } = await supabase.from("profiles").insert([user as any]).select().single();
  if (error) throw new Error(error.message);
  return mapProfile(data);
};

// ─── Announcements ──────────────────────────────────────────────────────────
export const getAnnouncements = async (department?: Department): Promise<Announcement[]> => {
  let query = supabase
    .from("announcements")
    .select("*, author:profiles!announcements_author_id_fkey(*)")
    .order("created_at", { ascending: false });

  if (department) {
    query = query.or(`department.eq.${department},department.is.null`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    author: mapProfile(row.author),
    department: row.department ?? undefined,
    important: row.important ?? false,
    semester: row.semester ?? undefined,
  }));
};

export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*, author:profiles!announcements_author_id_fkey(*)")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
    author: mapProfile(data.author),
    department: data.department ?? undefined,
    important: data.important ?? false,
    semester: data.semester ?? undefined,
  };
};

export const createAnnouncement = async (announcement: {
  title: string;
  content: string;
  author_id: string;
  department?: string | null;
  important?: boolean;
  semester?: string | null;
}): Promise<Announcement> => {
  const { data, error } = await supabase
    .from("announcements")
    .insert([announcement as any])
    .select("*, author:profiles!announcements_author_id_fkey(*)")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
    author: mapProfile(data.author),
    department: data.department ?? undefined,
    important: data.important ?? false,
    semester: data.semester ?? undefined,
  };
};

// ─── Assignments ─────────────────────────────────────────────────────────────
export const getAssignments = async (department?: Department, semester?: Semester): Promise<Assignment[]> => {
  let query = supabase
    .from("assignments")
    .select("*, author:profiles!assignments_author_id_fkey(*)")
    .order("created_at", { ascending: false });

  if (department) query = query.eq("department", department);
  if (semester) query = query.eq("semester", semester);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    createdAt: row.created_at,
    department: row.department,
    subject: row.subject,
    author: mapProfile(row.author),
    attachments: row.attachments ?? [],
    semester: row.semester,
  }));
};

export const getAssignmentById = async (id: string): Promise<Assignment> => {
  const { data, error } = await supabase
    .from("assignments")
    .select("*, author:profiles!assignments_author_id_fkey(*)")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    dueDate: data.due_date,
    createdAt: data.created_at,
    department: data.department,
    subject: data.subject,
    author: mapProfile(data.author),
    attachments: data.attachments ?? [],
    semester: data.semester,
  };
};

export const createAssignment = async (assignment: {
  title: string;
  description: string;
  due_date: string;
  department: string;
  subject: string;
  author_id: string;
  attachments?: string[];
  semester: string;
}): Promise<Assignment> => {
  const { data, error } = await supabase
    .from("assignments")
    .insert([assignment as any])
    .select("*, author:profiles!assignments_author_id_fkey(*)")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    dueDate: data.due_date,
    createdAt: data.created_at,
    department: data.department,
    subject: data.subject,
    author: mapProfile(data.author),
    attachments: data.attachments ?? [],
    semester: data.semester,
  };
};

// ─── Lectures ────────────────────────────────────────────────────────────────
export const getLectures = async (department?: Department, semester?: Semester, date?: string): Promise<Lecture[]> => {
  let query = supabase
    .from("lectures")
    .select("*, professor:profiles!lectures_professor_id_fkey(*)")
    .order("date", { ascending: true });

  if (department) query = query.eq("department", department);
  if (semester) query = query.eq("semester", semester);
  if (date) query = query.eq("date", date);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location,
    department: row.department,
    subject: row.subject,
    professor: mapProfile(row.professor),
    materials: row.materials ?? [],
    semester: row.semester,
  }));
};

export const getLectureById = async (id: string): Promise<Lecture> => {
  const { data, error } = await supabase
    .from("lectures")
    .select("*, professor:profiles!lectures_professor_id_fkey(*)")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    startTime: data.start_time,
    endTime: data.end_time,
    location: data.location,
    department: data.department,
    subject: data.subject,
    professor: mapProfile(data.professor),
    materials: data.materials ?? [],
    semester: data.semester,
  };
};

export const createLecture = async (lecture: {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  department: string;
  subject: string;
  professor_id: string;
  materials?: string[];
  semester: string;
}): Promise<Lecture> => {
  const { data, error } = await supabase
    .from("lectures")
    .insert([lecture as any])
    .select("*, professor:profiles!lectures_professor_id_fkey(*)")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    startTime: data.start_time,
    endTime: data.end_time,
    location: data.location,
    department: data.department,
    subject: data.subject,
    professor: mapProfile(data.professor),
    materials: data.materials ?? [],
    semester: data.semester,
  };
};

// ─── Subjects ────────────────────────────────────────────────────────────────
export const getSubjects = async (department?: Department, semester?: Semester): Promise<Subject[]> => {
  let query = supabase
    .from("subjects")
    .select("*, professor:profiles!subjects_professor_id_fkey(*)");

  if (department) query = query.eq("department", department);
  if (semester) query = query.eq("semester", semester);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    code: row.code,
    department: row.department,
    professor: mapProfile(row.professor),
    description: row.description ?? "",
    semester: row.semester,
    credits: row.credits ?? undefined,
    prerequisites: row.prerequisites ?? undefined,
  }));
};

export const getSubjectById = async (id: string): Promise<Subject> => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*, professor:profiles!subjects_professor_id_fkey(*)")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    name: data.name,
    code: data.code,
    department: data.department,
    professor: mapProfile(data.professor),
    description: data.description ?? "",
    semester: data.semester,
    credits: data.credits ?? undefined,
    prerequisites: data.prerequisites ?? undefined,
  };
};

export const createSubject = async (subject: {
  name: string;
  code: string;
  department: string;
  professor_id: string;
  description?: string;
  semester: string;
  credits?: number;
  prerequisites?: string[];
}): Promise<Subject> => {
  const { data, error } = await supabase
    .from("subjects")
    .insert([subject as any])
    .select("*, professor:profiles!subjects_professor_id_fkey(*)")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    name: data.name,
    code: data.code,
    department: data.department,
    professor: mapProfile(data.professor),
    description: data.description ?? "",
    semester: data.semester,
    credits: data.credits ?? undefined,
    prerequisites: data.prerequisites ?? undefined,
  };
};

// ─── Chat Groups ─────────────────────────────────────────────────────────────
function mapChatGroup(row: any): ChatGroup {
  return {
    id: row.id,
    name: row.name,
    subjectId: row.subject_id,
    teacherId: row.teacher_id,
    semester: row.semester,
    createdAt: row.created_at,
    teacher: mapProfile(row.teacher),
  };
}

export const getChatGroupsForTeacher = async (teacherId: string): Promise<ChatGroup[]> => {
  const { data, error } = await supabase
    .from("chat_groups")
    .select("*, teacher:profiles!chat_groups_teacher_id_fkey(*)")
    .eq("teacher_id", teacherId);
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapChatGroup);
};

export const getChatGroupsForStudent = async (studentId: string): Promise<ChatGroup[]> => {
  // Get student profile to find their department and semester
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", studentId)
    .single();
  if (profileError) throw new Error(profileError.message);

  const { data, error } = await supabase
    .from("chat_groups")
    .select("*, teacher:profiles!chat_groups_teacher_id_fkey(*), subject:subjects!chat_groups_subject_id_fkey(*)")
    .eq("semester", profile.semester);
  if (error) throw new Error(error.message);

  // Filter by department via subject
  const filtered = (data ?? []).filter((g: any) => g.subject?.department === profile.department);
  return filtered.map(mapChatGroup);
};

export const getChatGroupById = async (id: string): Promise<ChatGroup> => {
  const { data, error } = await supabase
    .from("chat_groups")
    .select("*, teacher:profiles!chat_groups_teacher_id_fkey(*)")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return mapChatGroup(data);
};

export const createChatGroup = async (chatGroup: {
  name: string;
  subject_id: string;
  teacher_id: string;
  semester: Semester;
}): Promise<ChatGroup> => {
  const { data, error } = await supabase
    .from("chat_groups")
    .insert([chatGroup])
    .select("*, teacher:profiles!chat_groups_teacher_id_fkey(*)")
    .single();
  if (error) throw new Error(error.message);
  return mapChatGroup(data);
};

// ─── Messages ────────────────────────────────────────────────────────────────
export const getMessages = async (chatGroupId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(*)")
    .eq("chat_group_id", chatGroupId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    content: row.content,
    sender: mapProfile(row.sender),
    chatGroupId: row.chat_group_id,
    createdAt: row.created_at,
  }));
};

export const createMessage = async (message: {
  content: string;
  sender_id: string;
  chat_group_id: string;
}): Promise<Message> => {
  const { data, error } = await supabase
    .from("messages")
    .insert([message])
    .select("*, sender:profiles!messages_sender_id_fkey(*)")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    content: data.content,
    sender: mapProfile(data.sender),
    chatGroupId: data.chat_group_id,
    createdAt: data.created_at,
  };
};
