# Environment Variables Setup Guide

## 📝 Your .env File

I can see you've created a `.env` file in `python_backend/`. Here's what you need to add to it:

## Required Configuration

Open `python_backend/.env` and add the following:

```env
# Google Gemini API Key (Required for AI features)
# Get your free API key from: https://aistudio.google.com/
GOOGLE_API_KEY=your_actual_api_key_here

# Backend Port (Optional - defaults to 8000)
BACKEND_PORT=8000

# ChromaDB Storage Path (Optional - defaults to ./db/chroma_store)
CHROMA_DB_PATH=./db/chroma_store
```

## 🔑 Getting Your Gemini API Key

1. Go to https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API Key" or go to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## ✅ Verify Your Setup

After adding your API key, run:

```bash
cd python_backend
python verify_env.py
```

This will check if your `.env` is configured correctly.

## 🚀 Next Steps

Once your `.env` is configured:

1. **Start the backend:**
   ```bash
   cd python_backend
   python main.py
   ```

2. **You should see:**
   ```
   ✅ Services initialized successfully
   INFO:     Started server process
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

3. **If you see warnings about API key:**
   - Make sure `.env` is in `python_backend/` directory
   - Check that `GOOGLE_API_KEY=your_key` is on a single line
   - No quotes around the key value
   - No spaces around the `=` sign

## 📋 Example .env File

```env
GOOGLE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
BACKEND_PORT=8000
CHROMA_DB_PATH=./db/chroma_store
```

## ⚠️ Important Notes

- **Never commit `.env` to git** - it contains sensitive information
- **Keep your API key secret** - don't share it publicly
- **The `.env` file should be in `python_backend/` directory** (same folder as `main.py`)

## 🐛 Troubleshooting

**If verify_env.py shows "GOOGLE_API_KEY: Not set":**
1. Make sure `.env` is in `python_backend/` folder
2. Check the file has no extra spaces or quotes
3. Restart the backend after editing `.env`

**If backend still shows warnings:**
1. Make sure `python-dotenv` is installed: `pip install python-dotenv`
2. Check that `load_dotenv()` is called in `main.py` (it is!)
3. Verify the `.env` file format matches the example above

