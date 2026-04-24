import React, { createContext, useState, useCallback, useEffect } from 'react';
import { db } from './firebaseConfig';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState('user-default'); // Default user ID - can be updated for multi-user support

  // Load data from Firebase on mount
  useEffect(() => {
    const loadFinanceData = async () => {
      try {
        // Load accounts
        const accountsDoc = await getDoc(doc(db, 'users', userId, 'data', 'accounts'));
        if (accountsDoc.exists()) {
          setAccounts(accountsDoc.data().items || []);
        }

        // Load categories
        const categoriesDoc = await getDoc(doc(db, 'users', userId, 'data', 'categories'));
        if (categoriesDoc.exists()) {
          setCategories(categoriesDoc.data().items || []);
        }

        // Load transactions
        const transactionsDoc = await getDoc(doc(db, 'users', userId, 'data', 'transactions'));
        if (transactionsDoc.exists()) {
          setTransactions(transactionsDoc.data().items || []);
        }

        // Load goals
        const goalsDoc = await getDoc(doc(db, 'users', userId, 'data', 'goals'));
        if (goalsDoc.exists()) {
          setGoals(goalsDoc.data().items || []);
        }
      } catch (error) {
        console.error('Error loading data from Firebase:', error);
        // Fall back to default data if Firebase fails
        setAccounts([
          { id: 1, name: 'School Funds', balance: 2500, color: '#8068d0' },
          { id: 2, name: 'Savings', balance: 5000, color: '#48a872' },
          { id: 3, name: 'Online Store Revenue', balance: 3200, color: '#e89abf' },
          { id: 4, name: 'Investment', balance: 1500, color: '#d87040' }
        ]);
        setCategories([
          { id: 1, name: 'Matcha', color: '#48a872', type: 'expense' },
          { id: 2, name: 'Groceries', color: '#c4e4d0', type: 'expense' },
          { id: 3, name: 'Transport', color: '#4890d8', type: 'expense' },
          { id: 4, name: 'Entertainment', color: '#e89abf', type: 'expense' },
          { id: 5, name: 'Salary', color: '#fad8c0', type: 'income' },
          { id: 6, name: 'Freelance', color: '#f0a880', type: 'income' }
        ]);
        setTransactions([
          { 
            id: 1, 
            date: new Date().toISOString().split('T')[0], 
            amount: 1200, 
            type: 'income', 
            categoryId: 5, 
            accountId: 1, 
            description: 'Monthly salary' 
          },
          { 
            id: 2, 
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0], 
            amount: 45, 
            type: 'expense', 
            categoryId: 1, 
            accountId: 1, 
            description: 'Matcha latte' 
          },
          { 
            id: 3, 
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0], 
            amount: 75, 
            type: 'expense', 
            categoryId: 2, 
            accountId: 1, 
            description: 'Weekly groceries' 
          },
          { 
            id: 4, 
            date: new Date(Date.now() - 259200000).toISOString().split('T')[0], 
            amount: 800, 
            type: 'income', 
            categoryId: 6, 
            accountId: 3, 
            description: 'Freelance project' 
          }
        ]);
        setGoals([
          { id: 1, title: 'Save for Laptop', target: 2000, current: 1200, steps: [
            { id: 1, text: 'Save $500', completed: true },
            { id: 2, text: 'Save another $500', completed: true },
            { id: 3, text: 'Final push $1000', completed: false }
          ]},
          { id: 2, title: 'Vacation Fund', target: 1500, current: 800, steps: [
            { id: 1, text: 'Research destinations', completed: true },
            { id: 2, text: 'Save $800', completed: true },
            { id: 3, text: 'Book flights', completed: false }
          ]},
          { id: 3, title: 'Emergency Fund', target: 5000, current: 3400, steps: [
            { id: 1, text: 'Save $1000', completed: true },
            { id: 2, text: 'Save another $2400', completed: true },
            { id: 3, text: 'Reach $5000', completed: false }
          ]}
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFinanceData();
  }, [userId]);

  // Save data to Firebase
  const saveAccountsToFirebase = useCallback(async (updatedAccounts) => {
    try {
      await setDoc(doc(db, 'users', userId, 'data', 'accounts'), {
        items: updatedAccounts,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving accounts to Firebase:', error);
    }
  }, [userId]);

  const saveCategoriesToFirebase = useCallback(async (updatedCategories) => {
    try {
      await setDoc(doc(db, 'users', userId, 'data', 'categories'), {
        items: updatedCategories,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving categories to Firebase:', error);
    }
  }, [userId]);

  const saveTransactionsToFirebase = useCallback(async (updatedTransactions) => {
    try {
      await setDoc(doc(db, 'users', userId, 'data', 'transactions'), {
        items: updatedTransactions,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving transactions to Firebase:', error);
    }
  }, [userId]);

  const saveGoalsToFirebase = useCallback(async (updatedGoals) => {
    try {
      await setDoc(doc(db, 'users', userId, 'data', 'goals'), {
        items: updatedGoals,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving goals to Firebase:', error);
    }
  }, [userId]);

  // Add a new account
  const addAccount = useCallback((name, color = '#8068d0') => {
    const newAccount = {
      id: Math.max(...accounts.map(a => a.id), 0) + 1,
      name,
      balance: 0,
      color
    };
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    saveAccountsToFirebase(updatedAccounts);
    return newAccount;
  }, [accounts, saveAccountsToFirebase]);

  // Add a new transaction
  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      ...transaction,
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactionsToFirebase(updatedTransactions);
    
    // Update account balance
    updateAccountBalance(transaction.accountId, transaction.type, transaction.amount);
    return newTransaction;
  }, [transactions, saveTransactionsToFirebase]);

  // Update account balance
  const updateAccountBalance = useCallback((accountId, type, amount) => {
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          balance: type === 'income' ? acc.balance + amount : acc.balance - amount
        };
      }
      return acc;
    });
    setAccounts(updatedAccounts);
    saveAccountsToFirebase(updatedAccounts);
  }, [accounts, saveAccountsToFirebase]);

  // Add a new category
  const addCategory = useCallback((name, color, type) => {
    const newCategory = {
      id: Math.max(...categories.map(c => c.id), 0) + 1,
      name,
      color,
      type
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategoriesToFirebase(updatedCategories);
    return newCategory;
  }, [categories, saveCategoriesToFirebase]);

  // Add a new goal
  const addGoal = useCallback((title, target) => {
    const newGoal = {
      id: Math.max(...goals.map(g => g.id), 0) + 1,
      title,
      target,
      current: 0,
      steps: []
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoalsToFirebase(updatedGoals);
    return newGoal;
  }, [goals, saveGoalsToFirebase]);

  // Update goal progress
  const updateGoalProgress = useCallback((goalId, currentAmount) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, current: Math.min(currentAmount, goal.target) };
      }
      return goal;
    });
    setGoals(updatedGoals);
    saveGoalsToFirebase(updatedGoals);
  }, [goals, saveGoalsToFirebase]);

  // Toggle goal step
  const toggleGoalStep = useCallback((goalId, stepId) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          steps: goal.steps.map(step => {
            if (step.id === stepId) {
              return { ...step, completed: !step.completed };
            }
            return step;
          })
        };
      }
      return goal;
    });
    setGoals(updatedGoals);
    saveGoalsToFirebase(updatedGoals);
  }, [goals, saveGoalsToFirebase]);

  // Get total balance across all accounts
  const getTotalBalance = useCallback(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  // Get transactions for a specific month
  const getMonthTransactions = useCallback((year, month) => {
    return transactions.filter(t => {
      const [tYear, tMonth] = t.date.split('-');
      return parseInt(tYear) === year && parseInt(tMonth) === month;
    });
  }, [transactions]);

  // Get monthly income vs spending
  const getMonthlyData = useCallback(() => {
    const data = {};
    
    transactions.forEach(t => {
      const [year, month] = t.date.split('-');
      const key = `${year}-${month}`;
      
      if (!data[key]) {
        data[key] = { month: key, income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        data[key].income += t.amount;
      } else {
        data[key].expense += t.amount;
      }
    });

    return Object.values(data).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  // Get income vs spending vs savings breakdown
  const getIncomeVsSpendingBreakdown = useCallback(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });

    const totalSavings = goals.reduce((sum, goal) => sum + goal.current, 0);

    return [
      { name: 'Income', value: totalIncome, color: '#fad8c0' },
      { name: 'Spending', value: totalExpense, color: '#e89abf' },
      { name: 'Savings', value: totalSavings, color: '#48a872' }
    ];
  }, [transactions, goals]);

  // Get category breakdown for expenses
  const getExpensesByCategory = useCallback(() => {
    const categoryBreakdown = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = categories.find(c => c.id === t.categoryId);
        if (category) {
          if (!categoryBreakdown[category.id]) {
            categoryBreakdown[category.id] = {
              name: category.name,
              value: 0,
              color: category.color
            };
          }
          categoryBreakdown[category.id].value += t.amount;
        }
      });

    return Object.values(categoryBreakdown);
  }, [transactions, categories]);

  // Delete transaction
  const deleteTransaction = useCallback((transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      // Reverse the account balance update
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === transaction.accountId) {
          return {
            ...acc,
            balance: transaction.type === 'income' ? acc.balance - transaction.amount : acc.balance + transaction.amount
          };
        }
        return acc;
      });
      setAccounts(updatedAccounts);
      saveAccountsToFirebase(updatedAccounts);
      
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
      saveTransactionsToFirebase(updatedTransactions);
    }
  }, [transactions, accounts, saveAccountsToFirebase, saveTransactionsToFirebase]);

  // Get category color by ID
  const getCategoryColor = useCallback((categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#9088a8';
  }, [categories]);

  // Get category name by ID
  const getCategoryName = useCallback((categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  }, [categories]);

  // Get account name by ID
  const getAccountName = useCallback((accountId) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || 'Unknown';
  }, [accounts]);

  const value = {
    // State
    accounts,
    categories,
    transactions,
    goals,
    loading,
    // Account functions
    addAccount,
    updateAccountBalance,
    // Transaction functions
    addTransaction,
    deleteTransaction,
    getMonthTransactions,
    // Category functions
    addCategory,
    getCategoryColor,
    getCategoryName,
    // Goal functions
    addGoal,
    updateGoalProgress,
    toggleGoalStep,
    // Analytics functions
    getTotalBalance,
    getMonthlyData,
    getIncomeVsSpendingBreakdown,
    getExpensesByCategory,
    getAccountName
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = React.useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
