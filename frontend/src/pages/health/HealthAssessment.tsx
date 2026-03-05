import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Activity,
  Heart,
  Scale,
  Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const questions = [
  { id: 'age', label: 'What is your age?', type: 'number', icon: Activity },
  { id: 'gender', label: 'What is your gender?', type: 'select', options: ['Male', 'Female', 'Other'], icon: Heart },
  { id: 'weight', label: 'Current Weight (kg)', type: 'number', icon: Scale },
  { id: 'height', label: 'Height (cm)', type: 'number', icon: Scale },
  { id: 'goal', label: 'What is your primary goal?', type: 'select', options: ['Weight Loss', 'Muscle Gain', 'Endurance', 'General Fitness'], icon: Target },
  { id: 'activity', label: 'Activity Level', type: 'select', options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'], icon: Activity },
  { id: 'medical', label: 'Any medical conditions?', type: 'text', placeholder: 'e.g., Diabetes, Hypertension (or None)', icon: AlertCircle },
  { id: 'allergies', label: 'Food allergies?', type: 'text', placeholder: 'e.g., Dairy, Nuts (or None)', icon: Heart },
  { id: 'injuries', label: 'Current or past injuries?', type: 'text', placeholder: 'e.g., Knee pain, Back injury', icon: AlertCircle },
  { id: 'medications', label: 'Are you taking any medications?', type: 'text', placeholder: 'List here or None', icon: Heart },
  { id: 'workout_pref', label: 'Workout Preference', type: 'select', options: ['Gym', 'Home', 'Outdoor', 'Mixed'], icon: Activity },
  { id: 'diet_pref', label: 'Diet Preference', type: 'select', options: ['No Preference', 'Vegetarian', 'Vegan', 'Keto'], icon: Target },
];

const HealthAssessment = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<any>({});
  const [isCompleted, setIsCompleted] = React.useState(false);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      toast.success('Assessment completed! AI is analyzing your data...');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: any) => {
    setFormData({ ...formData, [questions[currentStep].id]: value });
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold">Assessment Completed!</h2>
          <p className="text-gray-400">
            Thank you for sharing your health details. Our AI Coach (AROMI) is now generating
            a personalized plan for your fitness journey.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="premium-gradient px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Health Assessment</h1>
        <p className="text-gray-400">Step {currentStep + 1} of {questions.length}</p>
        <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full premium-gradient"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-cyan-400/10 rounded-xl">
              <currentQuestion.icon className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold">{currentQuestion.label}</h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'number' && (
              <input
                type="number"
                value={formData[currentQuestion.id] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter value..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
            )}

            {currentQuestion.type === 'text' && (
              <input
                type="text"
                value={formData[currentQuestion.id] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
            )}

            {currentQuestion.type === 'select' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange(option)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData[currentQuestion.id] === option
                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 0 ? 'opacity-0' : 'hover:bg-white/10 text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>

            <button
              onClick={handleNext}
              disabled={!formData[currentQuestion.id]}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                !formData[currentQuestion.id]
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'premium-gradient text-white hover:scale-105 active:scale-95'
              }`}
            >
              {currentStep === questions.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HealthAssessment;
