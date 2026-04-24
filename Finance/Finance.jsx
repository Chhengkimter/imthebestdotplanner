import React from 'react';
import { FinanceProvider } from './FinanceContext';
import { BalanceCards } from './components/BalanceCards';
import { TransactionPanel } from './components/TransactionPanel';
import { SavingsGoals } from './components/SavingsGoals';
import { Analytics } from './components/Analytics';

const FinanceModule = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#faf8f4' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Finance <span style={{ color: '#8068d0' }}>Module</span>
            </h1>
            <p className="text-gray-600 text-sm mt-2 uppercase tracking-wider">Manage your finances with ease</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Balance Cards Section */}
          <BalanceCards />

          {/* Transaction Panel Section */}
          <TransactionPanel />

          {/* Savings Goals Section */}
          <SavingsGoals />

          {/* Analytics Section */}
          <Analytics />
        </div>
      </div>
    </FinanceProvider>
  );
};

export default FinanceModule;
