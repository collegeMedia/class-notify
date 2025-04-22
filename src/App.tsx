
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "@/pages/Index";
import Assignments from "@/pages/Assignments";
import Lectures from "@/pages/Lectures";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AdminUpload from "@/pages/AdminUpload";
import ChatGroups from "@/pages/ChatGroups";
import ChatRoom from "@/pages/ChatRoom";
import { currentUser } from "@/lib/data";

// Very simple auth guard: If user has no name/email, redirect to Login
function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const userIsLoggedIn = currentUser && currentUser.name && currentUser.email;
  if (!userIsLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <RequireAuth>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/lectures" element={<Lectures />} />
              <Route path="/admin" element={<AdminUpload />} />
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
