# PowerShell script to create .env file
$envContent = @"
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
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host "✅ .env file created successfully!" -ForegroundColor Green

