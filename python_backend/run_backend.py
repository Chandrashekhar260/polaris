#!/usr/bin/env python
import os
import uvicorn
from pathlib import Path

if __name__ == "__main__":
    # Change to the directory where this script is located
    script_dir = Path(__file__).parent.resolve()
    os.chdir(script_dir)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
