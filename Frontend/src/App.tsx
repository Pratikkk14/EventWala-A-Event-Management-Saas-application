import React from 'react';
import { useState } from "react";
import { EventTypeContext } from './context/EventTypeContext.js';

import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import UserProfilePage from './components/UserProfilePage'; 
// import SettingsPage from './components/SettingsPage';
// @ts-ignore
import EventsPage from './components/EventsPage.jsx';
import VendorDashboard from './components/VendorDashboard';
import VenueVendorProfile from './components/VenueVendorProfile';

import { useAuth } from './hooks/useAuth';
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { user, loading } = useAuth();
  const [eventType, setEventType] = useState("");

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
      <EventTypeContext.Provider value={{ eventType, setEventType }}>
        <BrowserRouter>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfilePage />} />

              <Route path="/venue" element={<EventsPage />} />
              <Route path="/venue/:eventType" element={<EventsPage />} />
              <Route
                path="/venue/:eventType/:venueId"
                element={<VenueVendorProfile />}
              />
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
      </EventTypeContext.Provider>
    </>
  );
}

export default App;