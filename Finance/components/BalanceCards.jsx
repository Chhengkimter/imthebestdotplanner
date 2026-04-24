import React from 'react';
import { useFinance } from '../FinanceContext';

export const BalanceCards = () => {
  const { accounts, getTotalBalance, addAccount } = useFinance();
  const totalBalance = getTotalBalance();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Account Balance</h2>
        <button
          onClick={() => {
            const name = prompt('Account name:');
            if (name) addAccount(name);
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-300 text-white rounded-full text-sm font-semibold hover:shadow-md transition"
        >
          + Add Account
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-6 shadow-sm border border-purple-200">
        <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">Total Balance</p>
        <h3 className="text-4xl font-bold text-gray-800">
          ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <p className="text-gray-600 text-sm mt-2">Across {accounts.length} accounts</p>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map(account => (
          <div
            key={account.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
            style={{ borderLeftWidth: '4px', borderLeftColor: account.color }}
          >
            <p className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-3">
              {account.name}
            </p>
            <p className="text-2xl font-bold text-gray-800">
              ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-xs">Account #1</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
