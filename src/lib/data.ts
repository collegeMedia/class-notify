import { Announcement, Assignment, Department, Lecture, Semester, Subject, User } from "./types";

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

export const semesters: Semester[] = [
  "Fall 2023",
  "Spring 2024",
  "Summer 2024",
  "Fall 2024"
];

export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    department: "Computer Science",
    avatar: "https://i.pravatar.cc/150?img=68"
  },
  {
    id: "2",
    name: "CS Department Head",
    email: "cshead@university.edu",
    role: "department_admin",
    department: "Computer Science",
    avatar: "https://i.pravatar.cc/150?img=33",
    associatedSemesters: ["Fall 2023", "Spring 2024", "Summer 2024", "Fall 2024"]
  },
  {
    id: "3",
    name: "Dr. Sarah Johnson",
    email: "sjohnson@university.edu",
    role: "teacher",
    department: "Computer Science",
    avatar: "https://i.pravatar.cc/150?img=10",
    teachingSubjects: ["1", "4", "6"],
    associatedSemesters: ["Fall 2023", "Spring 2024"]
  },
  {
    id: "4",
    name: "Prof. Michael Chen",
    email: "mchen@university.edu",
    role: "teacher",
    department: "Computer Science",
    avatar: "https://i.pravatar.cc/150?img=12",
    teachingSubjects: ["2", "7", "8"],
    associatedSemesters: ["Fall 2023", "Spring 2024", "Summer 2024"]
  },
  {
    id: "5",
    name: "EE Department Head",
    email: "eehead@university.edu",
    role: "department_admin",
    department: "Electrical Engineering",
    avatar: "https://i.pravatar.cc/150?img=15",
    associatedSemesters: ["Fall 2023", "Spring 2024", "Summer 2024", "Fall 2024"]
  },
  {
    id: "6",
    name: "Dr. Emily Rodriguez",
    email: "erodriguez@university.edu",
    role: "teacher",
    department: "Electrical Engineering",
    avatar: "https://i.pravatar.cc/150?img=5",
    teachingSubjects: ["3", "5", "9"],
    associatedSemesters: ["Fall 2023", "Spring 2024"]
  },
  {
    id: "7",
    name: "John Smith",
    email: "jsmith@university.edu",
    role: "student",
    department: "Computer Science",
    avatar: "https://i.pravatar.cc/150?img=3",
    semester: "Spring 2024",
    enrolledSubjects: ["1", "2", "4", "6"]
  },
  {
    id: "8",
    name: "Lisa Wang",
    email: "lwang@university.edu",
    role: "student",
    department: "Electrical Engineering",
    avatar: "https://i.pravatar.cc/150?img=9",
    semester: "Spring 2024",
    enrolledSubjects: ["3", "5"]
  }
];

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "Campus Closed for Maintenance",
    content: "The campus will be closed this weekend for scheduled maintenance. All buildings will be inaccessible from Friday 6PM to Monday 6AM.",
    createdAt: "2023-11-15T09:00:00Z",
    author: users[0],
    important: true
  },
  {
    id: "2",
    title: "CS Department Meeting",
    content: "There will be a department meeting for all Computer Science faculty on Wednesday at 2PM in Room 301.",
    createdAt: "2023-11-14T14:30:00Z",
    author: users[1],
    department: "Computer Science"
  },
  {
    id: "3",
    title: "New Computer Lab Equipment",
    content: "The Computer Science department has received new equipment for the computer lab. Students can now access the new workstations starting next week.",
    createdAt: "2023-11-13T11:15:00Z",
    author: users[1],
    department: "Computer Science"
  },
  {
    id: "4",
    title: "EE Workshop",
    content: "The Electrical Engineering department is hosting a workshop on circuit design. All interested students are welcome to attend.",
    createdAt: "2023-11-12T16:45:00Z",
    author: users[4],
    department: "Electrical Engineering"
  },
  {
    id: "5",
    title: "Scholarship Applications Open",
    content: "Applications for the Merit Scholarship are now open. Deadline is December 15th. Visit the financial aid office for more information.",
    createdAt: "2023-11-11T10:30:00Z",
    author: users[0]
  },
  {
    id: "6",
    title: "Guest Lecture: AI Ethics",
    content: "We are pleased to announce a guest lecture on AI Ethics by Dr. Jane Smith from Tech University on Friday at 3PM in the Main Auditorium.",
    createdAt: "2023-11-10T13:20:00Z",
    author: users[2],
    department: "Computer Science"
  },
  {
    id: "7",
    title: "Library Hours Extended During Finals",
    content: "The university library will extend its hours during finals week, remaining open 24/7 from December 1st to December 15th.",
    createdAt: "2023-11-09T15:10:00Z",
    author: users[0]
  },
  {
    id: "8",
    title: "Career Fair Next Month",
    content: "The annual career fair will be held next month on the 10th. Over 50 companies will be in attendance. Don't miss this opportunity to network and find internships.",
    createdAt: "2023-11-08T09:45:00Z",
    author: users[0]
  }
];

