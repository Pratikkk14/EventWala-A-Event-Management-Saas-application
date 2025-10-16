# Vercel URL Guide for EventWala Application

This guide explains how to properly configure URLs in your environment variables for Vercel deployments.

## Types of Vercel URLs

When you deploy to Vercel, you get two types of URLs:

1. **Deployment URL**: A unique URL for each specific deployment
   - Example: `https://event-wala-a-event-management-saas-application-imd7-ga87e5zi5.vercel.app`
   - Changes with each deployment
   - Good for testing specific versions

2. **Project URL**: Your main production URL
   - Example: `https://event-wala-a-event-management-saas.vercel.app`
   - Or your custom domain if configured
   - Always points to your latest production deployment
   - More stable and professional

## Which URL to Use in Environment Variables

**Always use the Project URL (or custom domain)** in your environment variables, not the deployment-specific URL.

### Why?
- Project URLs are stable across deployments
- Ensures your configuration remains valid when you deploy updates
- Provides consistency for your users

### URL Configuration Checklist:

1. **Remove trailing slashes** from URLs in environment variables
   - Correct: `https://example.vercel.app`
   - Incorrect: `https://example.vercel.app/`

2. **Use HTTPS** not HTTP for production URLs

3. **Be consistent** with URL format across all configuration files

## Environment Variables to Update

### Frontend (.env):
```
VITE_BACKEND_URL=https://event-wala-a-event-management-saas.vercel.app
```

### Backend (.env):
```
FRONTEND_URL=https://event-wala-a-event-management-saas-application.vercel.app
BACKEND_URL=https://event-wala-a-event-management-saas.vercel.app
```

### Frontend (vercel.json):
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://event-wala-a-event-management-saas.vercel.app/api/:path*"
    }
  ],
  "env": {
    "VITE_BACKEND_URL": "https://event-wala-a-event-management-saas.vercel.app"
  }
}
```

## Appwrite Configuration

For Appwrite, add both your project URL and any preview deployment URLs to your allowed domains list in the Appwrite console:

1. Go to your Appwrite Project Settings > API
2. Add to Allowed Domains (CORS):
   - `https://event-wala-a-event-management-saas-kappa.vercel.app` (Frontend URL - Production)
   - `https://event-wala-a-event-management-saas.vercel.app` (Backend URL)
   - Any other specific deployment URLs you want to test with