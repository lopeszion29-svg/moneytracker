import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  AlertCircle,
  Utensils,
  TrendingDown,
  RefreshCw,
  Coins
} from 'lucide-react';
import { generateAIAdvisorInsights } from '../utils/calculations';

export default function AIAdvisor({ 
  totals, 
  dailyLimitData, 
  categoryBreakdownData 
}) {
  const [filter, setFilter] = useState('all'); // all, alerts, tips
  const [analyzing, setAnalyzing] = useState(false);

  const { totalIncome, totalExpense, netBalance, spentToday } = totals;
  const { dailyLimit, daysLeft } = dailyLimitData;
  const { foodPercentage, foodExpense, breakdown } = categoryBreakdownData;

  const insights = generateAIAdvisorInsights({
    totalIncome,
    totalExpense,
    netBalance,
    spentToday,
    dailyLimit,
    daysLeft,
    foodPercentage,
    foodExpense,
    categoryBreakdown: breakdown,
  });

  const filteredInsights = insights.filter((item) => {
    if (filter === 'alerts') return item.type === 'danger' || item.type === 'warning';
    if (filter === 'tips') return item.type === 'tip' || item.type === 'success' || item.type === 'info';
    return true;
  });

  const handleRefresh = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 500);
  };

  const alertCount = insights.filter(i => i.type === 'danger' || i.type === 'warning').length;

  const getStyleForType = (type) => {
    switch (type) {
      case 'danger':
        return {
          border: 'border-rose-200 dark:border-rose-900/60',
          bg: 'bg-rose-50/70 dark:bg-rose-950/30',
          badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/80 dark:text-rose-200',
          icon: AlertTriangle,
          iconColor: 'text-rose-500',
        };
      case 'warning':
        return {
          border: 'border-amber-200 dark:border-amber-900/60',
          bg: 'bg-amber-50/70 dark:bg-amber-950/30',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200',
          icon: Utensils,
          iconColor: 'text-amber-500',
        };
      case 'success':
        return {
          border: 'border-emerald-200 dark:border-emerald-900/60',
          bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200',
          icon: CheckCircle2,
          iconColor: 'text-emerald-500',
        };
      case 'info':
        return {
          border: 'border-sky-200 dark:border-sky-900/60',
          bg: 'bg-sky-50/70 dark:bg-sky-950/30',
          badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/80 dark:text-sky-200',
          icon: AlertCircle,
          iconColor: 'text-sky-500',
        };
      default:
        return {
          border: 'border-sky-200 dark:border-slate-700',
          bg: 'bg-sky-50/40 dark:bg-slate-900/60',
          badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/80 dark:text-sky-200',
          icon: Lightbulb,
          iconColor: 'text-sky-500',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-sky-100 dark:border-slate-700/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-50 dark:border-slate-700/60 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 mb-1.5">
            <Bot className="w-3.5 h-3.5 text-sky-500" />
            <span>Campus Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span>Rule-Based AI Financial Advisor</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time heuristic evaluation monitoring food ratios, daily limits, and financial discipline.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {alertCount > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{alertCount} Action Item{alertCount > 1 ? 's' : ''}</span>
            </span>
          )}

          <button
            onClick={handleRefresh}
            title="Re-run heuristics"
            className="p-2 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin text-sky-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
              : 'bg-sky-50/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-sky-100'
          }`}
        >
          All Insights ({insights.length})
        </button>
        <button
          onClick={() => setFilter('alerts')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'alerts'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
              : 'bg-sky-50/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-sky-100'
          }`}
        >
          Alerts & Breaches ({alertCount})
        </button>
        <button
          onClick={() => setFilter('tips')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'tips'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
              : 'bg-sky-50/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-sky-100'
          }`}
        >
          Tips & Hacks
        </button>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-3.5">
        {filteredInsights.map((insight) => {
          const style = getStyleForType(insight.type);
          const Icon = style.icon;

          return (
            <div
              key={insight.id}
              className={`p-4 sm:p-5 rounded-2xl border ${style.border} ${style.bg} transition-all space-y-2.5`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${style.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                      {insight.badge}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 mt-0.5">
                      {insight.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {insight.message}
              </p>

              {/* Action Tip Pill */}
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-sky-100/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-sky-700 dark:text-sky-300 mr-1.5">Actionable Advice:</span>
                  <span>{insight.actionTip}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
