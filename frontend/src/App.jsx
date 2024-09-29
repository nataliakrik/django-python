import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome_page";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Admin_dashboard from "./pages/Admin_dashboard"
import Settings from "./pages/Settings";
import Jobs from "./pages/Jobs";
import Messages from "./pages/Messages";
import MyNetwork from "./pages/MyNetwork";
import Me from "./pages/Me";
import Notifications from "./pages/Notifications";
import OtherProfile from "./pages/OtherProfile";
import PostArticle from "./pages/PostArticle"
import ReadArticle from "./pages/ReadArticle"
import PostJob from "./pages/PostJob";




function Logout() {
  localStorage.clear()
  return <Navigate to="/Welcome" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route set to Welcome */}
        <Route path="/" element={<Welcome />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* All the pages that you can access only through Home Page have to be in the Protected route */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        {/* Other Pages */}
        <Route path="/admin_dashboard" element={<ProtectedRoute><Admin_dashboard /></ProtectedRoute>}/>
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>}/>
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>}/>
        <Route path="/mynetwork" element={<ProtectedRoute><MyNetwork /></ProtectedRoute>}/>
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>}/>
        <Route path="/otherprofile/:id" element={<ProtectedRoute><OtherProfile /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Me /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/postarticle" element={<ProtectedRoute><PostArticle /></ProtectedRoute>} />
        <Route path="/article/:id" element={<ProtectedRoute><ReadArticle /></ProtectedRoute>} />
        <Route path="/postjob" element={<ProtectedRoute><PostJob /></ProtectedRoute>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
