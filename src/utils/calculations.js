// Financial and mathematical calculation utilities

/**
 * Returns totals for income, expenses, and net balance
 */
export const calculateTotals = (transactions = []) => {
  let totalIncome = 0;
  let totalExpense = 0;

  const todayStr = new Date().toISOString().slice(0, 10);
  let spentToday = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amt;
    } else if (tx.type === 'expense') {
      totalExpense += amt;
      if (tx.date === todayStr) {
        spentToday += amt;
      }
    }
  });

  const netBalance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    spentToday,
  };
};

/**
 * Calculates dynamic daily spending limit based on:
 * Daily Spending Limit = Remaining Balance / Days Left in Current Month
 */
export const calculateDailyLimit = (remainingBalance, targetDate = new Date()) => {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth(); // 0-indexed

  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = targetDate.getDate();

  // Days left in current month (including today)
  const daysLeft = Math.max(1, daysInMonth - currentDay + 1);
  const daysPassed = Math.max(1, currentDay);

  // Daily limit = Remaining Balance / Days Left
  const rawDailyLimit = remainingBalance > 0 ? remainingBalance / daysLeft : 0;
  const dailyLimit = Math.round(rawDailyLimit);

  return {
    daysInMonth,
    currentDay,
    daysLeft,
    daysPassed,
    dailyLimit,
    rawDailyLimit,
  };
};

/**
 * Category breakdown for expenses
 */
export const calculateCategoryBreakdown = (transactions = []) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0
  );

  const categoryMap = {
    Food: 0,
    Travel: 0,
    'Water/Utilities': 0,
    Shopping: 0,
    Other: 0,
  };

  expenseTransactions.forEach((tx) => {
    const cat = tx.category || 'Other';
    const amt = Number(tx.amount) || 0;
    if (categoryMap[cat] !== undefined) {
      categoryMap[cat] += amt;
    } else {
      categoryMap['Other'] = (categoryMap['Other'] || 0) + amt;
    }
  });

  const breakdown = Object.entries(categoryMap).map(([category, amount]) => {
    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
    return {
      name: category,
      value: amount,
      percentage: Number(percentage.toFixed(1)),
    };
  });

  return {
    breakdown,
    totalExpense,
    foodExpense: categoryMap['Food'] || 0,
    foodPercentage: totalExpense > 0 ? ((categoryMap['Food'] || 0) / totalExpense) * 100 : 0,
  };
};

/**
 * 7-Day spending history for the bar chart
 */
export const calculate7DaySpending = (transactions = [], refDate = new Date()) => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = dayNames[d.getDay()];
    const label = `${dayName} ${d.getDate()}`;

    // Sum transactions for this day
    let expense = 0;
    let income = 0;

    transactions.forEach((tx) => {
      if (tx.date === dateStr) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'expense') expense += amt;
        if (tx.type === 'income') income += amt;
      }
    });

    days.push({
      date: dateStr,
      label,
      dayName,
      dayNumber: d.getDate(),
      expense,
      income,
      isToday: i === 0,
    });
  }

  return days;
};

/**
 * Average daily savings rate calculation:
 * (Income - Expenses) / Days Passed in Month
 */
export const calculateSavingsRate = (totalIncome, totalExpense, daysPassed) => {
  const netSavings = totalIncome - totalExpense;
  const safeDays = Math.max(1, daysPassed);
  const dailySavingsRate = netSavings / safeDays;
  return {
    netSavings,
    dailySavingsRate: Math.max(0, Math.round(dailySavingsRate)),
    rawSavingsRate: dailySavingsRate,
  };
};

/**
 * "What-If" Purchase Impact Simulator
 */
export const simulatePurchaseImpact = (remainingBalance, daysLeft, itemPrice) => {
  const price = Math.max(0, Number(itemPrice) || 0);
  const currentDailyLimit = daysLeft > 0 ? Math.max(0, remainingBalance / daysLeft) : 0;
  
  const newBalance = remainingBalance - price;
  const newDailyLimit = daysLeft > 0 ? Math.max(0, newBalance / daysLeft) : 0;
  const limitDrop = Math.max(0, currentDailyLimit - newDailyLimit);
  
  const percentDrop = currentDailyLimit > 0 ? (limitDrop / currentDailyLimit) * 100 : 100;

  // Severity rating
  let severity = 'low'; // low, moderate, severe, critical
  let message = '';

  if (newBalance < 0) {
    severity = 'critical';
    message = `Overdraft Warning! This purchase puts your student budget ₹${Math.abs(newBalance).toLocaleString('en-IN')} in the negative.`;
  } else if (percentDrop > 35) {
    severity = 'severe';
    message = `High Impact! Your daily allowance drops by ${percentDrop.toFixed(0)}%. You will only have ₹${Math.round(newDailyLimit)}/day for the next ${daysLeft} days.`;
  } else if (percentDrop > 15) {
    severity = 'moderate';
    message = `Moderate Impact. Daily limit decreases by ₹${Math.round(limitDrop)}/day (${percentDrop.toFixed(0)}%). Easily absorbable with light budgeting.`;
  } else {
    severity = 'low';
    message = `Safe Purchase! Minimal hit on your remaining allowance (drops just ₹${Math.round(limitDrop)}/day).`;
  }

  return {
    price,
    currentDailyLimit: Math.round(currentDailyLimit),
    newBalance: Math.round(newBalance),
    newDailyLimit: Math.round(newDailyLimit),
    limitDrop: Math.round(limitDrop),
    percentDrop: Math.min(100, Math.round(percentDrop)),
    severity,
    message,
    canAfford: newBalance >= 0,
  };
};

