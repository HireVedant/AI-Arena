from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from database import get_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    if existing:
        conn.close()
        return jsonify({"error": "Username already exists"}), 400

    pwd_hash = generate_password_hash(password)
    token = secrets.token_hex(32)
    
    conn.execute("INSERT INTO users (username, password_hash, session_token) VALUES (?, ?, ?)", 
                 (username, pwd_hash, token))
    conn.commit()
    user_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    conn.close()

    return jsonify({"token": token, "username": username, "userId": user_id}), 201

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    
    if user and check_password_hash(user["password_hash"], password):
        # Generate new session token
        token = secrets.token_hex(32)
        conn.execute("UPDATE users SET session_token = ? WHERE id = ?", (token, user["id"]))
        conn.commit()
        conn.close()
        return jsonify({"token": token, "username": username, "userId": user["id"]}), 200
    
    conn.close()
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/auth/logout", methods=["POST"])
def logout():
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        conn = get_db()
        conn.execute("UPDATE users SET session_token = NULL WHERE session_token = ?", (token,))
        conn.commit()
        conn.close()
    return jsonify({"success": True}), 200
