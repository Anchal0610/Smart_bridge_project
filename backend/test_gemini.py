import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load from root .env
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

def test_gemini_models():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in .env")
        return

    print(f"Using API Key: {api_key[:10]}...")
    genai.configure(api_key=api_key)

    models_to_test = [
        'gemini-flash-latest',
        'gemini-flash-lite-latest',
        'gemini-pro-latest',
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-2.5-pro'
    ]

    print("\n--- Model Availability Test ---")
    available_models = []
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
                print(f"✅ Found: {m.name}")
    except Exception as e:
        print(f"❌ Error listing models: {e}")

    print("\n--- Functional Test ---")
    for model_name in models_to_test:
        full_name = f"models/{model_name}" if not model_name.startswith("models/") else model_name
        print(f"Testing {full_name}...", end=" ", flush=True)
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello, respond with 'OK'")
            print(f"✅ SUCCESS: {response.text.strip()}")
            print(f"\n✨ RECOMMENDED MODEL FOR CODEBASE: {model_name}")
            return # Stop after first success
        except Exception as e:
            print(f"❌ FAILED: {str(e)}")

if __name__ == "__main__":
    test_gemini_models()
