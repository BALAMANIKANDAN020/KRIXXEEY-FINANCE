/**
 * Form validation helper functions
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // optional field
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.trim().replace(/\s+/g, ''));
};

export const validateRegistration = ({ name, email, password, confirmPassword, role }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm password is required.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!role || (role !== 'customer' && role !== 'admin')) {
    errors.role = 'Please select a valid user role.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignIn = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProfile = ({ name, email, phone }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (phone && !isValidPhone(phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTransaction = ({ title, amount, type, category, date }) => {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Transaction title is required.';
  }

  const numAmount = parseFloat(amount);
  if (amount === '' || amount === undefined || isNaN(numAmount)) {
    errors.amount = 'Amount is required.';
  } else if (numAmount <= 0) {
    errors.amount = 'Amount must be a positive number greater than 0.';
  }

  if (!type || (type !== 'income' && type !== 'expense')) {
    errors.type = 'Please select transaction type (Income or Expense).';
  }

  if (!category || !category.trim()) {
    errors.category = 'Category is required.';
  }

  if (!date || !date.trim()) {
    errors.date = 'Date is required.';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date.trim())) {
      errors.date = 'Date must be formatted as YYYY-MM-DD.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isValidEmail,
  isValidPhone,
  validateRegistration,
  validateSignIn,
  validateProfile,
  validateTransaction,
};
