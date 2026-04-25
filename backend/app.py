"""
AI Arena - Flask Backend
Entry point for the application.
"""

from flask import Flask
from flask_cors import CORS
from routes.ask import ask_bp
from routes.auth import auth_bp
from routes.history import history_bp
from database import init_db
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allow requests from React frontend

    # Initialize Database
    init_db()

    # Register blueprints
    app.register_blueprint(ask_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(history_bp)

    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