/**
 * Rule-Based AI Advisor:
 * Generates dynamic spending insights based on user data
 */
export const generateAIAdvisorInsights = ({
  totalIncome,
  totalExpense,
  netBalance,
  spentToday,
  dailyLimit,
  daysLeft,
  foodPercentage,
  foodExpense,
  categoryBreakdown,
}) => {
  const insights = [];

  // RULE 1: If Food expenses > 40% of total spend: Show alert tip to reduce eating out.
  if (totalExpense > 0 && foodPercentage > 40) {
    insights.push({
      id: 'food-alert',
      type: 'warning',
      badge: 'Canteen & Food Alert',
      title: `Food is ${foodPercentage.toFixed(1)}% of your expenses!`,
      message: `You've spent ₹${foodExpense.toLocaleString('en-IN')} on food, surpassing the healthy 40% college budget guideline.`,
      actionTip: 'Pro-tip: Stick to your hostel mess / meal plan on weekdays, brew your own tea/coffee, and reserve Zomato/Swiggy deliveries for group weekend treats.',
      category: 'Food',
      score: 95, // High priority
    });
  }

  // RULE 2: If Daily spending exceeds calculated Daily Limit: Show budget breach warning.
  if (spentToday > dailyLimit && dailyLimit > 0) {
    const excess = spentToday - dailyLimit;
    insights.push({
      id: 'daily-breach',
      type: 'danger',
      badge: 'Daily Limit Breach',
      title: `Today's spending (₹${spentToday.toLocaleString('en-IN')}) exceeded daily limit!`,
      message: `You went over today's calculated budget of ₹${dailyLimit.toLocaleString('en-IN')} by ₹${excess.toLocaleString('en-IN')}.`,
      actionTip: `Aim for a "No-Spend" or low-spend day tomorrow to recalibrate your remaining ₹${dailyLimit.toLocaleString('en-IN')}/day limit for the next ${daysLeft} days.`,
      category: 'Budget',
      score: 98, // Critical priority
    });
  } else if (dailyLimit > 0 && spentToday > 0 && spentToday <= dailyLimit) {
    insights.push({
      id: 'daily-ontrack',
      type: 'success',
      badge: 'Daily Budget On Track',
      title: `Great pacing! Within today's limit`,
      message: `You've spent ₹${spentToday.toLocaleString('en-IN')} of your ₹${dailyLimit.toLocaleString('en-IN')} allowance today.`,
      actionTip: `You have ₹${(dailyLimit - spentToday).toLocaleString('en-IN')} headroom remaining for today. Any unspent amount rolls into tomorrow's balance!`,
      category: 'Budget',
      score: 60,
    });
  }

  // RULE 3: Low Balance / Emergency alert
  if (netBalance < 1000 && netBalance > 0) {
    insights.push({
      id: 'low-balance',
      type: 'warning',
      badge: 'Low Reserve Warning',
      title: `Student Reserve Under ₹1,000`,
      message: `Your remaining balance is ₹${netBalance.toLocaleString('en-IN')} with ${daysLeft} days remaining in this month.`,
      actionTip: 'Freeze discretionary spending on shopping and outings until next month\'s pocket money or stipend arrives.',
      category: 'Safety',
      score: 90,
    });
  } else if (netBalance <= 0) {
    insights.push({
      id: 'zero-balance',
      type: 'danger',
      badge: 'Overdraft Alert',
      title: `Zero / Negative Student Balance!`,
      message: `Your total expenses have exceeded all income recorded this month.`,
      actionTip: 'Avoid borrowing from credit apps or friends. Log any emergency cash or request an early allowance installment.',
      category: 'Safety',
      score: 100,
    });
  }

  // RULE 4: Category Spike in Shopping / Travel
  const shoppingCat = categoryBreakdown.find((c) => c.name === 'Shopping');
  if (shoppingCat && totalExpense > 0 && shoppingCat.percentage > 30) {
    insights.push({
      id: 'shopping-alert',
      type: 'info',
      badge: 'Shopping Spike',
      title: `Shopping accounted for ${shoppingCat.percentage}% of spending`,
      message: `₹${shoppingCat.value.toLocaleString('en-IN')} spent on shopping and supplies.`,
      actionTip: 'Before buying stationery or books, check college senior hand-me-downs, library digital copies, or student discount codes.',
      category: 'Shopping',
      score: 75,
    });
  }

  // RULE 5: Encouraging Financial Health Tips (if no high alerts or healthy balance)
  if (insights.filter((i) => i.type === 'danger' || i.type === 'warning').length === 0) {
    insights.push({
      id: 'healthy-habit',
      type: 'success',
      badge: 'Financial Health Star ⭐',
      title: 'Awesome Budget Discipline!',
      message: `Your net savings rate is positive and daily spending is well disciplined within your ₹${dailyLimit.toLocaleString('en-IN')}/day threshold.`,
      actionTip: 'Smart move: Transfer 10% of your remaining balance to an auto-sweep student savings account or emergency fund.',
      category: 'Habits',
      score: 80,
    });
  }

  // General Student Smart Tip
  insights.push({
    id: 'student-hack',
    type: 'tip',
    badge: 'Campus Money Hack',
    title: 'Unlock Student Subscriptions',
    message: 'Did you know? University emails (.edu / college domain) provide 50% discounts on Spotify, GitHub Student Pack, Apple Music, and Amazon Prime Student.',
    actionTip: 'Always verify student status with your college ID card before paying full price.',
    category: 'Hacks',
    score: 50,
  });

  // Sort insights by priority score descending
  return insights.sort((a, b) => b.score - a.score);
};
