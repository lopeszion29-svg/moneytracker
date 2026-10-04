import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { getTodayDateString, formatCurrency } from '../utils/formatters';

const STUDENT_QUICK_PRESETS = [
  { title: 'Canteen Meals', amount: 150, type: 'expense', category: 'Food' },
  { title: 'Metro Recharge', amount: 200, type: 'expense', category: 'Travel' },
  { title: 'Photocopies & Notes', amount: 80, type: 'expense', category: 'Other' },
  { title: 'Coffee & Snacks', amount: 120, type: 'expense', category: 'Food' },
  { title: 'Parent Allowance', amount: 5000, type: 'income', category: 'Other' },
];

export default function TransactionModal({ isOpen, onClose, onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(getTodayDateString());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(getTodayDateString());
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title or description is required';
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount)) {
      errs.amount = 'Please enter a valid amount';
    } else if (numAmount <= 0) {
      errs.amount = 'Amount must be greater than zero';
    }

    if (!date) {
      errs.date = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddTransaction({
      title: title.trim(),
      amount: Number(amount),
      type,
      category: type === 'income' ? 'Other' : category,
      date,
    });

    onClose();
  };

  const handleQuickAdd = (preset) => {
    setType(preset.type);
    setTitle(preset.title);
    setAmount(String(preset.amount));
    setCategory(preset.category);
    setErrors({});
  };

  const handleAmountIncrement = (inc) => {
    const current = Number(amount) || 0;
    setAmount(String(current + inc));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: null }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-700 space-y-5 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-50 dark:border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Log New Transaction
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep your student budget accurate and up to date
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quick Tap Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STUDENT_QUICK_PRESETS.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => handleQuickAdd(p)}
                className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-sky-700 dark:text-sky-300 font-medium transition-colors border border-sky-100 dark:border-slate-600"
              >
                {p.title} ({formatCurrency(p.amount)})
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Other') setCategory('Food');
              }}
              className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Expense (Spend)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Other');
              }}
              className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Income (Allowance)</span>
            </button>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              placeholder={type === 'expense' ? 'e.g., Canteen Lunch with Friends' : 'e.g., Allowance from Mom & Dad'}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${
                errors.title ? 'border-rose-400' : 'border-sky-100 dark:border-slate-700'
              } text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-medium flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Amount with Shortcut Increment buttons */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Amount (₹)
              </label>
              <div className="flex items-center space-x-1">
                {[50, 100, 200, 500, 1000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => handleAmountIncrement(inc)}
                    className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-sky-50 dark:bg-slate-700 text-sky-600 dark:text-sky-300 hover:bg-sky-100 border border-sky-100 dark:border-slate-600"
                  >
                    +{inc}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <span className="text-slate-400 absolute left-3.5 top-2.5 font-bold text-sm">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                }}
                placeholder="250"
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${
                  errors.amount ? 'border-rose-400' : 'border-sky-100 dark:border-slate-700'
                } text-base font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-rose-500 font-medium flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Category (for Expense) & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {type === 'expense' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1 text-sky-500" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={`space-y-1 ${type === 'income' ? 'sm:col-span-2' : ''}`}>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-sky-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-sky-50 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-500/25'
              }`}
            >
              Add {type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
