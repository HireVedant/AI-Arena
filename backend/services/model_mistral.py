import os
from dotenv import load_dotenv

load_dotenv()

def call_mistral(query: str) -> str:
    try:
        from mistralai.client import Mistral
        client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))

        response = client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {"role": "user", "content": query}
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Mistral error: {str(e)}"