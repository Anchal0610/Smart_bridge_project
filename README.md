# ArogyaMitra – AI-Driven Workout Planning, Nutrition Guidance, and Health Coaching Platform

ArogyaMitra is a comprehensive, AI-powered health and fitness ecosystem designed to provide personalized training, nutrition, and coaching support.

## 🚀 Project Overview
This platform leverages advanced AI models (Groq LLaMA-3.3) and external APIs (YouTube, Spoonacular, Google Calendar) to deliver a seamless and adaptive wellness experience.

## 🛠 Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** React.js (Vite), Tailwind CSS, Zustand
- **Database:** PostgreSQL
- **AI/ML:** Groq LLaMA-3.3-70B, OpenAI
- **Integrations:** YouTube Data API, Spoonacular API, Google Calendar API

---

## 🔐 Environment Configuration

Since sensitive credentials are not pushed to Git, you must manually create `.env` files for both the backend and frontend.

### 🐍 Backend (.env)
Create a file named `.env` in the `/backend` directory and paste the following:

```env
# Database
DATABASE_URL=sqlite:///./arogyamitra.db
SECRET_KEY=arogyamitra-super-secret-key-2024-fitness-ai

# App Settings
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]

# AI Services (Priority: HIGH)
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Google Services
GOOGLE_CALENDAR_CLIENT_ID=your_google_calendar_client_id_here
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_calendar_client_secret_here
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### ⚛️ Frontend (.env)
Create a file named `.env` in the `/frontend` directory and paste the following:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📅 Project Roadmap & Progress

### Epic 1: Environment Setup and Project Initialization
- [x] **Activity 1.1:** Create and activate a Python virtual environment.
- [x] **Activity 1.2:** Set up project folder structure for backend and frontend.
- [x] **Activity 1.3:** Configure backend and frontend .env files with required API keys.
- [x] **Activity 1.4:** Install backend and frontend dependencies.
- [x] **Activity 1.5:** Run backend and frontend servers to verify setup.

### Epic 2: Backend API Development using FastAPI
- [x] **Activity 2.1:** Develop secure authentication endpoints for login and registration.
- [/] **Activity 2.2:** Create modular routers for all backend features.
- [/] **Activity 2.3:** Implement database models for workouts, nutrition, progress, and health.
- [ ] **Activity 2.4:** Add service-layer logic for workout, nutrition, and analytics processing.

### Epic 3: AI Integration with Groq, YouTube, and External API
- [ ] **Activity 3.1:** Integrate Groq LLaMA-3.3-70B for AI-generated plans and coaching.
- [ ] **Activity 3.2:** Connect YouTube API for exercise video retrieval.
- [ ] **Activity 3.3:** Integrate Spoonacular API for nutrition and recipe generation.
- [ ] **Activity 3.4:** Implement Google Calendar API for workout schedule syncing.
- [ ] **Activity 3.5:** Configure AROMI AI Coach for real-time adaptive support.

### Epic 4: React.js Frontend Development
- [ ] **Activity 4.1:** Build responsive dashboard with user fitness insights.
- [ ] **Activity 4.2:** Develop pages for workouts, nutrition, health assessment, and progress.
- [ ] **Activity 4.3:** Implement AROMI AI floating assistant in frontend.
- [ ] **Activity 4.4:** Integrate state management using Zustand and localStorage.

### Epic 5: Testing and Deployment
- [ ] **Activity 5.1:** Perform backend API testing and validation.
- [ ] **Activity 5.2:** Test frontend components and user interactions.
- [ ] **Activity 5.3:** Test backend–frontend API integration with axioms.
- [ ] **Activity 5.4:** Conduct end-to-end user experience and output validation.

## Epic 6: Project Alignment and Documentation
- [x] **Activity 6.1:** Move frontend to root
- [x] **Activity 6.2:** Create documentation files (README, SETUP, etc.)
- [x] **Activity 6.3:** Align backend sub-files

---

## 🛠 Installation & Setup (Auto)

The easiest way to get started is by running the orchestrator script for your OS:

### 🍎 Mac / 🐧 Linux
```bash
chmod +x start.sh start_backend.sh start_frontend.sh
./start.sh
```

### 🪟 Windows
```cmd
start.bat
```

### 🛠️ Individual Services
You can also run the backend or frontend individually if needed:
- **Backend Only**: `./start_backend.sh` or `start_backend.bat`
- **Frontend Only**: `./start_frontend.sh` or `start_frontend.bat`

---

## 🛠 Manual Setup

### Backend
1. Navigate to `/backend`
2. Create venv: `python3.11 -m venv venv`
3. Activate venv: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

### Frontend
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

---

## 👥 Contributors
- **Assigned to:** Nitesh Chourasiya
