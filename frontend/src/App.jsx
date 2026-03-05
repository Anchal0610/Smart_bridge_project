import Dashboard from './pages/dashboard/Dashboard';
import WorkoutPlans from './pages/workouts/WorkoutPlans';
import NutritionPlans from './pages/nutrition/NutritionPlans';
import HealthAssessment from './pages/health/HealthAssessment';
import ProgressTracking from './pages/progress/ProgressTracking';
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/home/LandingPage';
import APITestPage from './pages/admin/APITestPage';
import AICoachPage from './pages/coach/AICoachPage';

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import BackgroundImage from './components/layout/BackgroundImage';
import ArogyaCoach from './components/ArogyaCoach/ArogyaCoach';
import { useAuthStore } from './stores/authStore';

function App() {
  const user = useAuthStore(state => state.user);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen text-slate-200 flex">
      <BackgroundImage />
      {user && !isHomePage && <Sidebar />}

      <div className="flex-1 flex flex-col min-h-screen">
        {isHomePage && <Navbar />}
        {user && <ArogyaCoach />}

        <main className={`
          ${(isHomePage || isAuthPage) ? "" : "pt-8 pb-20 md:pt-12 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full"}
          ${(user && !isHomePage) ? "md:ml-64" : ""}
        `}>
          <Routes>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/diagnose" element={user ? <APITestPage /> : <Navigate to="/login" />} />
            <Route path="/workouts" element={user ? <WorkoutPlans /> : <Navigate to="/login" />} />
            <Route path="/coach" element={user ? <AICoachPage /> : <Navigate to="/login" />} />
            <Route path="/nutrition" element={user ? <NutritionPlans /> : <Navigate to="/login" />} />
            <Route path="/health" element={user ? <HealthAssessment /> : <Navigate to="/login" />} />
            <Route path="/progress" element={user ? <ProgressTracking /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
