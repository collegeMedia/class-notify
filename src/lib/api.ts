
import { Announcement, Assignment, Department, Lecture, Semester, Subject, User } from "./types";

const API_URL = "http://localhost:8000";

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "An error occurred");
  }

  return response.json();
}

// User related API calls
export const getUsers = (): Promise<User[]> => {
  return fetchAPI<User[]>("/users/");
};

export const getUserById = (id: string): Promise<User> => {
  return fetchAPI<User>(`/users/${id}`);
};

export const createUser = (user: Omit<User, "id">): Promise<User> => {
  return fetchAPI<User>("/users/", {
    method: "POST",
    body: JSON.stringify(user),
  });
};

// Assignment related API calls
export const getAssignments = (department?: Department, semester?: Semester): Promise<Assignment[]> => {
  let query = "";
  if (department) query += `department=${department}&`;
  if (semester) query += `semester=${semester}`;
  
  return fetchAPI<Assignment[]>(`/assignments/?${query}`);
};

export const getAssignmentById = (id: string): Promise<Assignment> => {
  return fetchAPI<Assignment>(`/assignments/${id}`);
};

export const createAssignment = (assignment: Omit<Assignment, "id" | "createdAt">): Promise<Assignment> => {
  return fetchAPI<Assignment>("/assignments/", {
    method: "POST",
    body: JSON.stringify(assignment),
  });
};

// Lecture related API calls
export const getLectures = (
  department?: Department, 
  semester?: Semester,
  date?: string
): Promise<Lecture[]> => {
  let query = "";
  if (department) query += `department=${department}&`;
  if (semester) query += `semester=${semester}&`;
  if (date) query += `date=${date}`;
  
  return fetchAPI<Lecture[]>(`/lectures/?${query}`);
};

export const getLectureById = (id: string): Promise<Lecture> => {
  return fetchAPI<Lecture>(`/lectures/${id}`);
};

export const createLecture = (lecture: Omit<Lecture, "id">): Promise<Lecture> => {
  return fetchAPI<Lecture>("/lectures/", {
    method: "POST",
    body: JSON.stringify(lecture),
  });
};

// Subject related API calls
export const getSubjects = (department?: Department, semester?: Semester): Promise<Subject[]> => {
  let query = "";
  if (department) query += `department=${department}&`;
  if (semester) query += `semester=${semester}`;
  
  return fetchAPI<Subject[]>(`/subjects/?${query}`);
};

export const getSubjectById = (id: string): Promise<Subject> => {
  return fetchAPI<Subject>(`/subjects/${id}`);
};

export const createSubject = (subject: Omit<Subject, "id">): Promise<Subject> => {
  return fetchAPI<Subject>("/subjects/", {
    method: "POST",
    body: JSON.stringify(subject),
  });
};

// Announcement related API calls
export const getAnnouncements = (department?: Department): Promise<Announcement[]> => {
  let query = department ? `department=${department}` : "";
  
  return fetchAPI<Announcement[]>(`/announcements/?${query}`);
};

export const getAnnouncementById = (id: string): Promise<Announcement> => {
  return fetchAPI<Announcement>(`/announcements/${id}`);
};

export const createAnnouncement = (
  announcement: Omit<Announcement, "id" | "createdAt">
): Promise<Announcement> => {
  return fetchAPI<Announcement>("/announcements/", {
    method: "POST",
    body: JSON.stringify(announcement),
  });
};
