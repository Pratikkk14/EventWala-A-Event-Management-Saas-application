import React from 'react';
import { useState } from "react";
import { EventTypeContext } from './context/EventTypeContext.js';
import { LocationProvider } from './context/LocationContext';

import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import UserProfilePage from './components/UserProfilePage'; 
// import SettingsPage from './components/SettingsPage';
// @ts-ignore
import EventsPage from './components/EventsPage.jsx';
import VendorDashboard from './components/VendorDashboard.jsx';
import VenueVendorProfile from './components/VenueVendorProfile';
// @ts-ignore
import Mapcomponent from './components/MapComponent';
// @ts-ignore
import BecomeVendorForm from './components/VendorOnBoardingForm';
// @ts-ignore
import EventMediaHub from './components/MediaHub';
// @ts-ignore
import MyBookingsPage from './components/MyBookingsPage';

//testing pg
import Testpage from './components/Testpage'; 
import TempVenueVendorProfile from '../TempVenueVendorProfile.js';

import { useAuth } from './hooks/useAuth';
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {

  type MongoUserType = {
    data?: { role?: string; };
  };

  const { user, mongoUser, loading } = useAuth() as {
    user: any;
    mongoUser: MongoUserType | null;
    loading: boolean;
  };
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
      <LocationProvider>
        <EventTypeContext.Provider value={{ eventType, setEventType }}>
          <BrowserRouter>
            <Routes>
              {user ? (
                <>
                  {/* Redirect vendor users from "/" to "/vendor-dashboard" */}
                  <Route
                    path="/"
                    element={
                      mongoUser?.data?.role === "vendor" ? (
                        <Navigate to="/vendor-dashboard" replace />
                      ) : (
                        <Dashboard />
                      )
                    }
                  />
                  <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/venue" element={<EventsPage />} />
                  <Route path="/venue/:eventType" element={<EventsPage />} />
                  <Route path="/venue-vendor-profile/:venueId" element={<VenueVendorProfile />} />
                  <Route path="/test" element={<Testpage />} />
                  <Route path="/all-event-map" element={<Mapcomponent />} />
                  <Route path="/test-venue-vendor-profile" element={<TempVenueVendorProfile />} />
                  <Route path="/become-vendor" element={<BecomeVendorForm />} />
                  <Route path="/media-hub" element={<EventMediaHub />} />
                  <Route path="/my-bookings" element={<MyBookingsPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <Route path="*" element={<AuthForm />} />
              )}
            </Routes>
          </BrowserRouter>
        </EventTypeContext.Provider>
      </LocationProvider>
    </>
  );
}

export default App;