# EventWala - A Event Management SaaS Application

A modern SaaS platform for seamless event management.

---

## Project Structure

Below is the directory structure of the repository, formatted for easy preview:

```
EventWala-A-Event-Management-Saas-application/
│
├── Backend/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── configs/
│   │   └── firebaseAdmin.js
│   ├── Controller/
│   │   ├── DB.js
│   │   ├── events.js
│   │   ├── profile.js
│   │   └── venue.js
│   ├── DB/
│   │   └── MongoDB_Connection.js
│   ├── Middleware/
│   │   └── authentication.js
│   ├── Models/
│   │   ├── events.js
│   │   ├── users.js
│   │   ├── vendor.js
│   │   └── venue.js
│   ├── Routes/
│   │   ├── DB_Router.js
│   │   ├── explore-events.js
│   │   └── explore-venues.js
│   ├── secrets/
│   │   └── "YOUR-SECRET-KEY-FOR-FIREBASE-OAUTH"
│   ├── TODO's/
│   │   ├── tasks.txt
│   │   └── tasks2.0.txt
│   └── Utils/
│
├── Frontend/
│   ├── .env
│   ├── eslint.config.js
│   ├── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
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
│       │   ├── StarryBackground.tsx
│       │   ├── UserProfilePage.tsx
│       │   ├── VendorDashboard.tsx
│       │   └── VenueVendorProfile.tsx
│       ├── config/
│       │   └── firebase.ts
│       ├── context/
│       │   └── EventTypeContext.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       └── images/
│           ├── BrandLogo.png
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

5. **Run backend and frontend servers** as per your development environment.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.  

Please make sure to update tests as appropriate.

---

## License

[MIT](LICENSE)
