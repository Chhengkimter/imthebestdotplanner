import React, { useState } from 'react';
import { useFinance } from '../FinanceContext';

export const SavingsGoals = () => {
  const { goals, addGoal, updateGoalProgress, toggleGoalStep } = useFinance();
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const handleAddGoal = () => {
    if (newGoalName && newGoalTarget) {
      addGoal(newGoalName, parseFloat(newGoalTarget));
      setNewGoalName('');
      setNewGoalTarget('');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Savings Goals</h2>
      </div>

      {/* Add New Goal Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Goal</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Goal name (e.g., New Camera)"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
          />
          <input
            type="number"
            placeholder="Target amount"
            value={newGoalTarget}
            onChange={(e) => setNewGoalTarget(e.target.value)}
            min="0"
            step="100"
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={handleAddGoal}
            className="px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-300 text-white rounded-lg font-semibold text-sm hover:shadow-md transition"
          >
            Create Goal
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          const completedSteps = goal.steps.filter(s => s.completed).length;
          const totalSteps = goal.steps.length;

          return (
            <div
              key={goal.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.title}</h3>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">
                    ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-purple-600">{progress.toFixed(0)}%</p>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-300 transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Checkable Steps */}
              {totalSteps > 0 && (
                <div className="mb-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Steps ({completedSteps}/{totalSteps})
                  </p>
                  <div className="space-y-2">
                    {goal.steps.map(step => (
                      <label
                        key={step.id}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={step.completed}
                          onChange={() => toggleGoalStep(goal.id, step.id)}
                          className="w-4 h-4 accent-purple-400"
                        />
                        <span
                          className={`ml-2 text-sm transition ${
                            step.completed
                              ? 'text-gray-400 line-through'
                              : 'text-gray-700 group-hover:text-gray-900'
                          }`}
                        >
                          {step.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Update Current Amount */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Update Progress
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="New amount"
                    min="0"
                    max={goal.target}
                    step="50"
                    defaultValue={goal.current}
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateGoalProgress(goal.id, parseFloat(e.target.value));
                      }
                    }}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      if (input.value) {
                        updateGoalProgress(goal.id, parseFloat(input.value));
                        input.value = goal.current;
                      }
                    }}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-semibold hover:bg-purple-200 transition"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No goals yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};
