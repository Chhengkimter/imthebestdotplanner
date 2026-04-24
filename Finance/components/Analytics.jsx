import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from '../FinanceContext';

export const Analytics = () => {
  const { getIncomeVsSpendingBreakdown, getMonthlyData, getExpensesByCategory } = useFinance();

  const incomeVsSpending = getIncomeVsSpendingBreakdown();
  const monthlyData = getMonthlyData();
  const expensesByCategory = getExpensesByCategory();

  // Prepare pie chart data
  const pieData = incomeVsSpending.map(item => ({
    name: item.name,
    value: Math.round(item.value),
    color: item.color
  }));

  // Prepare bar chart data - show last 12 months
  const barData = monthlyData.slice(-12).map(item => ({
    month: new Date(`${item.month}-01`).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    Income: Math.round(item.income),
    Spending: Math.round(item.expense)
  }));

  // Prepare expense category pie chart
  const categoryData = expensesByCategory.map(item => ({
    name: item.name,
    value: Math.round(item.value),
    color: item.color
  }));

  const COLORS = ['#fad8c0', '#e89abf', '#48a872'];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Financial Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Income vs Spending Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income vs Spending vs Savings</h3>
          {pieData.length > 0 && pieData.some(item => item.value > 0) ? (
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 20px rgba(90, 80, 120, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No data available yet</p>
            </div>
          )}
        </div>

        {/* Expense by Category Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h3>
          {categoryData.length > 0 && categoryData.some(item => item.value > 0) ? (
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 20px rgba(90, 80, 120, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No spending data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Income vs Spending Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Income vs Spending</h3>
        {barData.length > 0 && (
          <div className="overflow-x-auto">
            <ResponsiveContainer width={barData.length > 6 ? '100%' : 600} height={400} minWidth={600}>
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 20px rgba(90, 80, 120, 0.1)'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar dataKey="Income" fill="#fad8c0" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Spending" fill="#e89abf" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {barData.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No monthly data available</p>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {incomeVsSpending.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            style={{ borderLeftWidth: '4px', borderLeftColor: item.color }}
          >
            <p className="text-gray-600 font-semibold text-sm uppercase tracking-wider mb-2">{item.name}</p>
            <p className="text-3xl font-bold text-gray-800">
              ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
