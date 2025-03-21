
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatar?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: User;
  department?: Department; // If undefined, it's for all departments
  important?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  department: Department;
  subject: string;
  author: User;
  attachments?: string[];
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  department: Department;
  subject: string;
  professor: User;
  materials?: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: Department;
  professor: User;
  description: string;
}

export interface CurrentUser {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
