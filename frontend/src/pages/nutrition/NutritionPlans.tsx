import React from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const NutritionPlans = () => (
  <div className="glass-card p-8">
    <h1 className="text-2xl font-bold mb-4">Nutrition & Meal Plans</h1>
    <LoadingSpinner />
    <p className="text-center text-gray-400 mt-4">Cooking up something great... Your 7-day nutritional guidance will be ready soon.</p>
  </div>
);

export default NutritionPlans;
