"""
Rate Limiter Service - Tracks and limits API calls to stay within quota
"""
import os
import json
from datetime import datetime, date
from pathlib import Path
from typing import Tuple

# Daily limit for Gemini API free tier
DAILY_LIMIT = 45  # Keep it under 50 to be safe

# File to store rate limit data
RATE_LIMIT_FILE = Path(__file__).parent.parent / "data" / "rate_limit.json"

class RateLimiter:
    """Rate limiter for API calls"""
    
    def __init__(self):
        """Initialize rate limiter"""
        self.data_dir = RATE_LIMIT_FILE.parent
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self._load_data()
    
    def _load_data(self):
        """Load rate limit data from file"""
        if RATE_LIMIT_FILE.exists():
            try:
                with open(RATE_LIMIT_FILE, 'r') as f:
                    data = json.load(f)
                    self.last_date = data.get("last_date", "")
                    self.count = data.get("count", 0)
            except Exception as e:
                print(f"Error loading rate limit data: {e}")
                self._reset()
        else:
            self._reset()
        
        # Reset if it's a new day
        today = date.today().isoformat()
        if self.last_date != today:
            self._reset()
            self.last_date = today
    
    def _reset(self):
        """Reset counter for new day"""
        self.last_date = date.today().isoformat()
        self.count = 0
        self._save_data()
    
    def _save_data(self):
        """Save rate limit data to file"""
        try:
            with open(RATE_LIMIT_FILE, 'w') as f:
                json.dump({
                    "last_date": self.last_date,
                    "count": self.count
                }, f)
        except Exception as e:
            print(f"Error saving rate limit data: {e}")
    
    def can_make_request(self) -> Tuple[bool, str]:
        """
        Check if we can make an API request
        
        Returns:
            Tuple of (can_request: bool, message: str)
        """
        if self.count >= DAILY_LIMIT:
            remaining = 0
            reset_time = "midnight"
            return False, f"Daily API limit reached ({DAILY_LIMIT}/{DAILY_LIMIT}). Limit resets at midnight. Using mock responses."
        
        remaining = DAILY_LIMIT - self.count
        return True, f"API calls remaining today: {remaining}/{DAILY_LIMIT}"
    
    def record_request(self):
        """Record that an API request was made"""
        self.count += 1
        self._save_data()
        remaining = DAILY_LIMIT - self.count
        if remaining <= 5:
            print(f"⚠️  Warning: Only {remaining} API calls remaining today!")
    
    def undo_request(self):
        """Undo a recorded request (e.g., if it failed due to quota)"""
        if self.count > 0:
            self.count -= 1
            self._save_data()
    
    def reset(self):
        """Manually reset the rate limit counter (for testing or new API key)"""
        self._reset()
        print(f"✅ Rate limit reset - {DAILY_LIMIT} API calls available")
    
    def get_status(self) -> dict:
        """Get current rate limit status"""
        return {
            "count": self.count,
            "limit": DAILY_LIMIT,
            "remaining": max(0, DAILY_LIMIT - self.count),
            "last_date": self.last_date,
            "can_request": self.count < DAILY_LIMIT
        }

# Singleton instance
_rate_limiter_instance = None

def get_rate_limiter():
    """Get rate limiter singleton"""
    global _rate_limiter_instance
    if _rate_limiter_instance is None:
        _rate_limiter_instance = RateLimiter()
    return _rate_limiter_instance

