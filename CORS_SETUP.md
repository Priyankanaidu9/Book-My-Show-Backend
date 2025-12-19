# CORS Configuration for Railway Backend

## Current Configuration

The backend is now configured to allow CORS requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)
- `https://book-my-show-frontend-alpha.vercel.app` (Your Vercel production deployment)
- All `*.vercel.app` domains (for preview deployments)
- Any origin specified in `FRONTEND_URL` environment variable

## Railway Environment Variables

If you need to add additional frontend URLs, you can set the `FRONTEND_URL` environment variable in Railway:

1. Go to your Railway project dashboard
2. Navigate to your backend service
3. Go to **Variables** tab
4. Add or update:
   ```
   FRONTEND_URL=https://book-my-show-frontend-alpha.vercel.app
   ```

**Note:** You can specify multiple URLs by separating them with commas, or the code will automatically allow all `*.vercel.app` domains.

## Testing CORS

After deploying the updated backend:

1. Check that the backend is running: `https://book-my-show-backend-production.up.railway.app/api/health`
2. Test from your frontend - the CORS errors should be resolved
3. Check browser console - there should be no CORS errors

## Troubleshooting

### Still Getting CORS Errors?

1. **Clear browser cache** - Old CORS headers might be cached
2. **Check Railway logs** - Look for CORS-related errors
3. **Verify the origin** - Make sure your frontend URL matches exactly (including https://)
4. **Redeploy backend** - After updating CORS config, redeploy the backend

### Adding New Frontend Domains

To add a new frontend domain, update the `allowedOrigins` array in `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://book-my-show-frontend-alpha.vercel.app',
  'https://your-new-domain.com', // Add here
  process.env.FRONTEND_URL
].filter(Boolean);
```

Then redeploy the backend.

