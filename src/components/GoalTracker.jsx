import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  Coins, 
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function GoalTracker({ 
  goals = [], 
  onSaveGoals, 
  totalIncome, 
  totalExpense, 
  daysPassed 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newCategory, setNewCategory] = useState('Shopping');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate Average Daily Savings Rate: (Income - Expenses) / Days Passed
  const netSavings = totalIncome - totalExpense;
  const safeDaysPassed = Math.max(1, daysPassed);
  const dailySavingsRate = netSavings / safeDaysPassed;
  const isSavingPositive = dailySavingsRate > 0;

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setErrorMsg('Please enter a goal title.');
      return;
    }
    const target = Number(newTarget);
    const initialSaved = Number(newCurrent) || 0;

    if (isNaN(target) || target <= 0) {
      setErrorMsg('Target amount must be greater than ₹0.');
      return;
    }
    if (initialSaved < 0 || initialSaved > target) {
      setErrorMsg('Initial saved amount cannot exceed target.');
      return;
    }

    const newGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      targetAmount: target,
      currentSaved: initialSaved,
      category: newCategory,
      createdAt: new Date().toISOString(),
    };

    onSaveGoals([newGoal, ...goals]);
    setNewTitle('');
    setNewTarget('');
    setNewCurrent('');
    setErrorMsg('');
    setShowAddModal(false);

    if (initialSaved >= target) {
      triggerConfetti();
    }
  };

  const handleAddDeposit = (goalId, amount) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const nextSaved = Math.min(g.targetAmount, g.currentSaved + amount);
        if (nextSaved >= g.targetAmount && g.currentSaved < g.targetAmount) {
          triggerConfetti();
        }
        return { ...g, currentSaved: nextSaved };
      }
      return g;
    });
    onSaveGoals(updated);
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to remove this savings goal?')) {
      onSaveGoals(goals.filter((g) => g.id !== goalId));
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#38bdf8', '#60a5fa', '#34d399', '#f59e0b'],
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-sky-100 dark:border-slate-700/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-50 dark:border-slate-700/60 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 mb-1.5">
            <Target className="w-3.5 h-3.5 text-sky-500" />
            <span>Student Savings Targets</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Purchase Goal Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Set student targets and estimate when you can afford them based on your daily savings rate.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Savings Rate Formula Banner */}
      <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-900 border border-sky-100 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Daily Savings Rate
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-baseline space-x-1.5">
              <span>{formatCurrency(Math.max(0, Math.round(dailySavingsRate)))}</span>
              <span className="text-xs text-slate-400 font-normal">/ day</span>
              <span className="text-xs font-medium text-sky-600 dark:text-sky-400 ml-2">
                (Savings ÷ {safeDaysPassed} days passed)
              </span>
            </div>
          </div>
        </div>

        {!isSavingPositive && (
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-1 shrink-0" />
            <span>Currently in deficit! Reduce expenses to unlock savings velocity.</span>
          </div>
        )}
      </div>

      {/* Goal Cards Grid */}
      {goals.length === 0 ? (
        <div className="p-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
          <Target className="w-12 h-12 text-sky-300 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-medium">No purchase goals created yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Create your first goal (e.g. New Shoes, Gaming Mouse, Weekend Trip)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const remainingNeeded = Math.max(0, goal.targetAmount - goal.currentSaved);
            const progress = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
            const isCompleted = goal.currentSaved >= goal.targetAmount;

            // Estimated days calculation: (Target - Saved) / Daily Savings Rate
            let estimatedDays = null;
            let estDateStr = null;

            if (isCompleted) {
              estimatedDays = 0;
            } else if (isSavingPositive && dailySavingsRate > 0) {
              estimatedDays = Math.ceil(remainingNeeded / dailySavingsRate);
              const estDate = new Date();
              estDate.setDate(estDate.getDate() + estimatedDays);
              estDateStr = formatDate(estDate.toISOString());
            }

            return (
              <div
                key={goal.id}
                className="bg-slate-50/60 dark:bg-slate-900/60 p-5 rounded-2xl border border-sky-100 dark:border-slate-700/60 space-y-4 hover:border-sky-200 transition-colors relative group"
              >
                {/* Delete Goal Button */}
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  title="Delete Goal"
                  className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-start justify-between pr-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {goal.category || 'Shopping'}
                    </span>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mt-1">
                      {goal.title}
                    </h3>
                  </div>

                  {isCompleted && (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Reached! 🎉
                    </span>
                  )}
                </div>

                {/* Progress Bar & Amounts */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Saved: <strong className="text-sky-600 dark:text-sky-400 font-bold">{formatCurrency(goal.currentSaved)}</strong>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Target: <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatCurrency(goal.targetAmount)}</strong>
                    </span>
                  </div>

                  <div className="w-full h-3 bg-sky-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-sky-500 to-blue-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{progress}% funded</span>
                    <span>{formatCurrency(remainingNeeded)} needed</span>
                  </div>
                </div>

                {/* Estimated Days to Reach Goal */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 text-xs flex items-center justify-between">
                  <div className="flex items-center text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
                    <span>Estimated Completion:</span>
                  </div>

                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {isCompleted ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Ready to purchase!</span>
                    ) : estimatedDays !== null ? (
                      <span className="text-sky-700 dark:text-sky-300">
                        ~{estimatedDays} days ({estDateStr})
                      </span>
                    ) : (
                      <span className="text-amber-500">Savings paused</span>
                    )}
                  </div>
                </div>

                {/* Quick Add Deposit Chips */}
                {!isCompleted && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Add to Goal:
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {[100, 250, 500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAddDeposit(goal.id, amt)}
                          className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-slate-700 dark:text-sky-300 border border-sky-200 dark:border-slate-600 transition-colors"
                        >
                          +{formatCurrency(amt)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-sky-50 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-sky-500" />
                <span>Create Purchase Goal</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Goal Name (e.g. New Shoes, Gaming Headset)
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Semester Fest Outfit"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="3000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Initial Saved (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Shopping">Shopping</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food & Treats</option>
                  <option value="Water/Utilities">Water/Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-sky-50 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl shadow-md shadow-sky-500/25"
                >
                  Create Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
