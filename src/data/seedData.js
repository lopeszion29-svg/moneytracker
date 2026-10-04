// Seed data for College Student Expense Tracker

// Generates dates relative to today (e.g. 0 days ago, 1 day ago, etc.)
const getRelativeDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-seed-1',
    title: 'Monthly Pocket Allowance',
    amount: 12000,
    type: 'income',
    category: 'Other',
    date: getRelativeDate(5),
  },
  {
    id: 'tx-seed-2',
    title: 'Coding Mentorship Stipend',
    amount: 5000,
    type: 'income',
    category: 'Other',
    date: getRelativeDate(3),
  },
  {
    id: 'tx-seed-3',
    title: 'Hostel Mess & Canteen Meals',
    amount: 1850,
    type: 'expense',
    category: 'Food',
    date: getRelativeDate(4),
  },
  {
    id: 'tx-seed-4',
    title: 'Monthly Metro Student Smart Card',
    amount: 800,
    type: 'expense',
    category: 'Travel',
    date: getRelativeDate(4),
  },
  {
    id: 'tx-seed-5',
    title: 'Semester Textbooks & Stationery',
    amount: 1250,
    type: 'expense',
    category: 'Shopping',
    date: getRelativeDate(3),
  },
  {
    id: 'tx-seed-6',
    title: 'Campus Wi-Fi & Water Dispenser Recharge',
    amount: 450,
    type: 'expense',
    category: 'Water/Utilities',
    date: getRelativeDate(2),
  },
  {
    id: 'tx-seed-7',
    title: 'Late Night Biryani & Chai with Friends',
    amount: 680,
    type: 'expense',
    category: 'Food',
    date: getRelativeDate(1),
  },
  {
    id: 'tx-seed-8',
    title: 'Exam Center Cab Share',
    amount: 190,
    type: 'expense',
    category: 'Travel',
    date: getRelativeDate(1),
  },
  {
    id: 'tx-seed-9',
    title: 'Cafe Cold Coffee & Sandwiches',
    amount: 320,
    type: 'expense',
    category: 'Food',
    date: getRelativeDate(0), // Today
  },
  {
    id: 'tx-seed-10',
    title: 'Assignment Color Prints & Binding',
    amount: 150,
    type: 'expense',
    category: 'Other',
    date: getRelativeDate(0), // Today
  },
];

export const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Noise Cancelling Headphones',
    targetAmount: 3000,
    currentSaved: 1800,
    category: 'Shopping',
    deadline: '2026-11-15',
    icon: 'Headphones',
  },
  {
    id: 'goal-2',
    title: 'Semester Break Trip Fund',
    targetAmount: 6000,
    currentSaved: 2400,
    category: 'Travel',
    deadline: '2026-12-20',
    icon: 'Palmtree',
  },
  {
    id: 'goal-3',
    title: 'Ergonomic Study Chair',
    targetAmount: 4500,
    currentSaved: 900,
    category: 'Shopping',
    deadline: '2026-11-30',
    icon: 'Armchair',
  },
];
