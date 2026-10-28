/**
 * Formats a numeric value into Indian Rupee currency format (e.g. ₹12,500)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }

  const num = Math.abs(Number(amount));
  
  // Format with commas according to Indian Numbering System
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
  });

  return (Number(amount) < 0 ? '-₹' : '₹') + formatted;
};

/**
 * Formats signed amount based on transaction type
 */
export const formatSignedAmount = (amount, type) => {
  const value = Math.abs(Number(amount || 0));
  const formatted = value.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  });

  if (type === 'income') {
    return `+₹${formatted}`;
  } else if (type === 'expense') {
    return `-₹${formatted}`;
  }
  return `₹${formatted}`;
};

export default { formatCurrency, formatSignedAmount };
