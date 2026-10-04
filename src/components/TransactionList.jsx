import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Utensils, 
  Bus, 
  Droplets, 
  ShoppingBag, 
  MoreHorizontal,
  Tag,
  Calendar,
  Download,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORIES } from '../data/categories';

const ICON_MAP = {
  Food: Utensils,
  Travel: Bus,
  'Water/Utilities': Droplets,
  Shopping: ShoppingBag,
  Other: MoreHorizontal,
};

export default function TransactionList({ 
  transactions = [], 
  onDeleteTransaction, 
  onOpenAddModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // All, expense, income
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  // Filtering
  const filtered = transactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || tx.category === selectedCategory;
    const matchesType = selectedType === 'All' || tx.type === selectedType;
    return matchesSearch && matchesCat && matchesType;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  // CSV Export utility
  const exportCSV = () => {
    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount'];
    const rows = sorted.map((t) => [
      t.date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.category,
      t.amount,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `college_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-sky-100 dark:border-slate-700/60 shadow-sm space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-50 dark:border-slate-700/60 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 mb-1.5">
            <Receipt className="w-3.5 h-3.5 text-sky-500" />
            <span>Transaction Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Transaction History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Search, filter by student categories, and export records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            title="Download CSV statement"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-slate-700 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-slate-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all active:scale-95"
          >
            <span>+ Add Entry</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions (e.g. Canteen, Metro)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Type Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Types (Income & Expenses)</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="sm:col-span-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="date-desc">Date (Newest first)</option>
            <option value="date-asc">Date (Oldest first)</option>
            <option value="amount-desc">Amount (Highest first)</option>
            <option value="amount-asc">Amount (Lowest first)</option>
          </select>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 dark:text-slate-500 shrink-0 font-medium flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> Category:
        </span>
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
            selectedCategory === 'All'
              ? 'bg-sky-500 text-white'
              : 'bg-sky-50/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-sky-100'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
              selectedCategory === cat.id
                ? 'bg-sky-500 text-white'
                : 'bg-sky-50/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-sky-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Transactions List Table / Cards */}
      {sorted.length === 0 ? (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
          <Tag className="w-10 h-10 text-sky-200 dark:text-slate-600 mx-auto" />
          <p className="text-sm font-semibold">No transactions match your current filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedType('All');
            }}
            className="text-xs text-sky-600 dark:text-sky-400 underline"
          >
            Clear active filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-sky-50 dark:divide-slate-700/60">
          {sorted.map((tx) => {
            const isExpense = tx.type === 'expense';
            const Icon = ICON_MAP[tx.category] || MoreHorizontal;

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-sky-50/40 dark:hover:bg-slate-700/20 px-3 rounded-2xl transition-colors"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isExpense
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800/40'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40'
                    }`}
                  >
                    {isExpense ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                      <span className="inline-flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(tx.date)}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-sky-600 dark:text-sky-400">
                        {tx.category || (isExpense ? 'Other' : 'Allowance')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-sm sm:text-base font-extrabold tracking-tight ${
                        isExpense
                          ? 'text-slate-900 dark:text-slate-100'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}
                      {formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {tx.type}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    title="Delete Transaction"
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
