import os
import logging
from google import genai
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# create client (NEW WAY)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def call_gemini(query: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=f"Answer clearly and factually:\n{query}"
        )
        return response.text
    except Exception as e:
        return f"Gemini error: {str(e)}"