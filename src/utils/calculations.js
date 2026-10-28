import { isSameDay, isWithinSevenDays, isInMonth, parseDateParts } from './dateHelpers';

/**
 * Calculates total income from a list of transactions
 */
export const calculateTotalIncome = (transactions = []) => {
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
};

/**
 * Calculates total expenses from a list of transactions
 */
export const calculateTotalExpenses = (transactions = []) => {
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
};

/**
 * Calculates net balance (Income - Expense)
 */
export const calculateNetBalance = (transactions = []) => {
  const income = calculateTotalIncome(transactions);
  const expense = calculateTotalExpenses(transactions);
  return income - expense;
};

/**
 * Calculates savings rate percentage
 */
export const calculateSavingsRate = (transactions = []) => {
  const income = calculateTotalIncome(transactions);
  const expense = calculateTotalExpenses(transactions);
  if (income <= 0) return 0;
  const savings = income - expense;
  return Math.max(0, Math.round((savings / income) * 100));
};

/**
 * Groups transactions by category and calculates totals, counts, and percentages
 */
export const calculateCategoryBreakdown = (transactions = [], filterType = null) => {
  const filtered = filterType
    ? transactions.filter((tx) => tx.type === filterType)
    : transactions;

  const totalAmount = filtered.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const breakdownMap = {};

  filtered.forEach((tx) => {
    const cat = tx.category || 'Other';
    if (!breakdownMap[cat]) {
      breakdownMap[cat] = {
        category: cat,
        totalAmount: 0,
        count: 0,
        transactions: [],
        type: tx.type,
      };
    }
    breakdownMap[cat].totalAmount += Number(tx.amount) || 0;
    breakdownMap[cat].count += 1;
    breakdownMap[cat].transactions.push(tx);
  });

  return Object.values(breakdownMap).map((item) => ({
    ...item,
    percentage: totalAmount > 0 ? Math.round((item.totalAmount / totalAmount) * 100) : 0,
  })).sort((a, b) => b.totalAmount - a.totalAmount);
};

/**
 * Generates Daily Report for a specific day
 */
export const generateDailyReport = (transactions = [], targetDate) => {
  const filtered = transactions.filter((tx) => isSameDay(tx.date, targetDate));
  const income = calculateTotalIncome(filtered);
  const expenses = calculateTotalExpenses(filtered);
  const balance = income - expenses;
  const categories = calculateCategoryBreakdown(filtered, 'expense');

  return {
    period: 'daily',
    targetDate,
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: balance,
    transactionCount: filtered.length,
    transactions: filtered,
    categoryBreakdown: categories,
  };
};

/**
 * Generates Weekly Report (last 7 days from targetDate)
 */
export const generateWeeklyReport = (transactions = [], referenceDate) => {
  const filtered = transactions.filter((tx) => isWithinSevenDays(tx.date, referenceDate));
  const income = calculateTotalIncome(filtered);
  const expenses = calculateTotalExpenses(filtered);
  const balance = income - expenses;
  const categories = calculateCategoryBreakdown(filtered, 'expense');

  return {
    period: 'weekly',
    referenceDate,
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: balance,
    transactionCount: filtered.length,
    transactions: filtered,
    categoryBreakdown: categories,
  };
};

/**
 * Generates Monthly Report for a specific month and year
 */
export const generateMonthlyReport = (transactions = [], year, month) => {
  const filtered = transactions.filter((tx) => isInMonth(tx.date, year, month));
  const income = calculateTotalIncome(filtered);
  const expenses = calculateTotalExpenses(filtered);
  const balance = income - expenses;
  const categories = calculateCategoryBreakdown(filtered, 'expense');

  return {
    period: 'monthly',
    year,
    month,
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: balance,
    transactionCount: filtered.length,
    transactions: filtered,
    categoryBreakdown: categories,
  };
};

export default {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateSavingsRate,
  calculateCategoryBreakdown,
  generateDailyReport,
  generateWeeklyReport,
  generateMonthlyReport,
};
