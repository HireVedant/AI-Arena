import os
import logging
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_groq(query: str) -> str:
    try:
        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": f"Answer clearly:\n{query}"}
            ]
        )
        return res.choices[0].message.content
    except Exception as e:
        return f"Groq error: {str(e)}"