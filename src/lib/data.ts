
import { User, UserRole, Department, Semester } from "./types";

// Mock data for the application

// Available semesters in the system
export const semesters: Semester[] = [
  "Fall 2023",
  "Spring 2024",
  "Summer 2024",
  "Fall 2024"
];

// Available departments in the system (legacy - use useDepartments hook for API data)
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

// Map department codes to names for backward compatibility
export const departmentCodeToName: Record<string, string> = {
  "CS": "Computer Science",
  "EE": "Electrical Engineering",
  "ME": "Mechanical Engineering",
  "BIO": "Biology",
  "CHEM": "Chemistry",
  "MATH": "Mathematics",
  "PHY": "Physics",
  "BUS": "Business",
  "ECON": "Economics",
  "PSY": "Psychology",
};

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

// Mock users data (legacy - use API for real data)
export const users = [
  {
    id: "4e428279-d098-491b-8a13-dfa29a93cff1",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student" as UserRole,
    department: "CS",
    avatar: undefined,
    semester: "Spring 2026" as Semester
  },
  {
    id: "c016bac3-5f1f-4677-99b8-06fe6b63d38d",
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    role: "professor" as UserRole,
    department: "CS",
    avatar: undefined,
    associatedSemesters: ["Spring 2026", "Fall 2025"] as Semester[]
  },
  {
    id: "3fb6cb18-7671-45ff-8ca5-865d2fa8d698",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin" as UserRole,
    department: "CS",
    avatar: undefined
  }
];

// dummy (simulated) current user object 
export let currentUser: User = {
  id: "4e428279-d098-491b-8a13-dfa29a93cff1",
  name: "John Doe",
  email: "john.doe@university.edu",
  role: "student",
  department: "CS",
  department_id: "d903cce6-a342-432e-a479-c933ced224d4",
  avatar: undefined,
  semester: "Spring 2026",
  is_active: true,
  created_at: "2026-02-23T18:33:28.069907",
  createdAt: "2026-02-23T18:33:28.069907"
};

export function setCurrentUser(user: User) {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function loadCurrentUser(): User | null {
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      currentUser = user;
      return user;
    } catch {
      return null;
    }
  }
  return null;
}

export function logoutCurrentUser() {
  localStorage.removeItem("currentUser");
  currentUser = {} as User;
}
