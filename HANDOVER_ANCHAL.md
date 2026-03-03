# 🤝 Handover Document: Anchal Gupta

Welcome to the **ArogyaMitra** project! I have been working on the foundation and initial backend structure. You are now assigned to lead the development of **Epic 2**.

## 🔴 CRITICAL: AI Assistant Rules
> [!IMPORTANT]
> Your AI coding assistant is set to **READ-ONLY / SUGGESTION MODE**.
> To maintain full control over the codebase, the AI is **not allowed to make direct changes** to the code. It should only provide code snippets, logic explanations, and architectural suggestions in the chat. You should review and apply the changes yourself.

---

## 🚀 Getting Started
1. **Pull the latest changes**: `git pull origin main`
2. **Setup**: Use the orchestrator script in the root directory:
   - **Mac/Linux**: `./start.sh`
   - **Windows**: `start.bat`
   *This will open two separate terminal windows for Backend and Frontend and handle all installations.*

---

## 🛠 Current System Architecture
- **Framework**: FastAPI (Modular Router Pattern)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Security**: JWT-based authentication
- **Folder Structure**:
  - `backend/app/routers/`: API endpoints (modularized).
  - `backend/app/models/`: SQLAlchemy database models.
  - `backend/app/schemas/`: Pydantic models for validation.
  - `backend/app/services/`: Business logic and AI integrations.

---

## 📋 Assigned Activities (Epic 2)

### 🔹 Activity 2.1: Secure Authentication
**Goal**: Finalize registration and login.
- I have already implemented the base logic in `backend/app/routers/auth.py`.
- **Task**: Implement the "Password Reset" functionality and ensure all routes are properly protected using `get_current_user` dependency.

### 🔹 Activity 2.2: Modular Routers
**Goal**: Organise the backend into clean features.
- I have created **stub routers** for Workouts, Nutrition, Progress, Health, AI Coach, and Admin.
- **Task**: Transition these from stubs to active endpoints.

### 🔹 Activity 2.3: Database Models
**Goal**: Implement SQLAlchemy schemas.
- **Task**: Create the following models in `backend/app/models/`:
  - `WorkoutPlan`, `Exercise`, `NutritionPlan`, `Meal`, `HealthAssessment`, `ProgressRecord`, `ChatSession`.
  - Ensure proper relationships (ForeignKeys) with the `User` model.

### 🔹 Activity 2.4: Service-Layer Logic
**Goal**: Separate business logic from APIs.
- **Task**: Move complex logic (e.g., calorie calculations, nutrition distribution, YouTube API fetching) into `backend/app/services/`.
- **Integration**: Leverage the `ai_agent.py` for Groq LLaMA-3.3 reasoning.

---

## 🎨 Styling & Design
The user expects a **Premium, State-of-the-art UI**.
- Use **Vibrant Colors**, **Glassmorphism**, and **Dynamic Animations**.
- Never use simple placeholders; use `generate_image` or actual assets.

Good luck, Anchal! The foundation is solid and ready for your touch.
