
export type UserRole = "admin" | "department_admin" | "teacher" | "student";

export type Department = 
  | "Computer Science" 
  | "Electrical Engineering" 
  | "Mechanical Engineering" 
  | "Biology" 
  | "Chemistry" 
  | "Mathematics" 
  | "Physics" 
  | "Business" 
  | "Economics" 
  | "Psychology";

export type Semester = "Fall 2023" | "Spring 2024" | "Summer 2024" | "Fall 2024";

export interface DepartmentModel {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department | string;
  department_id?: string;
  avatar?: string;
  enrolledSubjects?: string[]; // IDs of subjects student is enrolled in
  semester?: Semester; // Current semester for student
  teachingSubjects?: string[]; // IDs of subjects the teacher is teaching
  associatedSemesters?: Semester[]; // Semesters the teacher or department admin is associated with
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  created_at?: string;
  author: User;
  author_id?: string;
  department?: Department | string; // If undefined, it's for all departments
  department_id?: string;
  important?: boolean;
  semester?: Semester; // Optional semester relevance
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  due_date?: string;
  createdAt: string;
  created_at?: string;
  department: Department | string;
  department_id?: string;
  subject: string;
  author: User;
  author_id?: string;
  attachments?: string[];
  semester: Semester | string; // Which semester this assignment belongs to
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  start_time?: string;
  endTime: string;
  end_time?: string;
  location: string;
  department: Department | string;
  department_id?: string;
  subject: string;
  professor: User;
  professor_id?: string;
  materials?: string[];
  semester: Semester | string; // Which semester this lecture belongs to
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: Department | string;
  department_id?: string;
  professor: User;
  professor_id?: string;
  description: string;
  semester: Semester | string; // Which semester this subject is offered in
  credits?: number; // Optional credit hours
  prerequisites?: string[]; // Optional list of prerequisite subject codes
}

export interface ChatGroup {
  id: string;
  name: string;
  subjectId: string;
  subject_id?: string;
  teacherId: string;
  teacher_id?: string;
  semester: Semester;
  createdAt: string;
  created_at?: string;
  teacher: User;
  is_active?: boolean;
  members?: User[];
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  chatGroupId: string;
  chat_group_id?: string;
  createdAt: string;
  created_at?: string;
}

export interface CurrentUser {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
