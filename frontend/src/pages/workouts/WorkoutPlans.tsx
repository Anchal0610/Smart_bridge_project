import React from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const WorkoutPlans = () => (
  <div className="glass-card p-8">
    <h1 className="text-2xl font-bold mb-4">Workout Plans</h1>
    <LoadingSpinner />
    <p className="text-center text-gray-400 mt-4">Module is being initialized. Your personalized weekly routines will appear here shortly.</p>
  </div>
);

export default WorkoutPlans;