export const assignments: Assignment[] = [
  {
    id: "1",
    title: "Algorithm Analysis",
    description: "Analyze the time complexity of the provided algorithms and submit a report.",
    dueDate: "2023-12-01T23:59:59Z",
    createdAt: "2023-11-15T10:00:00Z",
    department: "Computer Science",
    subject: "Data Structures and Algorithms",
    author: users[2],
    attachments: ["algorithm_problems.pdf"],
    semester: "Fall 2023"
  },
  {
    id: "2",
    title: "Database Project",
    description: "Design a database schema for a library management system and implement it using PostgreSQL.",
    dueDate: "2023-12-10T23:59:59Z",
    createdAt: "2023-11-14T14:00:00Z",
    department: "Computer Science",
    subject: "Database Management",
    author: users[3],
    attachments: ["project_requirements.pdf", "sample_data.csv"],
    semester: "Fall 2023"
  },
  {
    id: "3",
    title: "Circuit Design Lab",
    description: "Design and simulate a basic amplifier circuit using the techniques discussed in class.",
    dueDate: "2023-11-25T23:59:59Z",
    createdAt: "2023-11-13T09:30:00Z",
    department: "Electrical Engineering",
    subject: "Analog Electronics",
    author: users[5],
    attachments: ["lab_instructions.pdf"],
    semester: "Fall 2023"
  },
  {
    id: "4",
    title: "Operating Systems Research Paper",
    description: "Write a research paper on a modern operating system of your choice. Focus on memory management and process scheduling.",
    dueDate: "2023-12-15T23:59:59Z",
    createdAt: "2023-11-12T11:45:00Z",
    department: "Computer Science",
    subject: "Operating Systems",
    author: users[2],
    attachments: ["research_paper_guidelines.pdf"],
    semester: "Fall 2023"
  },
  {
    id: "5",
    title: "Signal Processing Mini-Project",
    description: "Implement a basic signal processing algorithm in MATLAB and analyze its performance.",
    dueDate: "2023-11-30T23:59:59Z",
    createdAt: "2023-11-11T15:20:00Z",
    department: "Electrical Engineering",
    subject: "Digital Signal Processing",
    author: users[5],
    attachments: ["project_description.pdf"],
    semester: "Fall 2023"
  },
  {
    id: "6",
    title: "Machine Learning Assignment",
    description: "Implement a simple neural network for image classification using TensorFlow.",
    dueDate: "2024-04-15T23:59:59Z",
    createdAt: "2024-03-20T10:00:00Z",
    department: "Computer Science",
    subject: "Artificial Intelligence",
    author: users[2],
    attachments: ["ml_assignment.pdf", "dataset.zip"],
    semester: "Spring 2024"
  },
  {
    id: "7",
    title: "Database Optimization Project",
    description: "Analyze and optimize query performance for the provided database schema.",
    dueDate: "2024-04-20T23:59:59Z",
    createdAt: "2024-03-25T14:30:00Z",
    department: "Computer Science",
    subject: "Database Management",
    author: users[3],
    attachments: ["db_optimization_specs.pdf"],
    semester: "Spring 2024"
  }
];

