## API Integration Guide – ArogyaMitra

This document describes how the frontend, backend, and third‑party APIs interact in ArogyaMitra.

---

## 1. Internal APIs (Frontend ↔ Backend)

### 1.1 Base URL and Routing

- **Frontend API base URL**
  - Configured via `frontend/.env`:
    - `VITE_API_BASE_URL=http://localhost:8000/api`
  - All frontend API calls should be made relative to this base URL, for example:
    - `GET ${VITE_API_BASE_URL}/auth/me`
    - `POST ${VITE_API_BASE_URL}/auth/login`
    - `GET ${VITE_API_BASE_URL}/workouts`

- **Backend root**
  - Typically served at `http://localhost:8000`
  - API routes are namespaced under `/api` in `app/main.py`.

### 1.2 Core Backend Routers

The FastAPI backend is split into modular routers under `app/routers`:

- `auth.py`
  - Endpoints for registration, login, logout, token refresh, and password handling.
  - Uses `SECRET_KEY` and token expiry configuration for JWT or similar schemes.

- `users.py`
  - CRUD operations for user profiles (name, age, weight, goals, preferences).
  - Often used immediately after signup to complete user onboarding.

- `workouts.py`
  - Endpoints for:
    - Generating AI‑driven workout plans.
    - Fetching exercise sessions and schedules.
    - Marking workouts as completed or skipped.

- `nutrition.py`
  - Endpoints for:
    - Generating meal plans and recipes.
    - Retrieving nutritional breakdowns.
    - Integrating results from Spoonacular.

- `progress.py`
  - Endpoints for logging and analyzing:
    - Weight changes
    - Workout adherence
    - Other health metrics

- `coach.py` / `chat.py`
  - Conversational AI coaching endpoints.
  - Accept user messages/prompts and return AI‑generated responses.

- `admin.py`
  - Admin and maintenance endpoints (user management, system checks, etc.).

- `health.py`
  - Simple health check endpoints (e.g., `/health` or `/api/health`) to verify backend status.

---

## 2. AI Provider Integrations

Multiple LLM providers can be configured through environment variables. The backend selects one or more providers depending on the feature.

### 2.1 Groq LLaMA‑3.3

- **Purpose**
  - Primary AI model for:
    - Workout generation.
    - Nutrition advice text.
    - Coaching conversations.

- **Configuration**
  - Environment variable:
    - `GROQ_API_KEY`
  - Typical usage pattern (conceptual):
    - Backend composes a prompt containing:
      - User profile and goals.
      - Past progress context.
      - Any guardrail/system instructions.
    - Sends it to Groq’s API endpoint with the key in the headers.
    - Receives and returns structured data/text to the frontend.

### 2.2 OpenAI

- **Purpose**
  - Alternative or fallback LLM provider.
  - May be used for:
    - Chat, summarization, or specific AI tasks where OpenAI models are preferred.

- **Configuration**
  - Environment variable:
    - `OPENAI_API_KEY`

### 2.3 Gemini

- **Purpose**
  - Additional AI model provider that can be toggled for experimentation or specific features.

- **Configuration**
  - Environment variable:
    - `GEMINI_API_KEY`

---

## 3. External Data APIs

### 3.1 YouTube Data API (Exercise Videos)

- **Purpose**
  - Retrieve exercise/video content to match generated workouts.

- **Configuration**
  - Environment variable:
    - `YOUTUBE_API_KEY`

- **Typical Flow**
  - Backend receives a request for a workout plan.
  - After generating the workout structure via AI, the backend:
    - Queries YouTube with search terms like muscle group, difficulty, equipment, etc.
    - Filters and formats video links.
  - Returns both workout structure and associated video URLs to the frontend.

### 3.2 Spoonacular API (Recipes & Nutrition)

- **Purpose**
  - Generate real recipes and obtain macro/micro‑nutrient data to support AI‑proposed meal plans.

- **Configuration**
  - Commonly requires:
    - `SPOONACULAR_API_KEY` (name may vary; ensure it matches backend code).

- **Typical Flow**
  - AI determines the macronutrient target and meal pattern.
  - Backend calls Spoonacular to:
    - Find recipes matching calorie/macros and dietary constraints.
    - Fetch nutritional breakdowns.
  - Backend merges AI logic with Spoonacular data and returns a coherent meal plan.

### 3.3 Google Calendar API (Workout Scheduling)

- **Purpose**
  - Sync workout schedules into the user’s personal Google Calendar.

- **Configuration**
  - Environment variables:
    - `GOOGLE_CALENDAR_CLIENT_ID`
    - `GOOGLE_CALENDAR_CLIENT_SECRET`
    - `GOOGLE_CALENDAR_REDIRECT_URI`

- **Typical Flow**
  1. Frontend triggers “Connect Google Calendar”.
  2. Backend redirects user to Google’s OAuth2 consent page using client ID and redirect URI.
  3. After user consents, Google redirects back to `GOOGLE_CALENDAR_REDIRECT_URI` with an authorization code.
  4. Backend exchanges the code for access/refresh tokens using the client secret.
  5. Backend uses those tokens to create or update events for each scheduled workout.

---

## 4. Frontend Integration Patterns

### 4.1 HTTP Client

- Typically implemented via `fetch` or `axios` in React.
- Base URL is always `import.meta.env.VITE_API_BASE_URL`.
- Common patterns:
  - Attach auth token (e.g., Bearer token) in `Authorization` headers.
  - Handle error responses by inspecting HTTP status codes (401, 403, 500, etc.).

### 4.2 State Management

- Zustand is used for:
  - Storing authentication state (tokens, current user).
  - Caching current plans (workouts/nutrition).
  - UI flags such as loading indicators, errors, and active views.

---

## 5. CORS & Security Considerations

- Backend must allow the frontend origin(s) via `CORS_ORIGINS` in `.env`, e.g.:
  - `CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]`
- In production:
  - Restrict CORS to the actual deployed frontend domains.
  - Serve backend over HTTPS.
  - Prefer secure cookies or secure storage mechanisms for tokens.

---

## 6. Testing API Integrations

- **Local Testing**
  - Use `test_api.html`, `curl`, Postman, or VS Code REST client to:
    - Hit `http://localhost:8000/api/...` endpoints.
    - Verify that authentication works and CORS headers are present.

- **Mocking External Providers**
  - For development without real API keys:
    - Mock Groq/OpenAI/Gemini responses in backend code.
    - Use fake data for YouTube/Spoonacular/Google Calendar.

- **Health Check**
  - Access the `health` router endpoints to verify that the backend instance is running and reachable.

---

## 7. Where to Configure / Inspect Integrations

- **Backend**
  - `app/main.py` – includes routers and global middleware (CORS).
  - `app/routers/*.py` – feature‑specific API endpoints and business logic.
  - `app/config.py` – centralized configuration and environment variable loading.

- **Frontend**
  - `frontend/.env` – contains `VITE_API_BASE_URL`.
  - API service utilities (if present) – centralize HTTP calls.

For a complete list of environment variables and how to obtain them, see `ENVIRONMENT_VARIABLES_GUIDE.md` in this `docx` folder.

