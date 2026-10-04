import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function BalanceCards({ totals, transactionCount }) {
  const { totalIncome, totalExpense, netBalance } = totals;
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(0) : 0;
  const isHealthy = netBalance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Total Income Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Total Income
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/40">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalIncome)}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              Allowance & Stipend
            </span>
            <span>• Active Month</span>
          </div>
        </div>
      </div>

      {/* Total Expense Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-sky-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Total Expenses
          </span>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/40">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalExpense)}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-medium">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {transactionCount} logged items
            </span>
            <span>• Spent so far</span>
          </div>
        </div>
      </div>

      {/* Net Balance Card (Primary Light Blue Themed Hero Card) */}
      <div className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-800 dark:to-sky-950/30 rounded-2xl p-5 border-2 border-sky-200 dark:border-sky-800/80 shadow-md shadow-sky-500/5 hover:shadow-lg transition-all relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-wider uppercase text-sky-800 dark:text-sky-300">
            Net Campus Balance
          </span>
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <div className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isHealthy 
              ? 'text-sky-900 dark:text-sky-100' 
              : 'text-rose-600 dark:text-rose-400'
          }`}>
            {formatCurrency(netBalance)}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-full ${
              isHealthy 
                ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200' 
                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
            }`}>
              {isHealthy ? 'Surplus Reserve' : 'Deficit / Overdraft'}
            </span>
            <span className="text-slate-500 dark:text-slate-400 flex items-center">
              <PiggyBank className="w-3.5 h-3.5 mr-1 text-sky-500" />
              {savingsRate}% saved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