export const lectures: Lecture[] = [
  {
    id: "1",
    title: "Introduction to Neural Networks",
    description: "This lecture covers the basics of neural networks and their applications in machine learning.",
    date: "2023-11-16",
    startTime: "10:00",
    endTime: "11:30",
    location: "Room 302",
    department: "Computer Science",
    subject: "Artificial Intelligence",
    professor: users[2],
    materials: ["slides_neural_networks.pdf", "notebook_examples.ipynb"],
    semester: "Fall 2023"
  },
  {
    id: "2",
    title: "Database Normalization",
    description: "We'll discuss the principles of database normalization and how to apply them in practical database design.",
    date: "2023-11-16",
    startTime: "13:00",
    endTime: "14:30",
    location: "Room 201",
    department: "Computer Science",
    subject: "Database Management",
    professor: users[3],
    materials: ["normalization_slides.pdf", "practice_problems.pdf"],
    semester: "Fall 2023"
  },
  {
    id: "3",
    title: "Transistor Biasing",
    description: "This lecture covers different biasing techniques for transistors and their analysis.",
    date: "2023-11-16",
    startTime: "09:00",
    endTime: "10:30",
    location: "Room 405",
    department: "Electrical Engineering",
    subject: "Analog Electronics",
    professor: users[5],
    materials: ["transistor_biasing_notes.pdf"],
    semester: "Fall 2023"
  },
  {
    id: "4",
    title: "Process Synchronization",
    description: "This lecture discusses the various mechanisms for process synchronization in operating systems.",
    date: "2023-11-17",
    startTime: "11:00",
    endTime: "12:30",
    location: "Room 301",
    department: "Computer Science",
    subject: "Operating Systems",
    professor: users[2],
    materials: ["synchronization_slides.pdf"],
    semester: "Fall 2023"
  },
  {
    id: "5",
    title: "Sampling Theorem",
    description: "We'll cover the Nyquist-Shannon sampling theorem and its importance in digital signal processing.",
    date: "2023-11-17",
    startTime: "14:00",
    endTime: "15:30",
    location: "Room 403",
    department: "Electrical Engineering",
    subject: "Digital Signal Processing",
    professor: users[5],
    materials: ["sampling_theorem_notes.pdf", "matlab_examples.zip"],
    semester: "Fall 2023"
  },
  {
    id: "6",
    title: "Advanced Neural Networks",
    description: "This lecture covers advanced neural network architectures including CNNs and RNNs.",
    date: new Date().toISOString().split('T')[0], // Today's date
    startTime: "13:00",
    endTime: "14:30",
    location: "Room 302",
    department: "Computer Science",
    subject: "Artificial Intelligence",
    professor: users[2],
    materials: ["advanced_nn_slides.pdf"],
    semester: "Spring 2024"
  },
  {
    id: "7",
    title: "Query Optimization",
    description: "Techniques for optimizing database queries and understanding database execution plans.",
    date: new Date().toISOString().split('T')[0], // Today's date
    startTime: "15:00",
    endTime: "16:30",
    location: "Room 201",
    department: "Computer Science",
    subject: "Database Management",
    professor: users[3],
    materials: ["query_optimization.pdf"],
    semester: "Spring 2024"
  }
];

