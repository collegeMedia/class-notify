
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatar?: string;
  enrolledSubjects?: string[]; // IDs of subjects student is enrolled in
  semester?: Semester; // Current semester for student
  teachingSubjects?: string[]; // IDs of subjects the teacher is teaching
  associatedSemesters?: Semester[]; // Semesters the teacher or department admin is associated with
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: User;
  department?: Department; // If undefined, it's for all departments
  important?: boolean;
  semester?: Semester; // Optional semester relevance
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
  semester: Semester; // Which semester this assignment belongs to
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
  semester: Semester; // Which semester this lecture belongs to
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: Department;
  professor: User;
  description: string;
  semester: Semester; // Which semester this subject is offered in
  credits?: number; // Optional credit hours
  prerequisites?: string[]; // Optional list of prerequisite subject codes
}

export interface ChatGroup {
  id: string;
  name: string;
  subjectId: string;
  teacherId: string;
  semester: Semester;
  createdAt: string;
  teacher: User;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  chatGroupId: string;
  createdAt: string;
}

export interface CurrentUser {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
