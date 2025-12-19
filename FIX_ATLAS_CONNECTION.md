# Fix MongoDB Atlas Connection Error

## Your Current IP Address
**103.194.242.178**

## Step-by-Step Fix

### Step 1: Add IP to Atlas Network Access

1. **Go to MongoDB Atlas:**
   - Open: https://cloud.mongodb.com
   - Login to your account

2. **Navigate to Network Access:**
   - Click **"Security"** in left sidebar
   - Click **"Network Access"**
   - Or direct link: https://cloud.mongodb.com/v2#/security/network/whitelist

3. **Add Your IP:**
   - Click green **"Add IP Address"** button
   - Choose one:
     - **Option A (Recommended for Development):**
       - Click **"Allow Access from Anywhere"**
       - Or enter: `0.0.0.0/0`
       - Comment: "Development - Allow all"
     - **Option B (More Secure):**
       - Enter your IP: `103.194.242.178`
       - Comment: "My Development IP"
   - Click **"Confirm"**

4. **Wait 1-2 Minutes:**
   - Atlas needs time to propagate the change
   - Status will change from "Pending" to "Active"

### Step 2: Verify Connection String

Check your `backend/.env` file. It should look like:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookmyshow?retryWrites=true&w=majority
```

**Important:**
- Replace `username` with your Atlas database user
- Replace `password` with your Atlas database password
- Replace `cluster` with your actual cluster name
- Make sure `/bookmyshow` is included (database name)
- If password has special characters, URL-encode them

### Step 3: Test Connection

Run this command to test:

```powershell
npm run test-connection
```

If successful, you'll see:
```
✅ Successfully connected to MongoDB Atlas!
```

### Step 4: Seed Database

Once connection works:

```powershell
npm run seed
```

## Common Issues

### Issue 1: Still Getting IP Error After Adding IP
**Solution:**
- Wait 2-3 minutes (Atlas needs time to update)
- Make sure IP status shows "Active" (green checkmark)
- Try using `0.0.0.0/0` temporarily for testing

### Issue 2: Authentication Failed
**Solution:**
- Check username/password in connection string
- Make sure you're using the **Database User** credentials (not Atlas account)
- If password has `@`, `#`, `$`, etc., URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`

### Issue 3: Wrong Connection String Format
**Correct Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/bookmyshow?retryWrites=true&w=majority
```

**Wrong Formats:**
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
(No database name)
```

### Issue 4: Cluster Name Wrong
**Solution:**
- Go to Atlas → Clusters
- Click "Connect" on your cluster
- Copy the exact connection string from there
- Make sure cluster name matches

## Quick Test Commands

```powershell
# Test connection
npm run test-connection

# If test passes, seed database
npm run seed

# Start server
npm run dev
```

## Still Not Working?

1. **Check Atlas Dashboard:**
   - Go to Network Access
   - Verify your IP is listed and shows "Active"

2. **Check Connection String:**
   - Run: `npm run test-connection`
   - Look at the masked connection string output
   - Verify format is correct

3. **Try Allow All IPs (Temporary):**
   - Add `0.0.0.0/0` to Network Access
   - This allows all IPs (only for development!)

4. **Check Database User:**
   - Atlas → Database Access
   - Make sure database user exists and has password set
   - Verify username/password in connection string

