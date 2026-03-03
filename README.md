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
- [ ] ** ] **Activity 5.2:** Test frontend components and user interactions.
- [ ] **Activity 5.3:** Test backend–frontend API integration with axioms.
- [ ] **Activity 5.4:** Conduct end-to-end user experience and output validation.

---

## 🛠 Installation & Setup

### Backend
1. Navigate to `/backend`
2. Create venv: `python3.11 -m venv venv`
3. Activate venv: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `python -m uvicorn app.main:app --reload`

### Frontend
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

---

## 👥 Contributors
- **Assigned to:** Nitesh Chourasiya
