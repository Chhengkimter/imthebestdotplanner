import React, { useState } from 'react';
import { useFinance } from '../FinanceContext';

export const TransactionPanel = () => {
  const { transactions, categories, accounts, addTransaction, deleteTransaction, getCategoryColor, getAccountName } = useFinance();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    categoryId: '',
    accountId: accounts[0]?.id || 1,
    description: '',
    type: 'income'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.categoryId && formData.accountId) {
      addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
        accountId: parseInt(formData.accountId)
      });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        categoryId: '',
        accountId: accounts[0]?.id || 1,
        description: '',
        type: 'income'
      });
    }
  };

  const incomeTransactions = transactions.filter(t => t.type === 'income').sort((a, b) => new Date(b.date) - new Date(a.date));
  const expenseTransactions = transactions.filter(t => t.type === 'expense').sort((a, b) => new Date(b.date) - new Date(a.date));

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transactions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Income Column */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-400 mr-3"></span>
            Income
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {incomeTransactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No income transactions yet</p>
            ) : (
              incomeTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg group">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{categories.find(c => c.id === t.categoryId)?.name}</p>
                    <p className="text-xs text-gray-600">{t.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">+${t.amount.toFixed(2)}</p>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Spending Column */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 rounded-full bg-pink-400 mr-3"></span>
            Spending
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {expenseTransactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No spending transactions yet</p>
            ) : (
              expenseTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg group">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{categories.find(c => c.id === t.categoryId)?.name}</p>
                    <p className="text-xs text-gray-600">{t.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-pink-600">-${t.amount.toFixed(2)}</p>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Category - Right aligned */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <div className="flex gap-2">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="">Select...</option>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account</label>
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-300 text-white rounded-lg font-semibold text-sm hover:shadow-md transition"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
