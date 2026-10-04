import React from 'react';
import { 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  CalendarDays,
  Coins
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function DailyLimitCard({ 
  dailyLimitData, 
  netBalance, 
  spentToday 
}) {
  const { daysLeft, dailyLimit, daysInMonth, currentDay } = dailyLimitData;

  const isExceeded = spentToday > dailyLimit && dailyLimit > 0;
  const isClose = spentToday > dailyLimit * 0.75 && !isExceeded;
  const isDeficit = netBalance <= 0;

  // Percentage of today's budget used
  const percentUsed = dailyLimit > 0 ? Math.min(100, Math.round((spentToday / dailyLimit) * 100)) : 100;

  // Status configuration
  let statusBadge = {
    label: 'Healthy Pace',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle2,
    barColor: 'from-sky-400 to-blue-500',
  };

  if (isDeficit) {
    statusBadge = {
      label: 'Zero Allowance',
      bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: AlertTriangle,
      barColor: 'from-rose-500 to-red-600',
    };
  } else if (isExceeded) {
    statusBadge = {
      label: 'Budget Breached Today',
      bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: AlertTriangle,
      barColor: 'from-rose-500 to-red-600',
    };
  } else if (isClose) {
    statusBadge = {
      label: 'Approaching Limit',
      bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: AlertTriangle,
      barColor: 'from-amber-400 to-amber-500',
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white p-6 sm:p-7 shadow-lg shadow-sky-500/20">
      {/* Decorative background shapes */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Metric & Formula */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
              <Gauge className="w-3.5 h-3.5" />
              <span>Smart Safe-Spend Metric</span>
            </span>

            <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.bg} bg-white text-slate-800 shadow-sm`}>
              <StatusIcon className="w-3.5 h-3.5 mr-1" />
              <span>{statusBadge.label}</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-sky-100 font-medium">
              Daily Spending Limit
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">
                {formatCurrency(dailyLimit)}
              </span>
              <span className="text-sky-100 text-sm font-medium">
                / day
              </span>
            </div>
          </div>

          {/* Formula Breakdown pill */}
          <div className="inline-flex items-center text-xs text-sky-100 bg-black/15 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
            <Coins className="w-3.5 h-3.5 mr-1.5 text-sky-200" />
            <span>Formula: {formatCurrency(Math.max(0, netBalance))} balance ÷ {daysLeft} days remaining</span>
          </div>
        </div>

        {/* Right Column: Today's Spend Pacing Gauge */}
        <div className="w-full md:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center text-sky-100">
              <CalendarDays className="w-3.5 h-3.5 mr-1" />
              Today's Spending
            </span>
            <span className="font-bold">
              {formatCurrency(spentToday)} / {formatCurrency(dailyLimit)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${statusBadge.barColor}`}
              style={{ width: `${Math.min(100, Math.max(5, percentUsed))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-sky-100 pt-0.5">
            <span>
              {isExceeded 
                ? `Exceeded by ${formatCurrency(spentToday - dailyLimit)}`
                : `${formatCurrency(Math.max(0, dailyLimit - spentToday))} headroom remaining`}
            </span>
            <span className="font-bold text-white">
              {percentUsed}% used
            </span>
          </div>

          <p className="text-[11px] text-sky-200/90 leading-tight border-t border-white/10 pt-2">
            💡 Day {currentDay} of {daysInMonth} ({daysLeft} days left). Stick under this daily limit to sustain your pocket money until month end!
          </p>
        </div>
      </div>
    </div>
  );
}
