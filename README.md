# EventWala - Event Management SaaS Application

A modern SaaS platform for seamless event management, built with a scalable microservices architecture. EventWala enables organizations, vendors, and users to manage, book, and host events efficiently through a robust backend and a dynamic frontend.

---

## How the Project Works

### 1. **Architecture Overview**
- **Monorepo Structure:**
  - `Backend/` (Node.js, Express, MongoDB, Firebase Admin)
  - `Frontend/` (React, TypeScript, Vite, Tailwind CSS)
- **API-Driven:**
  - The backend exposes RESTful APIs for event, user, vendor, and venue management.
  - The frontend consumes these APIs for all dynamic data and user actions.
- **Authentication:**
  - Firebase OAuth is used for secure user authentication and session management.
  - Backend verifies tokens for protected routes.
- **Cloud Storage:**
  - Appwrite and Firebase are used for file uploads (e.g., user avatars, event images).

### 2. **Backend Functionality**
- **Express Server:** Handles all API requests, CORS, and error management.
- **MongoDB:** Stores users, events, vendors, venues, and related data.
- **Routes:**
  - `/api/DB_Routes`: User profile, authentication, and CRUD operations.
  - `/api/explore-events`: Event listing, filtering, and booking.
  - `/api/explore-venues`: Venue management and search.
  - `/api/vendors`: Vendor onboarding and dashboard.
- **Authentication Middleware:** Ensures only authenticated users can access protected endpoints.
- **Service Account:** Firebase Admin SDK is initialized using a service account key (provided via environment variable in production).

### 3. **Frontend Functionality**
- **React SPA:**
  - Uses React Router for client-side navigation (e.g., `/profile`, `/dashboard`, `/events`).
  - Responsive UI built with Tailwind CSS.
- **User Flows:**
  - **Sign Up / Login:** Users authenticate via Firebase OAuth.
  - **Profile Management:** Users can view and update their profile, including uploading avatars.
  - **Event Discovery:** Users browse and book events.
  - **Vendor Dashboard:** Vendors manage their services, venues, and bookings.
- **API Integration:**
  - All data is fetched from the backend using the API URL set in `.env` (`VITE_BACKEND_URL`).
  - Protected requests include the Firebase token in the `Authorization` header.

### 4. **Deployment & Environment**
- **Vercel:**
  - Both frontend and backend are deployed as separate Vercel projects.
  - Environment variables (API keys, MongoDB URI, service account JSON) are set in the Vercel dashboard.
  - Backend uses a health check route (`/`) for status monitoring.
- **Production URLs:**
  - Frontend: `https://event-wala-a-event-management-saas-kappa.vercel.app` (example)
  - Backend: `https://event-wala-a-event-management-saas.vercel.app` (example)
- **CORS & Security:**
  - Backend CORS is configured to allow requests from the frontend domain.
  - Appwrite and Firebase are configured to accept requests from production domains.

### 5. **How to Use the Project**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pratikkk14/EventWala-A-Event-Management-Saas-application.git
   ```
2. **Install dependencies:**
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```
3. **Set up environment variables:**
   - Backend: `.env` with `MONGODB_URI`, Firebase service account, Appwrite keys, etc.
   - Frontend: `.env` with `VITE_BACKEND_URL`, Firebase keys, Appwrite keys.
4. **Run locally:**
   - Backend: `npm start` (or `npm run dev` if using nodemon)
   - Frontend: `npm run dev`
5. **Deploy to Vercel:**
   - Set project root to `Frontend` or `Backend` as needed.
   - Add all required environment variables in Vercel dashboard.
   - Vercel will build and deploy automatically.
6. **Access the app:**
   - Visit the frontend URL for the React app.
   - API requests are routed to the backend URL.

### 6. **Key Features**
- **User Authentication:** Secure login/signup via Firebase.
- **Profile Management:** Edit profile, upload avatar, manage preferences.
- **Event Discovery & Booking:** Browse, filter, and book events.
- **Vendor Management:** Vendors can onboard, manage venues, and view bookings.
- **Cloud Storage:** Upload and manage images/files via Appwrite and Firebase.
- **Responsive UI:** Works on desktop and mobile.
- **API Security:** All sensitive routes require authentication.

