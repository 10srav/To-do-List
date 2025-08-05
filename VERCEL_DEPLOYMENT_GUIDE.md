# Vercel Deployment Guide for TaskSaver

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- MongoDB Atlas account and cluster set up
- Vercel account
- GitHub repository with your code

### 2. MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster (if not already done)
2. Create a database user with readWrite permissions
3. Whitelist all IP addresses (0.0.0.0/0) for Vercel deployment
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts and set environment variables
```

### 4. Environment Variables for Vercel

Set these environment variables in your Vercel project settings:

```env
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority

# Authentication (REQUIRED)
NEXTAUTH_SECRET=jezUUSpxEn0EkoPMfdzq60Pz+uf5Il/aqNXFjjsju70=
NEXTAUTH_URL=https://your-vercel-app.vercel.app

# API Configuration
NEXT_PUBLIC_USE_API=true

# Environment
NODE_ENV=production

# Debug (Optional - helps with troubleshooting)
DEBUG_DB_CONNECTION=true
```

### 5. How to Set Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string
   - Environment: Production, Preview, Development (select all)
5. Repeat for all variables above
6. Redeploy your application

### 6. Verify Deployment

After deployment, test these endpoints:

1. **Health Check**: `https://your-app.vercel.app/api/health`
   - Should return: `{"status": "healthy", "database": {"status": "connected"}}`

2. **Main App**: `https://your-app.vercel.app`
   - Should load the TaskSaver interface

3. **API Endpoints**:
   - Tasks: `https://your-app.vercel.app/api/tasks`
   - Events: `https://your-app.vercel.app/api/events`
   - Messages: `https://your-app.vercel.app/api/messages`

## 🔧 Troubleshooting Common Issues

### Issue 1: "Database connection failed"
**Cause**: MongoDB URI not set or incorrect
**Solution**:
1. Verify MONGODB_URI is set in Vercel environment variables
2. Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
3. Verify database user has correct permissions
4. Test connection string locally first

### Issue 2: "API routes not working"
**Cause**: Environment variables not properly set
**Solution**:
1. Check all environment variables are set in Vercel
2. Ensure NEXTAUTH_URL matches your Vercel deployment URL
3. Redeploy after setting environment variables

### Issue 3: "Authentication not working"
**Cause**: NEXTAUTH_SECRET or NEXTAUTH_URL issues
**Solution**:
1. Verify NEXTAUTH_SECRET is set
2. Ensure NEXTAUTH_URL matches your exact Vercel URL (with https://)
3. Clear browser cookies and try again

### Issue 4: "Function timeout"
**Cause**: MongoDB connection taking too long
**Solution**:
1. Check MongoDB Atlas cluster is in the same region as Vercel
2. Verify network connectivity
3. Check Vercel function logs for specific errors

## 📊 Performance Optimization

The app includes several Vercel-specific optimizations:

1. **Connection Pooling**: Reduced pool size for Vercel's serverless environment
2. **Timeout Settings**: Increased timeouts for better reliability
3. **Static Generation**: Pre-rendered pages for faster loading
4. **Edge Functions**: API routes optimized for Vercel's edge network

## 🔍 Monitoring and Debugging

### View Logs
1. Go to your Vercel project dashboard
2. Click on "Functions" tab
3. Click on any function to see logs
4. Look for MongoDB connection errors or API issues

### Enable Debug Mode
Set `DEBUG_DB_CONNECTION=true` in environment variables to see detailed connection logs.

### Test API Endpoints
Use the health check endpoint to verify everything is working:
```bash
curl https://your-app.vercel.app/api/health
```

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] All environment variables set in Vercel
- [ ] Application deployed successfully
- [ ] Health check endpoint returns "healthy"
- [ ] Main application loads without errors
- [ ] User registration/login works
- [ ] Tasks and events can be created/updated
- [ ] Data persists between sessions

## 📞 Need Help?

If you're still experiencing issues:

1. Check the Vercel function logs for specific error messages
2. Test the health endpoint: `/api/health`
3. Verify all environment variables are correctly set
4. Ensure MongoDB Atlas is properly configured
5. Try redeploying after making changes

Your TaskSaver app should now be running perfectly on Vercel! 🚀