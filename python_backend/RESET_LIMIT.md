# 🔄 Reset Rate Limit or Change API Key

## Option 1: Reset Rate Limit (Same API Key)

If you want to reset today's limit counter for the same API key:

### Via API Endpoint:
```bash
curl -X POST http://localhost:8000/api/rate-limit/reset
```

### Or via Python:
```python
from services.rate_limiter import get_rate_limiter
rate_limiter = get_rate_limiter()
rate_limiter.reset()
```

### Or Delete the Rate Limit File:
```bash
# Windows
del python_backend\data\rate_limit.json

# Linux/Mac
rm python_backend/data/rate_limit.json
```

## Option 2: Change API Key (New Key)

If you want to use a different API key:

### Step 1: Update .env File

1. Open `python_backend/.env` file
2. Update the `GOOGLE_API_KEY` value:
   ```env
   GOOGLE_API_KEY=your_new_api_key_here
   ```

### Step 2: Reset Rate Limit

After changing the API key, reset the rate limit:

```bash
# Via API
curl -X POST http://localhost:8000/api/rate-limit/reset

# Or delete the file
del python_backend\data\rate_limit.json  # Windows
rm python_backend/data/rate_limit.json    # Linux/Mac
```

### Step 3: Restart Backend

The backend needs to be restarted to pick up the new API key:

1. Stop the backend (Ctrl+C)
2. Start it again:
   ```bash
   cd python_backend
   python main.py
   ```

## 🔑 Getting a New API Key

1. Go to https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API Key" or go to API Keys section
4. Create a new API key
5. Copy the key and update it in `.env` file

## ✅ Verify It's Working

After resetting or changing the key:

1. Check rate limit status:
   ```bash
   curl http://localhost:8000/api/rate-limit
   ```

2. You should see:
   ```json
   {
     "count": 0,
     "limit": 45,
     "remaining": 45,
     "can_request": true,
     "message": "45 API calls remaining today (out of 45)"
   }
   ```

3. Test with a code file upload or save a file in VS Code

## 📝 Notes

- **Rate limit resets automatically at midnight** (based on your system date)
- **Each API key has its own 50 requests/day limit** (we limit to 45 to be safe)
- **The rate limit file is stored in:** `python_backend/data/rate_limit.json`
- **You can have multiple API keys** and switch between them by updating `.env` and resetting the counter

