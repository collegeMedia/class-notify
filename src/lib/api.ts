import { Announcement, Assignment, ChatGroup, Department, DepartmentModel, Lecture, Message, Semester, Subject, User } from "./types";
import { getToken } from "./auth";

const API_URL = "http://localhost:8000";

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "An error occurred");
  }

  return response.json();
}

// Auth related API calls
export const getCurrentUser = (): Promise<User> => {
  return fetchAPI<User>("/auth/me");
};

// Department related API calls
export const getDepartments = (): Promise<DepartmentModel[]> => {
  return fetchAPI<DepartmentModel[]>("/departments/");
};

export const getDepartmentById = (id: string): Promise<DepartmentModel> => {
  return fetchAPI<DepartmentModel>(`/departments/${id}`);
};

export const getDepartmentByCode = (code: string): Promise<DepartmentModel> => {
  return fetchAPI<DepartmentModel>(`/departments/code/${code}`);
};

export const createDepartment = (department: {
  name: string;
  code: string;
  description?: string;
}): Promise<DepartmentModel> => {
  return fetchAPI<DepartmentModel>("/departments/", {
    method: "POST",
    body: JSON.stringify(department),
  });
};

// User related API calls
export const getUsers = (): Promise<User[]> => {
  return fetchAPI<User[]>("/users/");
};

export const getUserById = (id: string): Promise<User> => {
  return fetchAPI<User>(`/users/${id}`);
};

export const createUser = (user: Omit<User, "id" | "created_at">): Promise<User> => {
  const payload = {
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    department_id: user.department_id,
    avatar: user.avatar,
    semester: user.semester,
  };
  
  return fetchAPI<User>("/users/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Announcement related API calls
export const getAnnouncements = (department?: Department | string, semester?: Semester): Promise<Announcement[]> => {
  let query = "";
  if (department) query += `department=${department}&`;
  if (semester) query += `semester=${semester}`;
  
  return fetchAPI<Announcement[]>(`/announcements/?${query}`);
};

export const getAnnouncementById = (id: string): Promise<Announcement> => {
  return fetchAPI<Announcement>(`/announcements/${id}`);
};

export const createAnnouncement = (announcement: Omit<Announcement, "id" | "createdAt" | "created_at">): Promise<Announcement> => {
  let departmentValue: string | undefined;
  if (typeof announcement.department === 'string') {
    departmentValue = announcement.department;
  } else if (announcement.department && typeof announcement.department === 'object') {
    departmentValue = (announcement.department as any).code;
  }
  
  const payload = {
    title: announcement.title,
    content: announcement.content,
    department: departmentValue,
    department_id: announcement.department_id,
    author_id: announcement.author?.id || announcement.author_id,
    important: announcement.important || false,
    semester: announcement.semester,
  };
  
  return fetchAPI<Announcement>("/announcements/", {
    method: "POST",
    body: JSON.stringify(payload),
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

export const createAssignment = (assignment: Omit<Assignment, "id" | "createdAt" | "created_at">): Promise<Assignment> => {
  const payload = {
    title: assignment.title,
    description: assignment.description,
    due_date: assignment.dueDate || assignment.due_date,
    department: assignment.department,
    department_id: assignment.department_id,
    subject: assignment.subject,
    author_id: assignment.author.id || assignment.author_id,
    attachments: assignment.attachments?.join(",") || null,
    semester: assignment.semester,
  };
  
  return fetchAPI<Assignment>("/assignments/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateAssignment = (id: string, assignment: Omit<Assignment, "id" | "createdAt" | "created_at">): Promise<Assignment> => {
  const payload = {
    title: assignment.title,
    description: assignment.description,
    due_date: assignment.dueDate || assignment.due_date,
    department: assignment.department,
    department_id: assignment.department_id,
    subject: assignment.subject,
    author_id: assignment.author.id || assignment.author_id,
    attachments: assignment.attachments?.join(",") || null,
    semester: assignment.semester,
  };
  
  return fetchAPI<Assignment>(`/assignments/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteAssignment = (id: string): Promise<{message: string}> => {
  return fetchAPI<{message: string}>(`/assignments/${id}`, {
    method: "DELETE",
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
  const payload = {
    title: lecture.title,
    description: lecture.description,
    date: lecture.date,
    start_time: lecture.startTime || lecture.start_time,
    end_time: lecture.endTime || lecture.end_time,
    location: lecture.location,
    department: lecture.department,
    department_id: lecture.department_id,
    subject: lecture.subject,
    professor_id: lecture.professor.id || lecture.professor_id,
    materials: lecture.materials?.join(",") || null,
    semester: lecture.semester,
  };
  
  return fetchAPI<Lecture>("/lectures/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateLecture = (id: string, lecture: Omit<Lecture, "id">): Promise<Lecture> => {
  const payload = {
    title: lecture.title,
    description: lecture.description,
    date: lecture.date,
    start_time: lecture.startTime || lecture.start_time,
    end_time: lecture.endTime || lecture.end_time,
    location: lecture.location,
    department: lecture.department,
    department_id: lecture.department_id,
    subject: lecture.subject,
    professor_id: lecture.professor.id || lecture.professor_id,
    materials: lecture.materials?.join(",") || null,
    semester: lecture.semester,
  };
  
  return fetchAPI<Lecture>(`/lectures/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteLecture = (id: string): Promise<{message: string}> => {
  return fetchAPI<{message: string}>(`/lectures/${id}`, {
    method: "DELETE",
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

export const getSubjectsByProfessor = (professorId: string): Promise<Subject[]> => {
  return fetchAPI<Subject[]>(`/subjects/professor/${professorId}`);
};

export const createSubject = (subject: Omit<Subject, "id">): Promise<Subject> => {
  const payload = {
    name: subject.name,
    code: subject.code,
    department: subject.department,
    department_id: subject.department_id,
    professor_id: subject.professor.id || subject.professor_id,
    description: subject.description,
    semester: subject.semester,
    credits: subject.credits,
    prerequisites: subject.prerequisites?.join(",") || null,
  };
  
  return fetchAPI<Subject>("/subjects/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ChatGroup related API calls
export const getChatGroupsForTeacher = (teacherId: string): Promise<ChatGroup[]> => {
  return fetchAPI<ChatGroup[]>(`/chat-groups/teacher/${teacherId}`);
};

export const getChatGroupsForStudent = (studentId: string): Promise<ChatGroup[]> => {
  return fetchAPI<ChatGroup[]>(`/chat-groups/student/${studentId}`);
};

export const getChatGroupById = (id: string): Promise<ChatGroup> => {
  return fetchAPI<ChatGroup>(`/chat-groups/${id}`);
};

export const createChatGroup = (chatGroup: {
  name: string;
  subject_id: string;
  teacher_id: string;
  semester: Semester;
}): Promise<ChatGroup> => {
  return fetchAPI<ChatGroup>("/chat-groups/", {
    method: "POST",
    body: JSON.stringify(chatGroup),
  });
};

// Message related API calls
export const getMessages = (chatGroupId: string): Promise<Message[]> => {
  return fetchAPI<Message[]>(`/messages/${chatGroupId}`);
};

export const createMessage = (message: {
  content: string;
  sender_id: string;
  chat_group_id: string;
}): Promise<Message> => {
  return fetchAPI<Message>("/messages/", {
    method: "POST",
    body: JSON.stringify(message),
  });
};
