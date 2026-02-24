
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "@/pages/Index";
import Assignments from "@/pages/Assignments";
import Lectures from "@/pages/Lectures";
import RoleSelection from "@/pages/RoleSelection";
import StudentLogin from "@/pages/StudentLogin";
import TeacherLogin from "@/pages/TeacherLogin";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "@/pages/NotFound";
import AdminUpload from "@/pages/AdminUpload";
import ChatGroups from "@/pages/ChatGroups";
import ChatRoom from "@/pages/ChatRoom";
import { isAuthenticated } from "@/lib/auth";
import { currentUser, loadCurrentUser } from "@/lib/data";

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const userIsLoggedIn = isAuthenticated() && currentUser && currentUser.name && currentUser.email;
  if (!userIsLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const userIsLoggedIn = isAuthenticated() && currentUser && currentUser.name && currentUser.email;
  
  if (!userIsLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  useEffect(() => {
    loadCurrentUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<RoleSelection />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="*" element={
          <RequireAuth>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/lectures" element={<Lectures />} />
              <Route path="/admin" element={
                <RequireAdmin>
                  <AdminUpload />
                </RequireAdmin>
              } />
              <Route path="/chat-groups" element={<ChatGroups />} />
              <Route path="/chat/:groupId" element={<ChatRoom />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RequireAuth>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
