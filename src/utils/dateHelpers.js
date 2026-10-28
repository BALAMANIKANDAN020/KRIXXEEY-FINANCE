/**
 * Date utility functions for consistent timezone-safe date parsing and formatting
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parses YYYY-MM-DD safely into components
 */
export const parseDateParts = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
  }

  const parts = dateStr.split('-');
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    day: parseInt(parts[2] || '1', 10)
  };
};

/**
 * Formats a YYYY-MM-DD date string to readable display format e.g. "24 Oct 2026"
 */
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const { year, month, day } = parseDateParts(dateStr);
  const monthName = MONTH_SHORT_NAMES[month - 1] || '';
  return `${day} ${monthName} ${year}`;
};

/**
 * Formats a YYYY-MM string to e.g. "October 2026"
 */
export const formatMonthYear = (monthKey) => {
  if (!monthKey) return '';
  const parts = monthKey.split('-');
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  return `${MONTH_NAMES[monthIndex] || ''} ${year}`;
};

/**
 * Returns month key "YYYY-MM" from a date string "YYYY-MM-DD"
 */
export const getMonthKey = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length >= 2) {
    return `${parts[0]}-${parts[1].padStart(2, '0')}`;
  }
  return dateStr;
};

/**
 * Checks if a date string falls on the exact same day
 */
export const isSameDay = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return false;
  return dateStr1.slice(0, 10) === dateStr2.slice(0, 10);
};

/**
 * Checks if a date string is within the 7-day window ending on or around targetDate
 */
export const isWithinSevenDays = (dateStr, referenceDateStr) => {
  if (!dateStr || !referenceDateStr) return false;
  
  const d = new Date(dateStr + 'T00:00:00');
  const ref = new Date(referenceDateStr + 'T00:00:00');
  
  const diffTime = ref.getTime() - d.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);
  
  // Within last 7 days (day 0 to day 6 prior)
  return diffDays >= 0 && diffDays < 7;
};

/**
 * Checks if date is in the specified month (month is 1-12)
 */
export const isInMonth = (dateStr, year, month) => {
  if (!dateStr) return false;
  const parts = parseDateParts(dateStr);
  return parts.year === Number(year) && parts.month === Number(month);
};

export default {
  MONTH_NAMES,
  MONTH_SHORT_NAMES,
  getTodayString,
  parseDateParts,
  formatDisplayDate,
  formatMonthYear,
  getMonthKey,
  isSameDay,
  isWithinSevenDays,
  isInMonth,
};
