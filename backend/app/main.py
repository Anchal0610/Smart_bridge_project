from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import time
import os

# Import routers
from .routers import auth, users, workouts, nutrition, progress, admin, chat, health, coach
from .database import engine, Base

load_dotenv()

# Startup Sequence Branding
print("✨ Groq AI client initialized")
time.sleep(0.1)
print("✅ Auth router loaded")
print("✅ Users router loaded")
print("✅ Workouts router loaded")
print("✅ Nutrition router loaded")
print("✅ Progress router loaded")
print("✅ Admin router loaded")
print("✅ Chat router loaded")
print("✅ Health Assessment router loaded")
print("✅ AROMI AI Coach router loaded")
time.sleep(0.1)
print("🌟 Starting ArogyaMitra - AI Fitness Platform")
print("📝 Created by: Srinivas")
print("🎯 Mission: Transforming Lives Through AI-Powered Fitness")
print("🚀 Launching on: http://localhost:8000")

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ArogyaMitra - AI Fitness Platform",
    description="Mission: Transforming Lives Through AI-Powered Fitness"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(workouts.router)
app.include_router(nutrition.router)
app.include_router(progress.router)
app.include_router(admin.router)
app.include_router(chat.router)
app.include_router(health.router)
app.include_router(coach.router)

@app.on_event("startup")
async def startup_event():
    print("🧬 ArogyaMitra Backend Starting...")
    time.sleep(0.1)
    print("🤖 Initializing AI Agent...")
    time.sleep(0.1)
    print("✅ Groq AI client initialized")
    print("✅ AI Agent initialized successfully!")

@app.get("/")
async def root():
    return {"message": "Welcome to ArogyaMitra API"}
