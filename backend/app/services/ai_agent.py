import groq
import google.generativeai as genai
import httpx
import os
from ..config import get_settings
from googleapiclient.discovery import build

class AIAgent:
    @staticmethod
    async def verify_groq():
        settings = get_settings()
        try:
            client = groq.Groq(api_key=settings.GROQ_API_KEY)
            client.chat.completions.create(
                messages=[{"role": "user", "content": "test"}],
                model="llama-3.3-70b-versatile",
                max_tokens=1
            )
            return True, "Groq AI connection successful"
        except Exception as e:
            return False, f"Groq Error: {str(e)}"

    @staticmethod
    async def verify_gemini():
        settings = get_settings()
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            # Use a verified working free-tier model
            models_to_try = [
                'gemini-flash-latest',
                'gemini-2.5-flash',
                'gemini-1.5-flash',
                'gemini-pro'
            ]

            last_error = ""
            for model_name in models_to_try:
                try:
                    model = genai.GenerativeModel(model_name)
                    model.generate_content("test")
                    return True, f"Gemini AI ({model_name}) successful"
                except Exception as ex:
                    last_error = str(ex)
                    continue

            return False, f"Gemini Error: All models failed. Last error: {last_error}"
        except Exception as e:
            return False, f"Gemini Config Error: {str(e)}"

    @staticmethod
    async def verify_openai():
        settings = get_settings()
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "test"}],
                max_tokens=1
            )
            return True, "OpenAI connection successful"
        except Exception as e:
            return False, f"OpenAI Error: {str(e)}"

    @staticmethod
    async def verify_calendar():
        settings = get_settings()
        try:
            if settings.GOOGLE_CALENDAR_CLIENT_ID and settings.GOOGLE_CALENDAR_CLIENT_SECRET:
                return True, "Google Calendar credentials configured"
            return False, "Google Calendar credentials missing"
        except Exception as e:
            return False, f"Calendar Error: {str(e)}"

    @staticmethod
    async def verify_youtube():
        settings = get_settings()
        try:
            youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)
            youtube.search().list(part="id", q="fitness", maxResults=1).execute()
            return True, "YouTube API connection successful"
        except Exception as e:
            return False, f"YouTube Error: {str(e)}"

    @staticmethod
    async def verify_spoonacular():
        settings = get_settings()
        try:
            # Safely check for attribute if caching is an issue
            api_key = getattr(settings, 'SPOONACULAR_API_KEY', None)
            if not api_key:
                return False, "Spoonacular API Key missing in Settings"

            url = f"https://api.spoonacular.com/recipes/complexSearch?query=pasta&number=1&apiKey={api_key}"
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                if response.status_code == 200:
                    return True, "Spoonacular API connection successful"
                else:
                    return False, f"Spoonacular Error: {response.status_code}"
        except Exception as e:
            return False, f"Spoonacular Error: {str(e)}"
