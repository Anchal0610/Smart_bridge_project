import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  Database,
  Cpu,
  Youtube,
  Utensils,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Bot,
  Calendar
} from 'lucide-react';
import { adminApi } from '../../services/api';

const APITestPage = () => {
  const [tests, setTests] = useState([
    { id: 'db', name: 'Database Connection', icon: Database, status: 'idle', message: '', action: adminApi.diagnoseDB },
    { id: 'groq', name: 'Groq LLaMA-3.3 AI', icon: Cpu, status: 'idle', message: '', action: adminApi.diagnoseGroq },
    { id: 'openai', name: 'OpenAI ChatGPT', icon: Bot, status: 'idle', message: '', action: adminApi.diagnoseOpenAI },
    { id: 'gemini', name: 'Google Gemini AI', icon: Activity, status: 'idle', message: '', action: adminApi.diagnoseGemini },
    { id: 'youtube', name: 'YouTube Data API', icon: Youtube, status: 'idle', message: '', action: adminApi.diagnoseYouTube },
    { id: 'calendar', name: 'Google Calendar API', icon: Calendar, status: 'idle', message: '', action: adminApi.diagnoseCalendar },
    { id: 'spoon', name: 'Spoonacular Nutrition API', icon: Utensils, status: 'idle', message: '', action: adminApi.diagnoseSpoonacular },
  ]);

  const [isTestRunning, setIsTestRunning] = useState(false);

  const runTest = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    setTests(prev => prev.map(t => t.id === testId ? { ...t, status: 'loading', message: 'Testing...' } : t));

    try {
      const response = await test.action();
      const { success, message } = response.data;
      setTests(prev => prev.map(t => t.id === testId ? {
        ...t,
        status: success ? 'success' : 'error',
        message: message
      } : t));
    } catch (error: any) {
      setTests(prev => prev.map(t => t.id === testId ? {
        ...t,
        status: 'error',
        message: error.response?.data?.detail || 'Connection failed'
      } : t));
    }
  };

  const runAllTests = async () => {
    setIsTestRunning(true);
    for (const test of tests) {
      await runTest(test.id);
    }
    setIsTestRunning(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            System Diagnosis
          </h1>
          <p className="text-gray-400 mt-1">Verify your API environment and service connections.</p>
        </motion.div>

        <button
          onClick={runAllTests}
          disabled={isTestRunning}
          className="premium-gradient px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-black"
        >
          {isTestRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          Run Full System Check
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tests.map((test, idx) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-6 border-l-4 transition-all ${
              test.status === 'success' ? 'border-green-500' :
              test.status === 'error' ? 'border-red-500' :
              test.status === 'loading' ? 'border-cyan-400 animate-pulse' :
              'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  test.status === 'success' ? 'bg-green-500/10 text-green-500' :
                  test.status === 'error' ? 'bg-red-500/10 text-red-500' :
                  'bg-white/5 text-gray-400'
                }`}>
                  <test.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{test.name}</h3>
                  <p className={`text-sm ${
                    test.status === 'success' ? 'text-green-500/80' :
                    test.status === 'error' ? 'text-red-400' :
                    'text-gray-500'
                  }`}>
                    {test.message || 'Waiting for check...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {test.status === 'success' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                {test.status === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
                {test.status === 'loading' && <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />}

                <button
                  onClick={() => runTest(test.id)}
                  disabled={isTestRunning}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                >
                  <RefreshCw className={`w-4 h-4 text-gray-500 group-hover:text-white transition-colors ${test.status === 'loading' ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {test.status === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="text-xs text-red-400 leading-relaxed">
                  <strong>Configuration Required:</strong> Ensure your <code>.env</code> file contains a valid API key for this service and the backend has been restarted.
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 bg-cyan-400/5 border-cyan-400/20">
        <h4 className="font-bold text-cyan-400 flex items-center gap-2 mb-2">
          <ChevronRight className="w-4 h-4" />
          Technical Note
        </h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          These tests perform a lightweight handshake with each external service to verify that your credentials are valid and the network connection is stable. No credits are substantially consumed during this process.
        </p>
      </div>
    </div>
  );
};

export default APITestPage;
