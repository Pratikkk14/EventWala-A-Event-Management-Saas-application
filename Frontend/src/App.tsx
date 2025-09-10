import React from 'react';

import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import UserProfilePage from './components/UserProfilePage'; 
// import SettingsPage from './components/SettingsPage';
import EventsPage from './components/EventsPage';
import VendorDashboard from './components/VendorDashboard';
import VenueVendorProfile from './components/VenueVendorProfile';

import { useAuth } from './hooks/useAuth';
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfilePage />} />
              {/* Add other protected routes here */}
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/venue-info" element={<VenueVendorProfile />} />
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="*" element={<AuthForm />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;