from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

def get_llm():
    """
    Returns the configured Google Gemini LLM instance.
    """
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-pro-latest",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.2,
        convert_system_message_to_human=True # Necessary for Gemini in some LC versions
    )

llm = get_llm()
