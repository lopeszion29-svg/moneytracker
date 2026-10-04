import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import BalanceCards from './components/BalanceCards';
import DailyLimitCard from './components/DailyLimitCard';
import CategoryDonutChart from './components/CategoryDonutChart';
import SpendingBarChart from './components/SpendingBarChart';
import WhatIfSimulator from './components/WhatIfSimulator';
import GoalTracker from './components/GoalTracker';
import AIAdvisor from './components/AIAdvisor';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { INITIAL_TRANSACTIONS, INITIAL_GOALS } from './data/seedData';
import { 
  calculateTotals, 
  calculateDailyLimit, 
  calculateCategoryBreakdown, 
  calculate7DaySpending 
} from './utils/calculations';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // LocalStorage Persistence for Transactions and Goals
  const [transactions, setTransactions] = useLocalStorage(
    'student_expense_transactions_v1',
    INITIAL_TRANSACTIONS
  );

  const [goals, setGoals] = useLocalStorage(
    'student_expense_goals_v1',
    INITIAL_GOALS
  );

  // Computations
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const dailyLimitData = useMemo(
    () => calculateDailyLimit(totals.netBalance),
    [totals.netBalance]
  );
  const categoryBreakdownData = useMemo(
    () => calculateCategoryBreakdown(transactions),
    [transactions]
  );
  const sevenDaySpending = useMemo(
    () => calculate7DaySpending(transactions),
    [transactions]
  );

  // Handlers
  const handleAddTransaction = (newTx) => {
    const transactionWithId = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTransactions((prev) => [transactionWithId, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset tracker to student sample transactions? This will reload 10 realistic campus expense entries.'
      )
    ) {
      setTransactions(INITIAL_TRANSACTIONS);
      setGoals(INITIAL_GOALS);
    }
  };

  const handleAddGoalFromSimulator = (goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goalData.title,
      targetAmount: goalData.targetAmount,
      currentSaved: goalData.currentSaved || 0,
      category: goalData.category || 'Shopping',
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => setIsModalOpen(true)}
        onResetData={handleResetData}
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Quick Balance Indicators */}
            <BalanceCards
              totals={totals}
              transactionCount={transactions.filter((t) => t.type === 'expense').length}
            />

            {/* Highlighted Dynamic Daily Spending Limit Banner */}
            <DailyLimitCard
              dailyLimitData={dailyLimitData}
              netBalance={totals.netBalance}
              spentToday={totals.spentToday}
            />

            {/* Visual Charts Grid: Donut Chart & 7-Day Spending Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryDonutChart
                breakdown={categoryBreakdownData.breakdown}
                totalExpense={categoryBreakdownData.totalExpense}
              />
              <SpendingBarChart
                data={sevenDaySpending}
                dailyLimit={dailyLimitData.dailyLimit}
              />
            </div>

            {/* Smart Feature Modules Showcase on Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Rule-Based AI Advisor */}
              <div className="lg:col-span-7">
                <AIAdvisor
                  totals={totals}
                  dailyLimitData={dailyLimitData}
                  categoryBreakdownData={categoryBreakdownData}
                />
              </div>

              {/* Right Column: Mini Goal Tracker Preview */}
              <div className="lg:col-span-5">
                <GoalTracker
                  goals={goals}
                  onSaveGoals={setGoals}
                  totalIncome={totals.totalIncome}
                  totalExpense={totals.totalExpense}
                  daysPassed={dailyLimitData.daysPassed}
                />
              </div>
            </div>

            {/* Recent Transactions Preview */}
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={() => setIsModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: "WHAT-IF" PURCHASE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-fade-in">
            <WhatIfSimulator
              netBalance={totals.netBalance}
              daysLeft={dailyLimitData.daysLeft}
              onAddTransaction={handleAddTransaction}
              onAddGoal={handleAddGoalFromSimulator}
            />

            {/* Supplemental AI insight context */}
            <AIAdvisor
              totals={totals}
              dailyLimitData={dailyLimitData}
              categoryBreakdownData={categoryBreakdownData}
            />
          </div>
        )}

        {/* TAB 3: PURCHASE GOAL TRACKER */}
        {activeTab === 'goals' && (
          <div className="space-y-6 animate-fade-in">
            <GoalTracker
              goals={goals}
              onSaveGoals={setGoals}
              totalIncome={totals.totalIncome}
              totalExpense={totals.totalExpense}
              daysPassed={dailyLimitData.daysPassed}
            />
          </div>
        )}

        {/* TAB 4: TRANSACTIONS HISTORY */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={() => setIsModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100 dark:border-slate-800 py-6 mt-12 bg-white/50 dark:bg-slate-900/50 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>
          SmartSpend • Smart Expense Tracker for College Students • Made with React, Tailwind CSS & Recharts
        </p>
      </footer>

      {/* Quick Add Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