export const subjects: Subject[] = [
  {
    id: "1",
    name: "Data Structures and Algorithms",
    code: "CS301",
    department: "Computer Science",
    professor: users[2],
    description: "This course covers fundamental data structures and algorithmic techniques used in software development.",
    semester: "Fall 2023",
    credits: 4,
    prerequisites: []
  },
  {
    id: "2",
    name: "Database Management",
    code: "CS305",
    department: "Computer Science",
    professor: users[3],
    description: "An introduction to database systems, design principles, and query languages.",
    semester: "Fall 2023",
    credits: 3,
    prerequisites: []
  },
  {
    id: "3",
    name: "Analog Electronics",
    code: "EE201",
    department: "Electrical Engineering",
    professor: users[5],
    description: "This course covers the analysis and design of analog electronic circuits.",
    semester: "Fall 2023",
    credits: 4,
    prerequisites: []
  },
  {
    id: "4",
    name: "Operating Systems",
    code: "CS310",
    department: "Computer Science",
    professor: users[2],
    description: "Principles of operating systems, including process management, memory management, and file systems.",
    semester: "Fall 2023",
    credits: 3,
    prerequisites: ["CS301"]
  },
  {
    id: "5",
    name: "Digital Signal Processing",
    code: "EE305",
    department: "Electrical Engineering",
    professor: users[5],
    description: "Introduction to digital signal processing techniques, filters, and applications.",
    semester: "Fall 2023",
    credits: 3,
    prerequisites: ["EE201"]
  },
  {
    id: "6",
    name: "Artificial Intelligence",
    code: "CS401",
    department: "Computer Science",
    professor: users[2],
    description: "This course introduces the principles and techniques of artificial intelligence.",
    semester: "Spring 2024",
    credits: 4,
    prerequisites: ["CS301"]
  },
  {
    id: "7",
    name: "Advanced Database Systems",
    code: "CS405",
    department: "Computer Science",
    professor: users[3],
    description: "This course covers advanced database concepts including distributed databases and NoSQL.",
    semester: "Spring 2024",
    credits: 3,
    prerequisites: ["CS305"]
  },
  {
    id: "8",
    name: "Computer Networks",
    code: "CS315",
    department: "Computer Science",
    professor: users[3],
    description: "Introduction to computer networking principles, protocols, and architectures.",
    semester: "Spring 2024",
    credits: 3,
    prerequisites: []
  },
  {
    id: "9",
    name: "Digital Circuit Design",
    code: "EE210",
    department: "Electrical Engineering",
    professor: users[5],
    description: "Fundamentals of digital circuit design including combinational and sequential logic.",
    semester: "Spring 2024",
    credits: 4,
    prerequisites: ["EE201"]
  }
];

export const currentUser: User = {
  ...users[6], // Student in Computer Science department
};

export const getAnnouncementsForDepartment = (department: Department): Announcement[] => {
  return announcements
    .filter(announcement => !announcement.department || announcement.department === department)
    .sort((a, b) => {
      // First sort by department specificity (department-specific first)
      if (a.department === department && !b.department) return -1;
      if (!a.department && b.department === department) return 1;
      
      // Then sort by importance
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      
      // Finally sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

export const getAssignmentsForDepartment = (department: Department, semester?: Semester): Assignment[] => {
  let filtered = assignments.filter(assignment => assignment.department === department);
  
  if (semester) {
    filtered = filtered.filter(assignment => assignment.semester === semester);
  }
  
  return filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

export const getTodayLectures = (department: Department, semester?: Semester): Lecture[] => {
  const today = new Date().toISOString().split('T')[0];
  let filtered = lectures.filter(
    lecture => lecture.department === department && lecture.date === today
  );
  
  if (semester) {
    filtered = filtered.filter(lecture => lecture.semester === semester);
  }
  
  return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
};

export const getSubjectsForDepartment = (department: Department, semester?: Semester): Subject[] => {
  let filtered = subjects.filter(subject => subject.department === department);
  
  if (semester) {
    filtered = filtered.filter(subject => subject.semester === semester);
  }
  
  return filtered.sort((a, b) => a.name.localeCompare(b.name));
};

export const getSubjectsForSemester = (semester: Semester): Subject[] => {
  return subjects
    .filter(subject => subject.semester === semester)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getEnrolledSubjects = (userId: string): Subject[] => {
  const user = users.find(u => u.id === userId);
  if (!user || !user.enrolledSubjects || user.role !== 'student') {
    return [];
  }
  
  return subjects.filter(subject => user.enrolledSubjects?.includes(subject.id));
};
