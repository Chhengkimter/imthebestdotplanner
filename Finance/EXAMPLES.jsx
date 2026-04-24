// Example: Complete Integration with Planner Application

import React, { useEffect, useState } from 'react';
import FinanceModule from './Finance/Finance';
import { useFinance } from './Finance/FinanceContext';

/**
 * EXAMPLE 1: Basic Integration
 * Simply import and render the Finance Module
 */
export function BasicFinanceIntegration() {
  return (
    <div>
      <h1>My Planner</h1>
      <FinanceModule />
    </div>
  );
}

/**
 * EXAMPLE 2: With React Router Navigation
 * Add Finance as a route in your app
 */
export function RouterIntegration() {
  return (
    <div>
      <nav>
        <a href="/">Dashboard</a>
        <a href="/planner">Planner</a>
        <a href="/finance">Finance</a>
        <a href="/goals">Goals</a>
      </nav>
      
      {/* Route handling would go here */}
      <FinanceModule />
    </div>
  );
}

/**
 * EXAMPLE 3: With Firebase Persistence
 * Auto-save Finance data to Firebase
 */
export function FirebaseIntegration() {
  const { transactions, goals, accounts } = useFinance();
  const [userId] = useState('user123'); // Get from auth

  useEffect(() => {
    // Save to Firestore
    const saveToFirebase = async () => {
      try {
        // This is pseudo-code - adapt to your Firebase setup
        // await db.collection('users').doc(userId).set({
        //   finance: {
        //     transactions,
        //     goals,
        //     accounts,
        //     lastUpdated: new Date()
        //   }
        // });
        console.log('Finance data saved to Firebase');
      } catch (error) {
        console.error('Error saving to Firebase:', error);
      }
    };

    // Auto-save when data changes
    if (transactions.length > 0 || goals.length > 0) {
      saveToFirebase();
    }
  }, [transactions, goals, accounts, userId]);

  return <FinanceModule />;
}

/**
 * EXAMPLE 4: With Custom Navigation Bar
 * Integrate Finance with your existing navigation
 */
export function WithCustomNav() {
  const [currentPage, setCurrentPage] = useState('finance');

  return (
    <div>
      {/* Custom Navigation */}
      <nav style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'rgba(250, 248, 244, 0.92)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <button
          onClick={() => setCurrentPage('dashboard')}
          style={{ fontWeight: currentPage === 'dashboard' ? 'bold' : 'normal' }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentPage('planner')}
          style={{ fontWeight: currentPage === 'planner' ? 'bold' : 'normal' }}
        >
          Planner
        </button>
        <button
          onClick={() => setCurrentPage('finance')}
          style={{ fontWeight: currentPage === 'finance' ? 'bold' : 'normal' }}
        >
          Finance
        </button>
        <button
          onClick={() => setCurrentPage('goals')}
          style={{ fontWeight: currentPage === 'goals' ? 'bold' : 'normal' }}
        >
          Goals
        </button>
      </nav>

      {/* Page Content */}
      {currentPage === 'finance' && <FinanceModule />}
      {/* Other pages */}
    </div>
  );
}

/**
 * EXAMPLE 5: Custom Hook for Finance Data
 * Access finance data in other components
 */
export function useFinanceData() {
  const {
    accounts,
    transactions,
    goals,
    getTotalBalance,
    getMonthlyData,
    getIncomeVsSpendingBreakdown
  } = useFinance();

  return {
    totalBalance: getTotalBalance(),
    monthlyData: getMonthlyData(),
    breakdown: getIncomeVsSpendingBreakdown(),
    transactionCount: transactions.length,
    goalCount: goals.length,
    accountCount: accounts.length
  };
}

/**
 * EXAMPLE 6: Dashboard Widget
 * Show finance summary on your dashboard
 */
export function FinanceDashboardWidget() {
  const { totalBalance, transactionCount, goalCount } = useFinanceData();

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(90, 70, 120, 0.09)',
      border: '1px solid #e0d8c8'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
        Finance Summary
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div>
          <p style={{ color: '#9088a8', fontSize: '12px', textTransform: 'uppercase' }}>
            Total Balance
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8068d0' }}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>
        <div>
          <p style={{ color: '#9088a8', fontSize: '12px', textTransform: 'uppercase' }}>
            Transactions
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2a2230' }}>
            {transactionCount}
          </p>
        </div>
        <div>
          <p style={{ color: '#9088a8', fontSize: '12px', textTransform: 'uppercase' }}>
            Goals
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2a2230' }}>
            {goalCount}
          </p>
        </div>
      </div>
      <button style={{
        width: '100%',
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#8068d0',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        View Full Finance Module
      </button>
    </div>
  );
}

/**
 * EXAMPLE 7: Export Finance Data
 * Download financial data as JSON or CSV
 */
export function ExportFinanceData() {
  const { transactions, goals, accounts } = useFinance();

  const exportAsJSON = () => {
    const data = {
      transactions,
      goals,
      accounts,
      exportDate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    let csvContent = 'Date,Type,Amount,Category,Account,Description\n';
    
    transactions.forEach(t => {
      csvContent += `${t.date},${t.type},${t.amount},,${t.accountId},"${t.description}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <button onClick={exportAsJSON} style={{
        padding: '8px 16px',
        backgroundColor: '#48a872',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Export JSON
      </button>
      <button onClick={exportAsCSV} style={{
        padding: '8px 16px',
        backgroundColor: '#4890d8',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Export CSV
      </button>
    </div>
  );
}

/**
 * EXAMPLE 8: Advanced - Goals Sync with Planner
 * Share goals between Finance and Planner modules
 */
export function GoalsSyncExample() {
  const { goals, updateGoalProgress } = useFinance();

  // This could receive goals from your Planner module
  useEffect(() => {
    // Sync logic here
    // For example, update finance goals based on planner goals
  }, [goals]);

  return (
    <div>
      <h2>Goals (Synced with Planner)</h2>
      <ul>
        {goals.map(goal => (
          <li key={goal.id}>
            {goal.title}: ${goal.current} / ${goal.target}
            <progress
              value={goal.current}
              max={goal.target}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * EXAMPLE 9: Complete App Integration
 * Full example of integrating Finance into a complete app
 */
export function CompleteAppExample() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'planner', label: 'Planner', icon: '📅' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'todo', label: 'To-Do', icon: '✅' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '200px',
        backgroundColor: '#f2ede4',
        padding: '20px',
        borderRight: '1px solid #e0d8c8'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#8068d0',
          marginBottom: '32px'
        }}>
          ✿ Planner
        </h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                backgroundColor: currentPage === item.id ? '#8068d0' : 'transparent',
                color: currentPage === item.id ? 'white' : '#5a5070',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: currentPage === item.id ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {currentPage === 'dashboard' && <FinanceDashboardWidget />}
        {currentPage === 'finance' && <FinanceModule />}
        {/* Add other pages as needed */}
      </main>
    </div>
  );
}

export default CompleteAppExample;
