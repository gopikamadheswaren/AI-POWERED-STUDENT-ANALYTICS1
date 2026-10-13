"""
AI Student Analytics & Success Platform
Main application entry point for ByteXL Nimbus, Docker, and Cloud Deployment.
"""

import os
import sys
from app import app, init_db

def main():
    # Ensure database is initialized
    init_db()

    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")

    print("=" * 65)
    print(" 🚀 AI Student Analytics & Success Platform Starting...")
    print("=" * 65)
    print(f" Environment : {'ByteXL Nimbus / Cloud' if os.environ.get('STUDIO_HOST') else 'Production / Local'}")
    print(f" Local URL   : http://localhost:{port}")
    print(f" Network URL : http://{host}:{port}")
    print(f" Studio Host : {os.environ.get('STUDIO_HOST', 'N/A')}")
    print(" Status      : Ready to accept requests")
    print("=" * 65)

    app.run(host=host, port=port, debug=False)

if __name__ == "__main__":
    main()
