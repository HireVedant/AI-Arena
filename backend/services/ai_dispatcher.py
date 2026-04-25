"""
AI Dispatcher
Runs multiple AI model calls in parallel using ThreadPoolExecutor.
Each model function is isolated — easy to swap mocks for real API calls.
"""

import logging
from concurrent.futures import ThreadPoolExecutor, wait
from services.model_gemini import call_gemini
from services.model_groq import call_groq
from services.model_mistral import call_mistral

logger = logging.getLogger(__name__)

# Map model names to their handler functions
MODEL_REGISTRY = {
    "gemini": call_gemini,
    "groq": call_groq,
    "mistral": call_mistral,
}

# Global thread pool executor to avoid blocking on __exit__ shutdown
# when abandoning slow threads.
executor = ThreadPoolExecutor(max_workers=10)

def dispatch_to_models(query: str, models: list) -> dict:
    """
    Calls each selected model in parallel.
    Returns a dict: { "model_name": { "text": str, "error": str|None } }
    """
    results = {}

    # Submit all tasks
    future_to_model = {
        executor.submit(MODEL_REGISTRY[model], query): model
        for model in models
        if model in MODEL_REGISTRY
    }

    # Wait up to 10 seconds for completion
    done, not_done = wait(future_to_model.keys(), timeout=10.0)

    # Collect successful results and fast failures
    for future in done:
        model_name = future_to_model[future]
        try:
            text = future.result()
            results[model_name] = {"text": text, "error": None}
            logger.info(f"[{model_name}] Response received ({len(text)} chars)")
        except Exception as e:
            logger.error(f"[{model_name}] Error: {e}")
            results[model_name] = {"text": None, "error": str(e)}

    # Mark timeouts
    for future in not_done:
        model_name = future_to_model[future]
        logger.warning(f"[{model_name}] Timeout exceeded. Request took longer than 10s.")
        results[model_name] = {"text": None, "error": "timeout"}

    return results
