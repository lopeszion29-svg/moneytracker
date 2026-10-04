import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Info } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function SpendingBarChart({ data, dailyLimit }) {
  // Calculate 7-day average daily spend
  const total7DaySpend = data.reduce((acc, curr) => acc + curr.expense, 0);
  const avg7DaySpend = Math.round(total7DaySpend / 7);

  // Custom Tooltip
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dayData = payload[0].payload;
      const isOverLimit = dailyLimit > 0 && dayData.expense > dailyLimit;

      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-sky-100 dark:border-slate-700 text-xs space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
            <span>{dayData.label}</span>
            {dayData.isToday && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-[10px] text-sky-700 dark:text-sky-300">
                Today
              </span>
            )}
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            Spent: <span className="font-extrabold text-sky-600 dark:text-sky-400">{formatCurrency(dayData.expense)}</span>
          </div>
          {dailyLimit > 0 && (
            <div className={`text-[11px] font-medium ${isOverLimit ? 'text-rose-500' : 'text-emerald-500'}`}>
              {isOverLimit
                ? `Exceeded limit by ${formatCurrency(dayData.expense - dailyLimit)}`
                : `${formatCurrency(dailyLimit - dayData.expense)} under daily limit`}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-sky-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-sky-500" />
            <span>Daily Spending (Last 7 Days)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pacing history against your calculated daily limit
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Daily Spend</span>
          </div>
          {dailyLimit > 0 && (
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-400" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">Daily Limit ({formatCurrency(dailyLimit)})</span>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomBarTooltip />} />

            {/* Reference Line for Daily Limit */}
            {dailyLimit > 0 && (
              <ReferenceLine 
                y={dailyLimit} 
                stroke="#f43f5e" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
              />
            )}

            <Bar dataKey="expense" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => {
                const isOver = dailyLimit > 0 && entry.expense > dailyLimit;
                // Today gets highlighted or over-limit gets distinct tint
                const barFill = entry.isToday 
                  ? '#0284c7' // Bright sky blue
                  : isOver 
                    ? '#fb7185' // Alert rose
                    : '#38bdf8'; // Soft sky blue
                return (
                  <Cell 
                    key={`bar-cell-${index}`} 
                    fill={barFill}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-3 border-t border-sky-50 dark:border-slate-700/50 mt-2 text-xs">
        <div className="flex items-center text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 mr-1 text-sky-500" />
          <span>7-Day Total: <strong className="text-slate-700 dark:text-slate-200">{formatCurrency(total7DaySpend)}</strong></span>
        </div>
        <div className="text-slate-600 dark:text-slate-300 font-medium">
          7-Day Average: <span className="font-bold text-sky-600 dark:text-sky-400">{formatCurrency(avg7DaySpend)}/day</span>
        </div>
      </div>
    </div>
  );
}
