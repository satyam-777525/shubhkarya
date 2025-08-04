// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your existing pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ReviewForm from './pages/Review';
import Payment from './pages/Payment';
import Booking from './pages/Booking';
import Notifications from './pages/Notifications';
import Dashboard from './pages/Dashboard';
import PanditSignup from './pages/PanditSignup';
import PanditDashboard from './pages/PanditDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

// Import the new policy pages (assuming they are in src/components or src/pages)
// Adjust the path if your PrivacyPolicy.js and TermsConditions.js are in a different folder
import PrivacyPolicy from './components/PrivacyPolicy'; // Assuming src/components/PrivacyPolicy.js
import TermsConditions from './components/TermsConditions'; // Assuming src/components/TermsConditions.js


import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} /> {/* Redirect /home to / */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/pandit" element={<PanditSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pandit-dashboard" element={<PanditDashboard />} /> {/* Consider protecting this if not already */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* New Policy Pages - accessible publicly */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        {/* Admin routes wrapped in protection */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Auth-protected user routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <ReviewForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect unknown routes to home */}
        {/* This should always be the last route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;