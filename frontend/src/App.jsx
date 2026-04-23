import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddAssessment from "./pages/AddAssessment";
import ListAssessments from "./pages/ListAssessments";
import Circularity from "./pages/Circularity";
import Report from "./pages/Report";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Simple guard that checks token on EVERY render
function RequireAuth({ children }) {
  const isAuthed = !!localStorage.getItem("token");
  return isAuthed ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected pages */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/add"
          element={
            <RequireAuth>
              <AddAssessment />
            </RequireAuth>
          }
        />
        <Route
          path="/list"
          element={
            <RequireAuth>
              <ListAssessments />
            </RequireAuth>
          }
        />
        <Route
          path="/circularity"
          element={
            <RequireAuth>
              <Circularity />
            </RequireAuth>
          }
        />
        <Route
          path="/report"
          element={
            <RequireAuth>
              <Report />
            </RequireAuth>
          }
        />

        {/* Auth pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
