
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Assignments from "@/pages/Assignments";
import Lectures from "@/pages/Lectures";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AdminUpload from "@/pages/AdminUpload";
import ChatGroups from "@/pages/ChatGroups";
import ChatRoom from "@/pages/ChatRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/lectures" element={<Lectures />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminUpload />} />
        <Route path="/chat-groups" element={<ChatGroups />} />
        <Route path="/chat/:groupId" element={<ChatRoom />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
