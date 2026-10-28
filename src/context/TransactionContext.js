import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_TRANSACTIONS } from '../data/demoData';
import { useAuth } from './AuthContext';
import { getMonthKey } from '../utils/dateHelpers';

const TRANSACTIONS_KEY = '@finance_app_transactions_v2';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [allTransactions, setAllTransactions] = useState(DEFAULT_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from storage on mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const stored = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        if (stored) {
          setAllTransactions(JSON.parse(stored));
        } else {
          await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
        }
      } catch (e) {
        console.warn('Failed to load transactions:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Persist transactions helper
  const persistTransactions = async (list) => {
    try {
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist transactions:', e);
    }
  };

  // Filtered transactions for the current user (Admin gets all, Customer gets theirs)
  const currentTransactions = currentUser?.role === 'admin'
    ? allTransactions
    : allTransactions.filter((tx) => tx.userId === currentUser?.id);

  // Add Transaction with personalized alert
  const addTransaction = async (txData) => {
    if (!currentUser) return { success: false, error: 'User not authenticated' };

    const newTx = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      title: txData.title.trim(),
      amount: parseFloat(txData.amount),
      type: txData.type, // 'income' or 'expense'
      category: txData.category,
      date: txData.date,
      description: txData.description ? txData.description.trim() : '',
    };

    const updated = [newTx, ...allTransactions];
    setAllTransactions(updated);
    await persistTransactions(updated);

    // Personalized alert requirement
    Alert.alert(
      'Transaction Added',
      `Hi ${currentUser.name}, your transaction has been added successfully.`,
      [{ text: 'OK' }]
    );

    return { success: true, transaction: newTx };
  };

  // Update Transaction with personalized alert
  const updateTransaction = async (id, updatedFields) => {
    if (!currentUser) return { success: false, error: 'User not authenticated' };

    const updated = allTransactions.map((tx) => {
      if (tx.id === id) {
        return {
          ...tx,
          ...updatedFields,
          amount: updatedFields.amount !== undefined ? parseFloat(updatedFields.amount) : tx.amount,
          title: updatedFields.title !== undefined ? updatedFields.title.trim() : tx.title,
          description: updatedFields.description !== undefined ? updatedFields.description.trim() : tx.description,
        };
      }
      return tx;
    });

    setAllTransactions(updated);
    await persistTransactions(updated);

    // Personalized alert requirement
    Alert.alert(
      'Transaction Updated',
      `Hi ${currentUser.name}, your transaction has been updated successfully.`,
      [{ text: 'OK' }]
    );

    return { success: true };
  };

  // Delete Transaction with personalized alert
  const deleteTransaction = async (id) => {
    if (!currentUser) return { success: false, error: 'User not authenticated' };

    const updated = allTransactions.filter((tx) => tx.id !== id);
    setAllTransactions(updated);
    await persistTransactions(updated);

    // Personalized alert requirement
    Alert.alert(
      'Transaction Removed',
      `Hi ${currentUser.name}, your transaction has been removed successfully.`,
      [{ text: 'OK' }]
    );

    return { success: true };
  };

  // Confirmation alert before delete requirement
  const confirmAndDelete = (id, title) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  // Reset to default demo data
  const resetDemoData = async () => {
    setAllTransactions(DEFAULT_TRANSACTIONS);
    await persistTransactions(DEFAULT_TRANSACTIONS);
    Alert.alert('Data Reset', 'Demo transactions have been reset to factory state.');
  };

  // Helper query: get transactions for a specific month
  const getTransactionsByMonth = (monthKey) => {
    return currentTransactions.filter((tx) => getMonthKey(tx.date) === monthKey);
  };

  // Helper query: get transactions for a specific category
  const getTransactionsByCategory = (categoryName) => {
    return currentTransactions.filter((tx) => tx.category === categoryName);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: currentTransactions,
        allTransactions,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        confirmAndDelete,
        resetDemoData,
        getTransactionsByMonth,
        getTransactionsByCategory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export default TransactionContext;
