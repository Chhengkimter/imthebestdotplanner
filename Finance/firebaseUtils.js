/**
 * Firebase Utilities for Finance Module
 * 
 * Helper functions for Firebase operations
 * Can be extended for advanced features like real-time sync, batch operations, etc.
 */

import { db } from './firebaseConfig';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';

/**
 * Get all transactions for a specific date range
 * @param {string} userId - User ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of transactions
 */
export const getTransactionsByDateRange = async (userId, startDate, endDate) => {
  try {
    const transactionsRef = collection(db, `users/${userId}/data/transactions`);
    const q = query(
      transactionsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching transactions by date range:', error);
    return [];
  }
};

/**
 * Get transactions by category
 * @param {string} userId - User ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<Array>} Array of transactions for that category
 */
export const getTransactionsByCategory = async (userId, categoryId) => {
  try {
    const transactionsRef = collection(db, `users/${userId}/data/transactions`);
    const q = query(transactionsRef, where('categoryId', '==', categoryId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching transactions by category:', error);
    return [];
  }
};

/**
 * Export all finance data (useful for backups)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Complete finance data
 */
export const exportFinanceData = async (userId) => {
  try {
    const dataRef = collection(db, `users/${userId}/data`);
    const snapshot = await getDocs(dataRef);
    
    const data = {};
    snapshot.docs.forEach(doc => {
      data[doc.id] = doc.data();
    });
    
    return {
      timestamp: new Date().toISOString(),
      userId,
      data
    };
  } catch (error) {
    console.error('Error exporting finance data:', error);
    return null;
  }
};

/**
 * Batch update multiple transactions
 * @param {string} userId - User ID
 * @param {Array} updates - Array of update objects {id, updates}
 * @returns {Promise<boolean>} Success status
 */
export const batchUpdateTransactions = async (userId, updates) => {
  try {
    const batch = writeBatch(db);
    
    updates.forEach(({ id, updates: updateData }) => {
      const docRef = doc(db, `users/${userId}/data/transactions/${id}`);
      batch.update(docRef, updateData);
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error in batch update:', error);
    return false;
  }
};

/**
 * Calculate total spending for a date range
 * @param {Array} transactions - Array of transactions
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {number} Total spending amount
 */
export const calculateSpendingForDateRange = (transactions, startDate, endDate) => {
  return transactions
    .filter(t => t.type === 'expense' && t.date >= startDate && t.date <= endDate)
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculate total income for a date range
 * @param {Array} transactions - Array of transactions
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {number} Total income amount
 */
export const calculateIncomeForDateRange = (transactions, startDate, endDate) => {
  return transactions
    .filter(t => t.type === 'income' && t.date >= startDate && t.date <= endDate)
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Get category spending breakdown
 * @param {Array} transactions - Array of transactions
 * @param {Array} categories - Array of categories
 * @returns {Object} Spending by category
 */
export const getCategorySpendingBreakdown = (transactions, categories) => {
  const breakdown = {};
  
  categories.forEach(cat => {
    breakdown[cat.id] = {
      name: cat.name,
      color: cat.color,
      amount: transactions
        .filter(t => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0)
    };
  });
  
  return breakdown;
};

/**
 * Archive old transactions (for data management)
 * @param {string} userId - User ID
 * @param {string} beforeDate - Archive transactions before this date (YYYY-MM-DD)
 * @returns {Promise<number>} Number of archived transactions
 */
export const archiveOldTransactions = async (userId, beforeDate) => {
  try {
    const transactions = await getTransactionsByDateRange(userId, '1900-01-01', beforeDate);
    
    if (transactions.length === 0) return 0;
    
    const batch = writeBatch(db);
    transactions.forEach(t => {
      const docRef = doc(db, `users/${userId}/data/archived_transactions/${t.id}`);
      batch.set(docRef, t);
    });
    
    await batch.commit();
    return transactions.length;
  } catch (error) {
    console.error('Error archiving transactions:', error);
    return 0;
  }
};

/**
 * Generate a monthly report
 * @param {Array} transactions - Array of transactions
 * @param {Array} categories - Array of categories
 * @param {string} month - Month in format YYYY-MM
 * @returns {Object} Monthly report data
 */
export const generateMonthlyReport = (transactions, categories, month) => {
  const monthTransactions = transactions.filter(t => t.date.startsWith(month));
  
  const income = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const byCategory = {};
  categories.forEach(cat => {
    byCategory[cat.name] = monthTransactions
      .filter(t => t.categoryId === cat.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  return {
    month,
    totalIncome: income,
    totalExpenses: expenses,
    netIncome: income - expenses,
    byCategory,
    transactionCount: monthTransactions.length
  };
};
