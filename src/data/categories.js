export const CATEGORIES = [
  {
    id: 'Food',
    name: 'Food',
    icon: 'Utensils',
    color: '#0284c7', // Sky blue 600
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    textColor: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-800',
    description: 'Mess, canteen, cafes & groceries',
  },
  {
    id: 'Travel',
    name: 'Travel',
    icon: 'Bus',
    color: '#0ea5e9', // Sky blue 500
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    description: 'Metro pass, bus, autos & fuel',
  },
  {
    id: 'Water/Utilities',
    name: 'Water/Utilities',
    icon: 'Droplets',
    color: '#38bdf8', // Sky blue 400
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    description: 'Wi-Fi, laundry, water bills & electricity',
  },
  {
    id: 'Shopping',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#60a5fa', // Blue 400
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    description: 'Books, stationery, clothes & electronics',
  },
  {
    id: 'Other',
    name: 'Other',
    icon: 'MoreHorizontal',
    color: '#93c5fd', // Blue 300
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-700',
    description: 'Subscriptions, medical, printouts & miscellaneous',
  },
];

export const getCategoryMeta = (catId) => {
  const found = CATEGORIES.find(c => c.id === catId);
  return found || {
    id: catId,
    name: catId,
    icon: 'Tag',
    color: '#38bdf8',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    textColor: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-800',
    description: 'Miscellaneous expense',
  };
};
