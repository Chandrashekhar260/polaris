"""
Quick script to verify .env configuration
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("🔍 Checking environment variables...\n")

# Check GOOGLE_API_KEY
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    # Mask the key for security
    masked_key = api_key[:8] + "..." + api_key[-4:] if len(api_key) > 12 else "***"
    print(f"✅ GOOGLE_API_KEY: {masked_key}")
    print("   Status: Configured ✓")
else:
    print("⚠️  GOOGLE_API_KEY: Not set")
    print("   Status: Will run in mock mode")
    print("   Get your free key from: https://aistudio.google.com/")

# Check BACKEND_PORT
port = os.getenv("BACKEND_PORT", "8000")
print(f"\n✅ BACKEND_PORT: {port}")

# Check CHROMA_DB_PATH
db_path = os.getenv("CHROMA_DB_PATH", "./db/chroma_store")
print(f"✅ CHROMA_DB_PATH: {db_path}")

print("\n" + "="*50)
if api_key:
    print("✅ All set! Your .env is configured correctly.")
    print("   You can now start the backend with full AI features.")
else:
    print("⚠️  Warning: GOOGLE_API_KEY not set")
    print("   The backend will work but with limited AI functionality.")
    print("   Set GOOGLE_API_KEY in .env for full features.")
print("="*50)

