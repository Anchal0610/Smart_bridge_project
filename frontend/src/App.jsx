import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import WorkoutPlans from './pages/workouts/WorkoutPlans';
import NutritionPlans from './pages/nutrition/NutritionPlans';
import HealthAssessment from './pages/health/HealthAssessment';
import ProgressTracking from './pages/progress/ProgressTracking';
import Navbar from './components/layout/Navbar';
import BackgroundImage from './components/layout/BackgroundImage';
import ArogyaCoach from './components/ArogyaCoach/ArogyaCoach';
import { useAuthStore } from './stores/authStore';

// Temporary Mock Auth Page
const Login = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  const handleLogin = () => {
    setAuth({
      id: '1',
      username: 'user',
      email: 'user@example.com',
      health_tokens: 120,
      credits: 500
    }, 'mock-token');
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-card p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Welcome to ArogyaMitra</h2>
        <button
          onClick={handleLogin}
          className="w-full py-3 premium-gradient rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          Enter Dashboard (Mock Login)
        </button>
      </div>
    </div>
  );
};

function App() {
  const user = useAuthStore(state => state.user);

  return (
    <div className="min-h-screen text-slate-200">
      <BackgroundImage />
      {user && <Navbar />}
      {user && <ArogyaCoach />}
      <main className={user ? "pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto" : ""}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/workouts" element={user ? <WorkoutPlans /> : <Navigate to="/login" />} />
          <Route path="/nutrition" element={user ? <NutritionPlans /> : <Navigate to="/login" />} />
          <Route path="/health" element={user ? <HealthAssessment /> : <Navigate to="/login" />} />
          <Route path="/progress" element={user ? <ProgressTracking /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
