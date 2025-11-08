"""
Quick script to reset the rate limit counter
Use this after changing your API key
"""
import os
import json
from pathlib import Path
from datetime import date

# Path to rate limit file
RATE_LIMIT_FILE = Path(__file__).parent / "data" / "rate_limit.json"

def reset_rate_limit():
    """Reset the rate limit counter"""
    try:
        # Create data directory if it doesn't exist
        RATE_LIMIT_FILE.parent.mkdir(parents=True, exist_ok=True)
        
        # Reset the counter
        data = {
            "last_date": date.today().isoformat(),
            "count": 0
        }
        
        with open(RATE_LIMIT_FILE, 'w') as f:
            json.dump(data, f)
        
        print("✅ Rate limit reset successfully!")
        print(f"   File: {RATE_LIMIT_FILE}")
        print(f"   Count: 0/45 (fresh start)")
        print(f"   Date: {data['last_date']}")
        return True
    except Exception as e:
        print(f"❌ Error resetting rate limit: {e}")
        return False

if __name__ == "__main__":
    print("🔄 Resetting rate limit counter...")
    print("   (Use this after changing your API key)\n")
    
    if reset_rate_limit():
        print("\n✅ Done! Your new API key now has 45 fresh API calls available.")
        print("   Restart the backend to use the new key.")
    else:
        print("\n❌ Failed to reset rate limit. Check the error above.")

