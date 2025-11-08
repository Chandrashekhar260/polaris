#!/usr/bin/env python
import os
import uvicorn

if __name__ == "__main__":
    os.chdir("/home/runner/workspace/python_backend")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
