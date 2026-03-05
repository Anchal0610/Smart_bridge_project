from app.config import get_settings
settings = get_settings()
print(f"SPOONACULAR_API_KEY present: {hasattr(settings, 'SPOONACULAR_API_KEY')}")
print(f"GEMINI_API_KEY: {settings.GEMINI_API_KEY[:5]}...")
