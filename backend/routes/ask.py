"""
Routes - /ask endpoint
Handles incoming query + model selection, dispatches to services.
"""

from flask import Blueprint, request, jsonify
from services.ai_dispatcher import dispatch_to_models
from services.summarizer import generate_summary
import logging
import json
from database import get_db, get_user_by_token

logger = logging.getLogger(__name__)
ask_bp = Blueprint("ask", __name__)


@ask_bp.route("/ask", methods=["POST"])
def ask():
    """
    POST /ask
    Body: { "query": str, "models": ["gemini", "groq", "mistral"] }
    Returns: { "responses": {...}, "summary": str }
    """
    data = request.get_json()

    # --- Validation ---
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    query = data.get("query", "").strip()
    models = data.get("models", [])

    if not query:
        return jsonify({"error": "query is required"}), 400

    if not models or not isinstance(models, list):
        return jsonify({"error": "models must be a non-empty array"}), 400

    valid_models = {"gemini", "groq", "mistral"}
    invalid = [m for m in models if m not in valid_models]
    if invalid:
        return jsonify({"error": f"Unknown models: {invalid}. Valid: {list(valid_models)}"}), 400

    logger.info(f"Query received: '{query[:60]}...' | Models: {models}")

    # --- Dispatch to AI services in parallel ---
    try:
        responses = dispatch_to_models(query, models)
    except Exception as e:
        logger.error(f"Dispatch error: {e}")
        return jsonify({"error": "Failed to get AI responses"}), 500

    # --- Generate summary ---
    try:
        summary = generate_summary(query, responses)
    except Exception as e:
        logger.warning(f"Summary generation failed: {e}")
        summary = "Summary unavailable."

    logger.info(f"Returning responses for models: {list(responses.keys())}")

    response_data = {
        "responses": responses,
        "summary": summary,
        "final_verdict": summary
    }
    
    if "gemini" in responses:
        response_data["gemini_response"] = responses["gemini"]
    if "groq" in responses:
        response_data["groq_response"] = responses["groq"]
    if "mistral" in responses:
        response_data["mistral_response"] = responses["mistral"]

    # --- Save to history if logged in ---
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        user = get_user_by_token(token)
        if user:
            try:
                conn = get_db()
                conn.execute("INSERT INTO history (user_id, query, models, response_json) VALUES (?, ?, ?, ?)",
                             (user["id"], query, json.dumps(models), json.dumps(responses)))
                conn.commit()
                conn.close()
            except Exception as e:
                logger.error(f"Failed to save history: {e}")

    return jsonify(response_data), 200
