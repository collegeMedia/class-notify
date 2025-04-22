
import { User, UserRole, Department, Semester } from "./types";

// Mock data for the application

// Available semesters in the system
export const semesters: Semester[] = [
  "Fall 2023",
  "Spring 2024",
  "Summer 2024",
  "Fall 2024"
];

// Available departments in the system
export const departments: Department[] = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering", 
  "Biology",
  "Chemistry", 
  "Mathematics",
  "Physics",
  "Business",
  "Economics",
  "Psychology"
];

// Mock subjects data
export const subjects = [
  {
    id: "cs101",
    name: "Introduction to Programming",
    code: "CS101",
    department: "Computer Science",
    professor: {
      id: "prof1",
      name: "Dr. Smith",
      email: "smith@university.edu",
      role: "teacher" as UserRole,
      department: "Computer Science"
    },
    description: "Basic programming concepts using Python",
    semester: "Spring 2024",
    credits: 3
  },
  {
    id: "cs202",
    name: "Data Structures",
    code: "CS202",
    department: "Computer Science",
    professor: {
      id: "prof2",
      name: "Dr. Johnson",
      email: "johnson@university.edu",
      role: "teacher" as UserRole,
      department: "Computer Science"
    },
    description: "Advanced data structures and algorithms",
    semester: "Spring 2024",
    credits: 4
  },
  {
    id: "ee101",
    name: "Circuit Theory",
    code: "EE101",
    department: "Electrical Engineering",
    professor: {
      id: "prof3",
      name: "Dr. Williams",
      email: "williams@university.edu",
      role: "teacher" as UserRole,
      department: "Electrical Engineering"
    },
    description: "Basic electrical circuit analysis and design",
    semester: "Spring 2024",
    credits: 3
  }
];

// Mock users data
export const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student" as UserRole,
    department: "Computer Science",
    avatar: undefined,
    semester: "Spring 2024" as Semester
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    role: "teacher" as UserRole,
    department: "Computer Science",
    avatar: undefined,
    associatedSemesters: ["Spring 2024", "Fall 2024"] as Semester[]
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin" as UserRole,
    department: "Computer Science",
    avatar: undefined
  }
];

// dummy (simulated) current user object 
export let currentUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@university.edu",
  role: "student",
  department: "Computer Science",
  avatar: undefined,
  semester: "Spring 2024"
};

export function setCurrentUser(user: User) {
  currentUser = user;
}

export function logoutCurrentUser() {
  // You could preserve guest properties if needed.
  currentUser = {} as User;
}
