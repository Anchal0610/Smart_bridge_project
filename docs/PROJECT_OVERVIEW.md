## ArogyaMitra – Project Overview

ArogyaMitra is an AI-driven wellness platform that provides personalized workout planning, nutrition guidance, and coaching.  
The system combines a FastAPI backend, a React (Vite) frontend, and multiple external AI and data providers (Groq, OpenAI, Gemini, YouTube, Spoonacular, Google Calendar).

---

## High-Level Architecture

- **Frontend (React + Vite + Tailwind + Zustand)**
  - SPA that users interact with for:
    - Workout plans and daily routines
    - Nutrition recommendations and meal ideas
    - Health assessment, progress tracking, and dashboard views
    - AI assistant (AROMI coach) interactions
  - Communicates with the backend via RESTful HTTP calls to `VITE_API_BASE_URL` (default: `http://localhost:8000/api`).

- **Backend (FastAPI)**
  - Exposes modular REST APIs under `/api`:
    - `auth` (authentication & authorization)
    - `users` (user profiles and preferences)
    - `workouts` (exercise plans, schedules)
    - `nutrition` (meals, macros, recipes)
    - `progress` (metrics, logs, analytics)
    - `coach` / `chat` (AI coaching and chat flows)
    - `admin`, `health` and other auxiliary routers
  - Integrates with:
    - PostgreSQL (or SQLite in local/dev) via `DATABASE_URL`
    - AI providers (Groq LLaMA-3.3, OpenAI, Gemini)
    - Third‑party APIs (YouTube, Spoonacular, Google Calendar)

- **Database Layer**
  - Defined by `models` and `schemas` in the backend:
    - `User`, workouts, nutrition, progress, and health metrics
  - Accessed via an ORM/session helper in `database.py`.

- **AI & External Integrations**
  - AI models for:
    - Workout and nutrition plan generation
    - Health/coaching conversations
  - YouTube Data API for curated exercise videos.
  - Spoonacular for recipes and nutrition data.
  - Google Calendar API for pushing/pulling scheduled workouts.

---

## Application Flow (End‑to‑End)

1. **User Accesses Frontend**
   - User opens the React app (usually `http://localhost:5173` during development).
   - Frontend reads `VITE_API_BASE_URL` from `.env` and uses it as the base for all API calls.

2. **Authentication & User Session**
   - User logs in or registers via the `auth` endpoints (FastAPI backend).
   - Backend issues tokens or session information (see `app.utils.auth` and auth router).
   - Frontend stores tokens and uses Zustand/localStorage for client-side state.

3. **Profile, Goals, and Preferences**
   - User sets weight, goals, schedule, dietary preferences, and constraints.
   - These are persisted in the database and used as input to AI planning services.

4. **AI-Generated Workout & Nutrition Plans**
   - Frontend calls backend endpoints (e.g., `/api/workouts`, `/api/nutrition`).
   - Backend composes requests to:
     - Groq / OpenAI / Gemini for plan logic and narrative
     - Spoonacular for concrete recipes and nutrition data
     - YouTube API for selected exercise videos
   - Backend aggregates responses and returns a unified plan to the frontend.

5. **Ongoing Coaching & Chat (AROMI)**
   - User interacts with the AI coach via chat endpoints.
   - Backend routes prompts and context to AI providers (Groq, OpenAI, Gemini).
   - Dialog state may be persisted or reconstructed based on user ID, context windows, and database logs.

6. **Progress Tracking & Analytics**
   - Users log completed workouts, meals, and health metrics.
   - Backend writes to progress tables and exposes analytics via `progress` APIs.
   - Frontend visualizes trends, compliance, and goal attainment.

7. **Scheduling & Reminders**
   - Workout sessions can be synced with Google Calendar:
     - Backend performs OAuth OAuth2 flow using Google client credentials.
     - Once authorized, backend can create/update events in the user’s calendar.

---

## Local Development Setup (Summary)

This is a concise summary; for step‑by‑step commands, see the root `README.md` and `SETUP` scripts.

- **Backend**
  - Create a Python virtual environment.
  - Install dependencies from `backend/requirements.txt`.
  - Ensure `backend/.env` is present and filled with correct values.
  - Run FastAPI via Uvicorn on port 8000 (or as configured).

- **Frontend**
  - From `frontend`, run `npm install`.
  - Ensure `frontend/.env` contains `VITE_API_BASE_URL` pointing at the backend (e.g., `http://localhost:8000/api`).
  - Start dev server with `npm run dev`.

- **Orchestrated Startup**
  - Use `start.bat` (Windows) or `start.sh` (macOS/Linux) to:
    - Spin up backend
    - Spin up frontend
    - Ensure services are reachable and CORS is configured via `CORS_ORIGINS`.

---

## Key Modules and Responsibilities

- **Backend**
  - `app/main.py`: FastAPI app factory, router inclusion, middleware.
  - `app/database.py`: Database engine/session creation and dependency.
  - `app/models/*`: ORM models for users and domain entities.
  - `app/schemas/*`: Pydantic schemas for request/response validation.
  - `app/routers/*`: Route handlers for each feature area.
  - `app/utils/auth.py`: Authentication helpers (token generation, hashing, verification).

- **Frontend**
  - `src/main.jsx`: Root React entry, provider configuration.
  - `src/App.jsx`: Main application shell and routing.
  - `src/App.css` / `src/index.css`: Global styles and Tailwind utilities.
  - Zustand stores (where present) manage client state for auth, UI, and domain data.

---

## Deployment Considerations

- **Environment Separation**
  - Use distinct `.env` files or environment-specific configuration for:
    - Development
    - Staging
    - Production
  - Ensure that `DATABASE_URL`, API keys, and frontend `VITE_API_BASE_URL` are environment‑appropriate.

- **Security**
  - Never commit real API keys or secrets to Git.
  - Restrict CORS origins to trusted frontends in non‑dev environments.
  - Use HTTPS and secure cookie/token storage in production.

- **Scalability**
  - Backend can be containerized (Docker) and scaled horizontally.
  - Database should be moved from local SQLite to managed PostgreSQL in production.
  - AI calls may need rate‑limiting, batching, and caching strategies to control cost and latency.

---

## Where to Go Next

- For **API‑level details** (endpoints, request/response shapes, integration patterns), see `API_INTEGRATION_GUIDE.md` in this `docx` folder.
- For **environment variables and secrets** (including where to obtain each key), see `ENVIRONMENT_VARIABLES_GUIDE.md` in this `docx` folder.

