import React from 'react';
import { 
  GraduationCap, 
  PlusCircle, 
  Sun, 
  Moon, 
  RotateCcw,
  Sparkles,
  Calendar
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function Navbar({ 
  onOpenAddModal, 
  onResetData, 
  theme, 
  toggleTheme, 
  activeTab, 
  setActiveTab 
}) {
  const todayFormatted = formatDate(new Date().toISOString());

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Student Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-600 to-blue-700 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
                  SmartSpend
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  College Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Budget smarter, live freer on campus
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-sky-50/70 dark:bg-slate-800/60 p-1 rounded-xl border border-sky-100 dark:border-slate-700/50">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>What-If Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'goals'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white'
              }`}
            >
              Goals
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'transactions'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white'
              }`}
            >
              Transactions
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Date Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50/80 dark:bg-slate-800 text-xs font-medium text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-sky-500" />
              <span>{todayFormatted}</span>
            </div>

            {/* Reset Seed Data */}
            <button
              onClick={onResetData}
              title="Reset to Student Sample Transactions"
              className="p-2 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Quick Add Transaction Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium text-sm shadow-md shadow-sky-500/25 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-sky-100/70 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'simulator'
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            What-If
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'goals'
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Goals
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'transactions'
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            History
          </button>
        </div>
      </div>
    </header>
  );
}
