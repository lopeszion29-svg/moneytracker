import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  ShoppingBag,
  TrendingDown,
  PlusCircle,
  BookmarkPlus
} from 'lucide-react';
import { simulatePurchaseImpact } from '../utils/calculations';
import { formatCurrency, getTodayDateString } from '../utils/formatters';

const PRESET_ITEMS = [
  { name: 'Noise-Cancelling Headphones', price: 2000, category: 'Shopping' },
  { name: 'Concert & Fest Pass', price: 1500, category: 'Other' },
  { name: 'Weekend Outing / Party', price: 850, category: 'Food' },
  { name: 'New Sneakers', price: 2500, category: 'Shopping' },
  { name: 'Semester Lab Manuals', price: 600, category: 'Shopping' },
];

export default function WhatIfSimulator({ 
  netBalance, 
  daysLeft, 
  onAddTransaction,
  onAddGoal 
}) {
  const [itemName, setItemName] = useState('Headphones');
  const [priceInput, setPriceInput] = useState('2000');
  const [category, setCategory] = useState('Shopping');
  const [justCommitted, setJustCommitted] = useState(false);

  const numericPrice = Math.max(0, Number(priceInput) || 0);
  const simulation = simulatePurchaseImpact(netBalance, daysLeft, numericPrice);

  const handleApplyPreset = (item) => {
    setItemName(item.name);
    setPriceInput(String(item.price));
    setCategory(item.category);
    setJustCommitted(false);
  };

  const handleCommitExpense = () => {
    if (!itemName.trim() || numericPrice <= 0) return;

    onAddTransaction({
      title: itemName.trim(),
      amount: numericPrice,
      type: 'expense',
      category: category || 'Shopping',
      date: getTodayDateString(),
    });

    setJustCommitted(true);
    setTimeout(() => setJustCommitted(false), 3000);
  };

  const handleSaveAsGoal = () => {
    if (!itemName.trim() || numericPrice <= 0) return;

    if (onAddGoal) {
      onAddGoal({
        title: itemName.trim(),
        targetAmount: numericPrice,
        currentSaved: 0,
        category: category || 'Shopping',
      });
      alert(`"${itemName}" saved to your Purchase Goals!`);
    }
  };

  const getSeverityBadge = () => {
    switch (simulation.severity) {
      case 'critical':
        return {
          label: 'Unfeasible - Budget Deficit',
          bg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: AlertTriangle,
        };
      case 'severe':
        return {
          label: 'High Daily Squeeze',
          bg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
          icon: AlertCircle,
        };
      case 'moderate':
        return {
          label: 'Moderate Impact',
          bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: AlertCircle,
        };
      default:
        return {
          label: 'Safe to Buy',
          bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: CheckCircle2,
        };
    }
  };

  const badge = getSeverityBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-sky-100 dark:border-slate-700/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-50 dark:border-slate-700/60 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Smart Simulation Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            "What-If" Purchase Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Preview how a big impulse purchase drops your daily pocket money allowance for the rest of the month.
          </p>
        </div>

        <div className={`self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
          <BadgeIcon className="w-4 h-4" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Quick Student Presets:
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_ITEMS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleApplyPreset(item)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                itemName === item.name && priceInput === String(item.price)
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/30'
                  : 'bg-sky-50/60 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-sky-100 dark:border-slate-600 hover:border-sky-300 hover:bg-sky-100/50'
              }`}
            >
              {item.name} ({formatCurrency(item.price)})
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-5 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Item / Wishlist Name
          </label>
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-sky-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Wireless Earbuds"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="sm:col-span-4 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Price (₹)
          </label>
          <div className="relative">
            <span className="text-slate-400 absolute left-3.5 top-2.5 font-bold text-sm">₹</span>
            <input
              type="number"
              min="0"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="2000"
              className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="sm:col-span-3 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Shopping">Shopping</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Water/Utilities">Water/Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Instant Impact Comparison Card */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-sky-50/70 via-white to-sky-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-2 border-sky-200 dark:border-slate-700 space-y-5">
        <div className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center justify-between">
          <span>Instant Impact Breakdown ({daysLeft} days remaining this month)</span>
          <span className="text-slate-400 font-normal">Real-Time Simulation</span>
        </div>

        {/* Side-by-Side Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {/* Current Daily Limit */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-sky-100 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Current Daily Limit
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {formatCurrency(simulation.currentDailyLimit)}
              <span className="text-xs text-slate-400 font-normal"> / day</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Based on {formatCurrency(Math.max(0, netBalance))} balance
            </p>
          </div>

          {/* Arrow / Drop Indicator */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-sky-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs text-rose-500 font-bold flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              Daily Limit Drops By
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
              -{formatCurrency(simulation.limitDrop)}
              <span className="text-xs font-normal"> / day</span>
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300">
              {simulation.percentDrop}% drop in allowance
            </span>
          </div>

          {/* New Daily Limit */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-sky-100 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">
              Projected New Daily Limit
            </span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 ${
              simulation.newDailyLimit < 200 ? 'text-amber-500' : 'text-sky-700 dark:text-sky-300'
            }`}>
              {formatCurrency(simulation.newDailyLimit)}
              <span className="text-xs text-slate-400 font-normal"> / day</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              New balance: {formatCurrency(simulation.newBalance)}
            </p>
          </div>
        </div>

        {/* Verdict Message Banner */}
        <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium ${badge.bg} flex items-start space-x-2.5`}>
          <BadgeIcon className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">{simulation.message}</p>
            <p className="text-xs opacity-90">
              {simulation.canAfford
                ? `If you purchase "${itemName}" today for ${formatCurrency(numericPrice)}, you must restrict your remaining daily spends to ${formatCurrency(simulation.newDailyLimit)} each day to finish the month safely.`
                : `Purchasing this item exceeds your available money by ${formatCurrency(Math.abs(simulation.newBalance))}. Better to save up first!`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {justCommitted ? (
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>Expense logged to your transactions!</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSaveAsGoal}
                disabled={numericPrice <= 0}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-slate-700 text-sky-700 dark:text-sky-200 border border-sky-200 dark:border-slate-600 hover:bg-sky-100 font-medium text-xs sm:text-sm transition-colors disabled:opacity-50"
              >
                <BookmarkPlus className="w-4 h-4 text-sky-600" />
                <span>Save to Purchase Goals</span>
              </button>

              <button
                type="button"
                onClick={handleCommitExpense}
                disabled={numericPrice <= 0}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all disabled:opacity-50 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buy Today & Log Expense</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
