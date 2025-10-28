# EventWala Deployment Guide for Vercel

This guide explains how to deploy the EventWala application to Vercel.

## Preparing the Application for Deployment

### Backend Deployment

1. Create a new Vercel project for the backend:
   - Connect your GitHub repository
   - Set the root directory to `/Backend`
   - Use the following build settings:
     - Build Command: `npm install`
     - Output Directory: `/`
     - Install Command: `npm install`

2. Configure environment variables in the Vercel project settings:
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: The URL of your deployed frontend (e.g., https://your-frontend.vercel.app)
   - `APPWRITE_ENDPOINT`: Your Appwrite endpoint
   - `APPWRITE_PROJECT_ID`: Your Appwrite project ID
   - `APPWRITE_API_KEY`: Your Appwrite API key
   - `APPWRITE_BUCKET_ID`: Your Appwrite bucket ID

3. Deploy the backend and note the deployment URL (e.g., https://your-backend.vercel.app)

### Frontend Deployment

1. Update the frontend environment variables:
   - Edit `/Frontend/.env` and set `VITE_BACKEND_URL` to your backend deployment URL

2. Create a new Vercel project for the frontend:
   - Connect your GitHub repository
   - Set the root directory to `/Frontend`
   - Use the following build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. Configure environment variables in the Vercel project settings:
   - `VITE_BACKEND_URL`: Your backend Vercel URL
   - Add all other Firebase and Appwrite variables from your `.env` file

4. Update the `vercel.json` file in the frontend directory:
   - Replace "your-backend-vercel-url.vercel.app" with your actual backend URL

5. Deploy the frontend

## Using Environment Variables in Your Code

### In the Backend
```javascript
// Access environment variables using process.env
const frontendUrl = process.env.FRONTEND_URL;
```

### In the Frontend
```javascript
// Access environment variables using import.meta.env
import { buildApiUrl } from './utils/apiConfig';

// Use the utility function to create API URLs
const apiUrl = buildApiUrl('/explore-events');
```


# EventWala Deployment Guide

This guide explains how to deploy the EventWala application to any cloud platform or server.

## Preparing the Application for Deployment

### Backend Deployment

1. Set up your backend server (Node.js, Express, MongoDB).
2. Configure environment variables in your server environment:
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: The URL of your deployed frontend
   - `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`, `APPWRITE_BUCKET_ID`: If using Appwrite
   - `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON
3. Deploy the backend and note the deployment URL.

### Frontend Deployment

1. Update the frontend environment variables:
   - Edit `/Frontend/.env` and set `VITE_BACKEND_URL` to your backend deployment URL
2. Build the frontend:
   - Run `npm run build` in `/Frontend`
   - Deploy the contents of `/Frontend/dist` to your static hosting provider
3. Configure environment variables in your hosting platform as needed.

## Using Environment Variables in Your Code

### In the Backend
```javascript
// Access environment variables using process.env
const frontendUrl = process.env.FRONTEND_URL;
```

### In the Frontend
```javascript
// Access environment variables using import.meta.env
const backendUrl = import.meta.env.VITE_BACKEND_URL;
```

## Testing Your Deployment

1. Verify that the frontend can communicate with the backend
2. Test all major features of the application
3. Check for CORS issues and fix if necessary

## Troubleshooting

- **CORS Errors**: Make sure the backend CORS settings allow your frontend URL
- **API Connection Issues**: Verify environment variables are set correctly
- **Database Connection Issues**: Check your MongoDB connection string
- **Missing Environment Variables**: Ensure all required variables are set in your hosting platform

## Updating Your Deployment

After making changes to your code:

1. Push to your repository
2. Rebuild and redeploy your application