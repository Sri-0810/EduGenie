import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing. Create a .env file from .env.example and add your API key."
    )

client = genai.Client(api_key=API_KEY)

def generate(prompt: str) -> str:
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )
    return (response.text or "").strip()
