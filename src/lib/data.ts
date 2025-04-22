
import { User, UserRole } from "./types";

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
