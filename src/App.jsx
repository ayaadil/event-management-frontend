// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import SplashScreen from './components/layout/splashscreen';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import Tickets from './pages/Tickets';
import Explore from './pages/Explore';
import Help from './pages/Help';
import NotificationsPage from './pages/Notifications';
import MyEvents from './pages/MyEvents';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import ExploreEventsPage from './pages/Explore';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              {/* Public Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Application Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/categories" element={<Explore />} />
                  <Route path="/saved" element={<Saved />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-events" element={<MyEvents />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/help" element={<Help />} />

                  {/* Admin-only Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                  </Route>
                </Route>
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}