# Migrating to MongoDB Atlas

## Step 1: Get Your Atlas Connection String

1. **Go to MongoDB Atlas Dashboard:**
   - Login at: https://cloud.mongodb.com
   - Select your cluster

2. **Get Connection String:**
   - Click **"Connect"** button on your cluster
   - Choose **"Connect your application"**
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

3. **Add Database Name:**
   - Replace the connection string to include database name:
   - `mongodb+srv://username:password@cluster.mongodb.net/bookmyshow?retryWrites=true&w=majority`

## Step 2: Update .env File

Update your `backend/.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookmyshow?retryWrites=true&w=majority
```

**Important:** Replace:
- `username` with your Atlas username
- `password` with your Atlas password
- `cluster` with your actual cluster name

## Step 3: Whitelist Your IP (If Needed)

1. In Atlas Dashboard → **Network Access**
2. Click **"Add IP Address"**
3. For development, you can add `0.0.0.0/0` (allows all IPs - **only for development!**)
4. Or add your specific IP address

## Step 4: Seed the Database

Run the seed script to populate Atlas:

```powershell
cd backend
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Created 12 movies
✅ Created 48 theaters
✅ Created test user: test@example.com / password123
🎉 Seeding completed!
```

## Step 5: Verify Data in Atlas

1. Go to Atlas Dashboard
2. Click **"Browse Collections"**
3. Select database: `bookmyshow`
4. You should see:
   - `movies` collection (12 documents)
   - `theaters` collection (48 documents)
   - `users` collection (1 document)

## Troubleshooting

### Error: "Authentication failed"
- Check username/password in connection string
- Make sure you URL-encoded the password (if it has special characters)

### Error: "IP not whitelisted"
- Add your IP to Network Access in Atlas
- Or use `0.0.0.0/0` for development (not recommended for production)

### Error: "Connection timeout"
- Check your internet connection
- Verify the connection string is correct
- Make sure Atlas cluster is running

### Password with Special Characters
If your password has special characters, URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- etc.

Or change your Atlas user password to one without special characters.

