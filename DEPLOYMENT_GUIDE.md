# Deployment Guide for TaskSaver

## Pre-Deployment Checklist

### 1. MongoDB Setup
- [ ] Create MongoDB Atlas account (if not using local MongoDB)
- [ ] Create a new cluster
- [ ] Create a database user with read/write permissions
- [ ] Whitelist your deployment platform's IP addresses (or use 0.0.0.0/0 for all IPs)
- [ ] Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

### 2. Environment Variables Setup
Create these environment variables in your deployment platform:

**Required Variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mydatabase?retryWrites=true&w=majority
NEXTAUTH_SECRET=jezUUSpxEn0EkoPMfdzq60Pz+uf5Il/aqNXFjjsju70=
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_USE_API=true
NODE_ENV=production
```

**Optional Debug Variables:**
```
DEBUG_DB_CONNECTION=true
```

### 3. Render.com Deployment Steps

1. **Connect Repository:**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service:**
   - **Name:** `tasksaver-app` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better performance)

3. **Set Environment Variables:**
   - Go to your service settings
   - Add all the environment variables listed above
   - **Important:** Replace placeholder values with your actual values

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete

### 4. Vercel Deployment Steps

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add NEXT_PUBLIC_USE_API
   ```

### 5. Netlify Deployment Steps

1. **Build Settings:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`

2. **Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add all required variables

## Post-Deployment Verification

### 1. Health Check
Visit: `https://your-app-name.onrender.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "database": {
    "status": "connected"
  }
}
```

### 2. Test API Endpoints
- **Auth:** `POST /api/auth/login`
- **Tasks:** `GET /api/tasks`
- **Events:** `GET /api/events`
- **Messages:** `GET /api/messages`

### 3. Check Browser Console
- Open browser developer tools
- Look for any console errors
- Verify API calls are successful

## Common Issues and Solutions

### Issue 1: "Database connection failed"
**Symptoms:** Health check shows database disconnected
**Solutions:**
1. Verify MONGODB_URI is correct
2. Check MongoDB Atlas IP whitelist
3. Ensure database user has correct permissions
4. Check MongoDB Atlas cluster is running

### Issue 2: "API requests fail with 404"
**Symptoms:** Frontend can't reach API routes
**Solutions:**
1. Verify build completed successfully
2. Check that API routes are in `src/app/api/` directory
3. Ensure Next.js is configured for API routes

### Issue 3: "Authentication not working"
**Symptoms:** Login fails or user not authenticated
**Solutions:**
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your domain
3. Ensure cookies are being set correctly

### Issue 4: "CORS errors"
**Symptoms:** Cross-origin request blocked
**Solutions:**
1. Check middleware.ts is configured correctly
2. Verify allowed origins include your domain
3. Ensure CORS headers are set in next.config.js

## Environment-Specific Configurations

### Development
```env
MONGODB_URI=mongodb://localhost:27017/mydatabase
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_USE_API=true
DEBUG_DB_CONNECTION=true
```

### Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mydatabase
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_USE_API=true
NODE_ENV=production
```

## Monitoring and Debugging

### 1. Application Logs
- Check your deployment platform's logs
- Look for MongoDB connection messages
- Monitor API request/response logs

### 2. Database Monitoring
- Use MongoDB Atlas monitoring
- Check connection counts
- Monitor query performance

### 3. Performance Monitoring
- Monitor response times via health check
- Check memory usage
- Monitor error rates

## Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data to git
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security:**
   - Use strong database passwords
   - Limit IP access when possible
   - Enable MongoDB Atlas security features

3. **HTTPS:**
   - Always use HTTPS in production
   - Ensure secure cookies are enabled
   - Verify SSL certificates

## Backup and Recovery

1. **Database Backups:**
   - Enable MongoDB Atlas automated backups
   - Test restore procedures
   - Document backup retention policies

2. **Code Backups:**
   - Ensure code is in version control
   - Tag releases for easy rollback
   - Document deployment procedures

## Support and Troubleshooting

If you encounter issues:

1. Check the health endpoint: `/api/health`
2. Review application logs
3. Verify environment variables
4. Test database connectivity
5. Check CORS configuration

For additional help, check the deployment platform's documentation or contact support.