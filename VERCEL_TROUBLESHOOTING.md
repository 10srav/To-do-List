# Vercel Deployment Troubleshooting Guide

## 🚨 Current Issues and Solutions

### Issue 1: Status 499 Errors (Connection Timeout)
**Cause**: MongoDB connection is timing out on Vercel
**Solution**: Follow these steps in order:

#### Step 1: Verify Environment Variables
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Ensure these variables are set for **Production**, **Preview**, AND **Development**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
NEXTAUTH_SECRET=jezUUSpxEn0EkoPMfdzq60Pz+uf5Il/aqNXFjjsju70=
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_USE_API=true
NODE_ENV=production
DEBUG_DB_CONNECTION=true
```

#### Step 2: MongoDB Atlas Configuration
1. **IP Whitelist**: Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - This is required for Vercel's serverless functions

2. **Database User**: Go to Database Access
   - Ensure user has `readWrite` permissions
   - Username and password should match your MONGODB_URI

3. **Connection String**: Verify format:
   ```
   mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
   ```

#### Step 3: Test Database Connection
After deployment, test these endpoints:

1. **Health Check**: `https://your-app.vercel.app/api/health`
2. **Database Test**: `https://your-app.vercel.app/api/test-db`

### Issue 2: Status 500 Errors (Server Errors)
**Cause**: API routes failing due to database connection issues
**Solution**: 

1. Check Vercel function logs:
   - Go to Vercel Dashboard → Functions tab
   - Click on failing function to see logs
   - Look for MongoDB connection errors

2. Common fixes:
   - Redeploy after setting environment variables
   - Ensure MongoDB Atlas cluster is in same region as Vercel
   - Check MongoDB Atlas cluster is not paused

### Issue 3: JSON Parse Errors
**Cause**: API returning HTML error pages instead of JSON
**Solution**: This happens when the API route crashes before returning JSON

1. Check the function logs for the actual error
2. Usually caused by MongoDB connection failure
3. Fix the database connection first

## 🔧 Step-by-Step Debugging Process

### 1. Check Environment Variables
```bash
# Test if environment variables are accessible
curl https://your-app.vercel.app/api/health
```

Expected response should show environment info.

### 2. Test Database Connection
```bash
# Test direct database connection
curl https://your-app.vercel.app/api/test-db
```

This will show detailed connection information and errors.

### 3. Check MongoDB Atlas
1. **Cluster Status**: Ensure cluster is running (not paused)
2. **Network Access**: Must include `0.0.0.0/0`
3. **Database Access**: User must have correct permissions
4. **Connection String**: Must be exactly correct

### 4. Verify Vercel Settings
1. **Region**: Ensure Vercel deployment is in same region as MongoDB
2. **Function Timeout**: Should be set to 25 seconds (already configured)
3. **Environment Variables**: Must be set for all environments

## 🎯 Quick Fix Checklist

- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Database user has `readWrite` permissions
- [ ] MONGODB_URI is correctly formatted and set in Vercel
- [ ] NEXTAUTH_URL matches your Vercel deployment URL exactly
- [ ] All environment variables are set for Production environment
- [ ] MongoDB Atlas cluster is running (not paused)
- [ ] Redeployed after setting environment variables

## 🔍 Common MongoDB Atlas Issues

### Issue: "Authentication failed"
- Check username/password in connection string
- Ensure database user exists and has correct permissions
- Password might contain special characters that need URL encoding

### Issue: "Server selection timeout"
- Check IP whitelist includes `0.0.0.0/0`
- Ensure cluster is running
- Check if cluster is in same region as Vercel deployment

### Issue: "Connection timeout"
- Increase timeout settings (already done in code)
- Check network connectivity
- Verify cluster is accessible

## 📞 If Still Not Working

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Functions
   - Click on `/api/health` or `/api/test-db`
   - Look for specific error messages

2. **Test Locally First**:
   ```bash
   # Set environment variables locally
   export MONGODB_URI="your-connection-string"
   export NEXTAUTH_SECRET="your-secret"
   
   # Test locally
   npm run dev
   ```

3. **Contact Support**:
   - If MongoDB Atlas: Check their status page
   - If Vercel: Check their status page
   - Provide specific error messages from function logs

## 🚀 Success Indicators

When everything is working correctly:

1. `/api/health` returns `{"status": "healthy"}`
2. `/api/test-db` returns `{"success": true}`
3. Main app loads without console errors
4. User registration/login works
5. Tasks can be created and saved

Your app should be fully functional on Vercel once these steps are completed! 🎉