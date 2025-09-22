# Environment Setup Guide

## Required Environment Variables

You need to create a `.env` file in the `frontend/` directory with the following variables:

### 1. Create .env file

```bash
# In the frontend/ directory
cp env.example .env
```

### 2. Required Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=Task Manager

# Development Tools
VITE_ENABLE_DEVTOOLS=true

# JWT Configuration (for client-side token handling)
VITE_JWT_SECRET_KEY=your-secret-key-change-in-production
VITE_REFRESH_TOKEN_KEY=refresh_token

# Environment
NODE_ENV=development
```

## Security Notes

### ✅ **Good Security Practices:**

- **No hardcoded secrets** in the code
- **Environment variables** for all sensitive data
- **`.env` file** in `.gitignore` (not committed to version control)
- **`env.example`** file as a template for other developers

### ⚠️ **Important Security Considerations:**

1. **JWT Secret Key**:

   - Change `VITE_JWT_SECRET_KEY` to a strong, unique secret
   - Use a different secret for production
   - Never commit the actual secret to version control

2. **API Base URL**:

   - Use `http://localhost:3000/api` for development
   - Use your production API URL for production builds

3. **DevTools**:
   - Set `VITE_ENABLE_DEVTOOLS=false` in production
   - Only enable in development for debugging

## Environment-Specific Configurations

### Development

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_DEVTOOLS=true
NODE_ENV=development
```

### Production

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_ENABLE_DEVTOOLS=false
NODE_ENV=production
```

## Validation

The configuration automatically validates all required environment variables on startup. If any required variable is missing, the app will throw an error with a clear message.

## Troubleshooting

### Error: "Environment variable VITE_API_BASE_URL is required"

- Make sure you have created a `.env` file
- Check that the variable name is exactly `VITE_API_BASE_URL`
- Ensure there are no spaces around the `=` sign

### Error: "Environment variable VITE_JWT_SECRET_KEY is required"

- Add `VITE_JWT_SECRET_KEY=your-secret-key` to your `.env` file
- Use a strong, unique secret key

## File Structure

```
frontend/
├── .env                 # Your actual environment variables (not in git)
├── env.example          # Template for other developers
├── ENV_SETUP.md         # This guide
└── src/config/
    ├── index.ts         # Centralized configuration
    ├── env.ts           # Deprecated (re-exports from index.ts)
    └── api.ts           # Deprecated (re-exports from index.ts)
```
