import React from 'react';
import { useState } from "react";
import { EventTypeContext } from './context/EventTypeContext.js';
import { LocationProvider } from './context/LocationContext';
import { InquiryProvider } from './context/InquiryContext';

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
// @ts-ignore - Commented out Media Hub component
// import EventMediaHub from './components/MediaHub';
import TempVenueVendorProfile from '../TempVenueVendorProfile.js';
// @ts-ignore
import MyBookingsPage from './components/MyBookingsPage';

//testing pg
import Testpage from './components/Testpage'; 
// import TempVenueVendorProfile from '../TempVenueVendorProfile.js';
import InquiryQueue from './components/Inquiry';

import { useAuth } from './hooks/useAuth';
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  // Add console log to verify App rendering with InquiryProvider
  console.log("App: Rendering with InquiryProvider");

  type MongoUserType = {
    data?: { role?: string; };
  };

  const { user, mongoUser, loading } = useAuth() as {
    user: any;
    mongoUser: MongoUserType | null;
    loading: boolean;
  };
  const [eventType, setEventType] = useState("");
  
  // Debug mounting of App component with providers
  React.useEffect(() => {
    console.log("App: Component mounted with providers");
  }, []);

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
          <InquiryProvider>
            <BrowserRouter>
              <Routes>
              {user ? (
                <>
                  {/* Allow both user and vendor dashboard access */}
                  <Route
                    path="/"
                    element={<Dashboard />}
                  />
                  {/* Optional: Redirect to vendor dashboard only on first login/auth */}
                  <Route
                    path="/welcome"
                    element={
                      mongoUser?.data?.role === "vendor" ? (
                        <Navigate to="/vendor-dashboard" replace />
                      ) : (
                        <Navigate to="/" replace />
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
                  {/* Media Hub route commented out
                  <Route path="/media-hub" element={<EventMediaHub />} />
                  */}
                  <Route path="/my-bookings" element={<MyBookingsPage />} />
                  <Route path="/vendor/inquiries" element={<InquiryQueue />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <Route path="*" element={<AuthForm />} />
              )}
            </Routes>
          </BrowserRouter>
          </InquiryProvider>
        </EventTypeContext.Provider>
      </LocationProvider>
    </>
  );
}

export default App;