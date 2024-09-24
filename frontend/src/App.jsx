import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin_dashboard from "./pages/Admin_dashboard"
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome_page";
import Settings from "./pages/Settings";
import Jobs from "./pages/Jobs";
import Messages from "./pages/Messages";
import MyNetwork from "./pages/MyNetwork";
import Notifications from "./pages/Notifications";
import OtherProfile from "./pages/OtherProfile";
import Me from "./pages/Me";
import PostArticle from "./pages/PostArticle"
import ReadArticle from "./pages/ReadArticle"




function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
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
        
        {/* Protected route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        // route for the admin it has to be protected because only admins can access it
        <Route
          path="/admin_dashboard"
          element={
            <ProtectedRoute>
              <Admin_dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/jobs" element={<Jobs />}/> 
        <Route path="/messages" element={<Messages />}/>
        <Route path="/mynetwork" element={<MyNetwork />}/>
        <Route path="/notifications" element={<Notifications />}/>
        <Route path="/otherprofile" element={<OtherProfile />}/>
        <Route path="/profile" element={<Me />} />
        <Route path="/settings" element={<Settings />} />
        
        
        {/* Other routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/postarticle" element={<PostArticle />} />
        <Route path="/article/:id" element={<ReadArticle />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
