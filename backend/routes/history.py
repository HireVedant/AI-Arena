from flask import Blueprint, request, jsonify
from database import get_db, get_user_by_token
import json

history_bp = Blueprint("history", __name__)

@history_bp.route("/history", methods=["GET"])
def get_history():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    user = get_user_by_token(token)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    # Fetch history descending by time
    rows = conn.execute("SELECT query, models, response_json, timestamp FROM history WHERE user_id = ? ORDER BY timestamp DESC", (user["id"],)).fetchall()
    conn.close()

    history_list = []
    for row in rows:
        history_list.append({
            "query": row["query"],
            "models": json.loads(row["models"]),
            "responses": json.loads(row["response_json"]),
            "timestamp": row["timestamp"]
        })

    return jsonify({"history": history_list}), 200
