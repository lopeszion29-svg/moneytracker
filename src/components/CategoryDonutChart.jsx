import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { getCategoryMeta } from '../data/categories';
import { PieChart as PieIcon, AlertCircle } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: '#0284c7', // Sky Blue 600
  Travel: '#0ea5e9', // Sky Blue 500
  'Water/Utilities': '#38bdf8', // Sky Blue 400
  Shopping: '#60a5fa', // Blue 400
  Other: '#93c5fd', // Blue 300
};

export default function CategoryDonutChart({ breakdown, totalExpense }) {
  const activeData = breakdown.filter((item) => item.value > 0);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const meta = getCategoryMeta(data.name);

      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-sky-100 dark:border-slate-700 text-xs space-y-1">
          <div className="flex items-center space-x-2 font-semibold text-slate-800 dark:text-slate-100">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[data.name] || '#38bdf8' }}
            />
            <span>{data.name}</span>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            Amount: <span className="font-bold text-sky-600 dark:text-sky-400">{formatCurrency(data.value)}</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            Share: <span className="font-semibold">{data.percentage}% of expenses</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-sky-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <PieIcon className="w-4 h-4 text-sky-500" />
            <span>Expenses by Category</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Where your student pocket money goes
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900">
          {formatCurrency(totalExpense)} total
        </span>
      </div>

      {/* Chart Section */}
      {activeData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm space-y-2">
          <AlertCircle className="w-8 h-8 text-sky-300 dark:text-slate-600" />
          <p>No expense data recorded yet.</p>
        </div>
      ) : (
        <div className="relative h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={activeData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {activeData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={CATEGORY_COLORS[entry.name] || '#0284c7'}
                    className="transition-opacity hover:opacity-85 cursor-pointer"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Spent
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100">
              {formatCurrency(totalExpense)}
            </span>
          </div>
        </div>
      )}

      {/* Category breakdown pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-sky-50 dark:border-slate-700/50 mt-2">
        {breakdown.map((cat) => {
          const color = CATEGORY_COLORS[cat.name] || '#0284c7';
          return (
            <div
              key={cat.name}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-sky-50/50 dark:bg-slate-700/30 text-xs"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-700 dark:text-slate-200 truncate">
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-400">
                  {formatCurrency(cat.value)} ({cat.percentage}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
