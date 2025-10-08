import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Testpage: React.FC = () => {
  const navigate = useNavigate();
  const [venueData, setVenueData] = useState<any>(null);
  const venueId = "68ccc459b27781dc482506af"; // Example venueId

  const handleGetToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("No user is signed in.");
      return;
    }
    const token = await user.getIdToken();
    console.log("Firebase ID Token:", token);
    alert("Token logged to console!");
  };

  const handleRedirect = () => {
    navigate(`/test-venue-vendor-profile`);
  };
    const handleDemoRedirect = () => {
    navigate(`/all-event-map`);
  };

  const handleFetchVenue = async () => {
    try {
      const res = await fetch(`/api/explore-venues/${venueId}`);
      if (!res.ok) throw new Error("Failed to fetch venue");
      const data = await res.json();
      setVenueData(data.venue || null);
      alert("Venue data fetched! Check console.");
      console.log("Venue Data:", data.venue);
    } catch (err) {
      setVenueData(null);
      alert("Error fetching venue data.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test Page</h2>
      <button
        onClick={handleGetToken}
        style={{
          padding: "0.5rem 1rem",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "1rem",
        }}
      >
        Get Firebase Auth Token
      </button>
      <button
        onClick={handleDemoRedirect}
        style={{
          padding: "0.5rem 1rem",
          background: "#059669",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "1rem",
        }}
      >
        Go to Map
      </button>
      <button
        onClick={handleFetchVenue}
        style={{
          padding: "0.5rem 1rem",
          background: "#f59e42",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Fetch Venue Data
      </button>
      {venueData && (
        <pre style={{ marginTop: "1rem", background: "#f3f4f6", padding: "1rem", borderRadius: "4px" }}>
          {JSON.stringify(venueData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Testpage;