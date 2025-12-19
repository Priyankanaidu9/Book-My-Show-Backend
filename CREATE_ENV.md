# Create .env File

Since `.env` files are protected, you need to create it manually. Here are the options:

## Option 1: Create Manually

1. Navigate to the `backend` folder
2. Create a new file named `.env` (with the dot at the beginning)
3. Copy and paste this content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookmyshow
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
REDIS_HOST=localhost
REDIS_PORT=6379
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Option 2: Use PowerShell Script

Run this command in the `backend` folder:

```powershell
.\create-env.ps1
```

## Option 3: Use Command Line

**PowerShell:**
```powershell
cd backend
@"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookmyshow
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
REDIS_HOST=localhost
REDIS_PORT=6379
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding utf8
```

**Command Prompt:**
```cmd
cd backend
echo PORT=5000 > .env
echo MONGODB_URI=mongodb://localhost:27017/bookmyshow >> .env
echo JWT_SECRET=your_super_secret_jwt_key_change_this >> .env
echo JWT_EXPIRE=7d >> .env
echo REDIS_HOST=localhost >> .env
echo REDIS_PORT=6379 >> .env
echo STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key >> .env
echo STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret >> .env
echo FRONTEND_URL=http://localhost:5173 >> .env
echo NODE_ENV=development >> .env
```

## Verify .env File

After creating, verify it exists:
```powershell
cd backend
Get-Content .env
```

You should see all the environment variables listed.