### 7. **Extending the Project**
- Add new event types, payment integration, or analytics.
- Expand vendor features (offers, reviews, etc.).
- Integrate more third-party services (email, SMS, etc.).
- Improve admin dashboard for platform management.

---

## Project Structure

Below is the directory structure of the repository, formatted for easy preview:
```
EventWala-A-Event-Management-Saas-application/
│
├── Backend/
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   ├── configs/
│   │   └── firebaseAdmin.js
│   ├── Controller/
│   │   ├── DB.js
│   │   ├── events.js
│   │   ├── profile.js
│   │   ├── vendor.js
│   │   └── venue.js
│   ├── DB/
│   │   └── MongoDB_Connection.js
│   ├── Middleware/
│   │   └── authentication.js
│   ├── Models/
│   │   ├── events.js
│   │   ├── services.js
│   │   ├── users.js
│   │   ├── vendor.js
│   │   └── venue.js
│   ├── Routes/
│   │   ├── DB_Router.js
│   │   ├── explore-events.js
│   │   ├── explore-venues.js
│   │   └── Vendor_Router.js
│   ├── secrets/
│   │   └── serviceAccountKey.json
│   ├── services/
│   │   └── appwrite.js
│   ├── TODO's/
│   │   ├── frontend_backend_todos.txt
│   │   ├── tasks.txt
│   │   └── tasks2.0.txt
│   └── Utils/
│
├── Frontend/
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── stylingCodeofVenueVendorProfile.tsx
│   ├── tailwind.config.js
│   ├── TempVenueVendorProfile.tsx
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── vite-env.d.ts
│       ├── components/
│       │   ├── AuthForm.tsx
│       │   ├── Dashboard.tsx
│       │   ├── EventsPage.jsx
│       │   ├── MapComponent.jsx
│       │   ├── StarryBackground.tsx
│       │   ├── Testpage.tsx
│       │   ├── UserProfilePage.tsx
│       │   ├── VendorDashboard.tsx
│       │   └── VenueVendorProfile.tsx
│       ├── config/
│       │   └── firebase.ts
│       ├── context/
│       │   ├── EventTypeContext.tsx
│       │   └── LocationContext.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useLocation.ts
│       └── images/
│           ├── BrandLogo.png
│           ├── gps.png
│           ├── gps.png:Zone.Identifier
│           └── UserAvatars/
│               ├── Female.png
│               └── Male.png
│
├── README.md
├── package.json
├── .gitignore
```

---

## About

**EventWala** is designed to help organizations and vendors manage and streamline events efficiently. The application provides both frontend (React, TypeScript, Tailwind) and backend (Node.js, Express, MongoDB) solutions with firebase OAuth service as authentication service and user management.

- **Backend**: Node.js, Express, MongoDB, Firebase Admin
- **Frontend**: React, TypeScript, Tailwind CSS, Vite

---

## Getting Started

To run the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pratikkk14/EventWala-A-Event-Management-Saas-application.git
   ```
2. **Install dependencies for Backend and Frontend:**
   ```bash
   cd Backend
   npm install
   cd ../Frontend
   npm install
   ```
3. **Set up environment variables** in both `/Backend/.env` and `/Frontend/.env`.
      ```frontend/env file 
      VITE_API_KEY=Your_VITE_API_KEY
      VITE_AUTH_DOMAIN=Your_VITE_AUTH_DOMAIN
      VITE_PROJECT_ID=Your_VITE_PROJECT_ID
      VITE_STORAGE_BUCKET=Your_VITE_STORAGE_BUCKET
      VITE_MESSAGING_SENDER_ID=Your_VITE_MESSAGING_SENDER_ID
      VITE_APP_ID=Your_VITE_APP_ID
      VITE_MEASUREMENT_ID=Your_VITE_MEASUREMENT_ID
      ```
      ```backend/env
      PORT=your_portnum 
      MONGODB_URI=Your_MONGOLOCAL_url || Your_MONGO_ATLAS_URL
      ```
      ```backend/secrets
      here in the backend/secrets folder add your serviceAccountKey for firebase 
      ```
5. **Run backend and frontend servers** as per your development environment.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.  
Please make sure to update tests as appropriate.

---

## License

[MIT](LICENSE)
