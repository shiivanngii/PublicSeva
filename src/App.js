import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import CitizenHome from "./pages/citizen/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReportIssue from "./pages/citizen/ReportIssue";

import Home from "./pages/citizen/Home";
import Profile from "./pages/citizen/Profile";
import CheckStatus from "./pages/citizen/CheckStatus";
import MapView from "./pages/citizen/MapView";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <BrowserRouter>
      {/* GLOBAL THEME WRAPPER */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage dark={dark} setDark={setDark} />} />
          <Route path="/login" element={<Login dark={dark} setDark={setDark} />} />
          <Route path="/signup" element={<Signup dark={dark} setDark={setDark} />} />

          {/* Citizen */}
          <Route
            path="/citizen/home"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/citizen/status"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <CheckStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/citizen/report"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <ReportIssue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/citizen/profile"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/citizen/map"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <MapView />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
