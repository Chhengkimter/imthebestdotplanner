# Finance Module - Documentation

## Overview

The Finance Module is a comprehensive financial management system built with React, designed to integrate seamlessly into your Planner application. It provides complete financial tracking with budgeting, transaction management, savings goals, and visual analytics.

## Features

### 1. Account & Balance Dashboard
- **Main Balance Card**: Displays total balance across all accounts
- **Account Cards**: Individual cards for each account with color-coding
- **Add Account Button**: Dynamically create new account categories
- **Real-time Balance Updates**: Balances update automatically when transactions are added

### 2. Transaction Split-Panel
- **Side-by-Side Layout**: Income and Spending columns for easy comparison
- **Transaction Form**: Add income or expense with the following fields:
  - **Date**: Defaults to today, customizable
  - **Amount**: Transaction value
  - **Category**: Color-coded dropdown selector
  - **Account**: Select which account to deduct/add to
  - **Description/Note**: Optional note for the transaction
- **Color-Coded Categories**: Visual consistency across the application
- **Delete Functionality**: Remove transactions with hover-to-reveal delete buttons

### 3. Savings Goals
- **Goal Creation**: Add new savings goals with target amounts
- **Progress Tracking**: Visual progress bar with percentage
- **Checkable Steps**: Track milestones within each goal
- **Real-time Updates**: Update current amount to track progress
- **Responsive Cards**: View multiple goals at once

### 4. Visual Analytics
- **Income vs Spending vs Savings Pie Chart**: Overview of financial distribution
- **Monthly Comparison Bar Chart**: Track income vs spending trends over 12 months
- **Expense by Category Pie Chart**: Breakdown of spending by category
- **Summary Statistics Cards**: Quick view of total income, spending, and savings

## Data Schema

### Accounts
```javascript
{
  id: number,
  name: string,
  balance: number,
  color: string (hex color code)
}
```

### Categories
```javascript
{
  id: number,
  name: string,
  color: string (hex color code),
  type: 'income' | 'expense'
}
```

### Transactions
```javascript
{
  id: number,
  date: string (YYYY-MM-DD format),
  amount: number,
  type: 'income' | 'expense',
  categoryId: number,
  accountId: number,
  description: string
}
```

### Goals
```javascript
{
  id: number,
  title: string,
  target: number,
  current: number,
  steps: [
    {
      id: number,
      text: string,
      completed: boolean
    }
  ]
}
```

## Installation

### Prerequisites
- React 16.8 or higher
- Recharts library (for charts)
- Tailwind CSS (for styling)

### Dependencies
```bash
npm install recharts
npm install -D tailwindcss
```

### Setup

1. **Import the Finance Module in your main app**:
```javascript
import FinanceModule from './Finance/Finance';

function App() {
  return (
    <div>
      {/* Your other components */}
      <FinanceModule />
    </div>
  );
}
```

2. **Configure Tailwind CSS** in your `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom color palette
      }
    },
  },
  plugins: [],
}
```

3. **Include Tailwind CSS** in your main CSS file:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## File Structure

```
Finance/
├── Finance.jsx                 # Main component
├── FinanceContext.jsx          # Context API for state management
├── components/
│   ├── BalanceCards.jsx       # Account & balance display
│   ├── TransactionPanel.jsx   # Income/Spending transaction form and lists
│   ├── SavingsGoals.jsx       # Savings goals with progress tracking
│   └── Analytics.jsx          # Charts and financial analytics
└── README.md                   # This file
```

## Context API - useFinance Hook

The `useFinance` custom hook provides access to all financial functions:

```javascript
import { useFinance } from './FinanceContext';

function MyComponent() {
  const {
    // State
    accounts,
    categories,
    transactions,
    goals,
    
    // Functions
    addAccount,
    addTransaction,
    addCategory,
    addGoal,
    updateGoalProgress,
    toggleGoalStep,
    
    // Analytics
    getTotalBalance,
    getMonthlyData,
    getIncomeVsSpendingBreakdown,
    getExpensesByCategory
  } = useFinance();
}
```

## Key Functions

### Account Management
- `addAccount(name, color)` - Create new account
- `updateAccountBalance(accountId, type, amount)` - Update balance

### Transaction Management
- `addTransaction(transaction)` - Add income or expense
- `deleteTransaction(transactionId)` - Remove transaction
- `getMonthTransactions(year, month)` - Get transactions for specific month

### Category Management
- `addCategory(name, color, type)` - Create new category
- `getCategoryColor(categoryId)` - Get category color
- `getCategoryName(categoryId)` - Get category name

### Goal Management
- `addGoal(title, target)` - Create new savings goal
- `updateGoalProgress(goalId, currentAmount)` - Update goal progress
- `toggleGoalStep(goalId, stepId)` - Mark step as complete/incomplete

### Analytics
- `getTotalBalance()` - Get sum of all account balances
- `getMonthlyData()` - Get income/expense by month
- `getIncomeVsSpendingBreakdown()` - Get data for pie chart
- `getExpensesByCategory()` - Get expense breakdown by category

## Styling

The module uses:
- **Tailwind CSS** for utility-based styling
- **Pastel Color Palette** for soft aesthetic
- **Responsive Design** that works on mobile, tablet, and desktop
- **Hover Effects** for better interactivity
- **Smooth Transitions** for polished UX

### Color Palette
- Primary Purple: `#8068d0`
- Secondary Pink: `#e89abf` / `#c96090`
- Success Green: `#48a872`
- Warning Peach: `#d87040`
- Neutral Cream: `#faf8f4`

## Responsive Behavior

- **Mobile (< 768px)**: Single column layout with full-width components
- **Tablet (768px - 1024px)**: Two-column layout for transaction panel
- **Desktop (> 1024px)**: Multi-column grids and side-by-side layouts

### Mobile Optimization
- Categories are in a compact select form on mobile
- Charts scale responsively
- All buttons remain accessible with adequate touch targets

## DRY Principle Implementation

The module follows the DRY (Don't Repeat Yourself) principle:

1. **Reusable Components**: Each section (BalanceCards, TransactionPanel, etc.) is self-contained
2. **Centralized State**: FinanceContext manages all data
3. **Custom Hook**: `useFinance` provides consistent access to state and functions
4. **Shared Utilities**: Category and account lookup functions are centralized
5. **Goal Component Reuse**: Goal cards can be used in both Planner and Finance modules

## Integration with Planner

To integrate with your existing Planner application:

1. **Reuse Goal Components**: The goal structure matches your Planner goals
2. **Shared Context**: Can create a parent context that shares goal data between modules
3. **Navigation**: Add Finance link to your main navigation bar
4. **Styling**: Colors and fonts match your Planner theme

## Advanced Usage

### Custom Data Persistence

To persist data to Firebase/Firestore:

```javascript
import { useEffect } from 'react';
import { useFinance } from './FinanceContext';

function PersistenceLayer() {
  const { transactions, goals, accounts } = useFinance();

  useEffect(() => {
    // Save to Firestore
    db.collection('finance').doc('data').set({
      transactions,
      goals,
      accounts,
      lastUpdated: new Date()
    });
  }, [transactions, goals, accounts]);

  return null;
}
```

### Export Data

```javascript
function ExportData() {
  const { transactions, goals, accounts } = useFinance();

  const exportAsJSON = () => {
    const data = { transactions, goals, accounts };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finance-data.json';
    link.click();
  };

  return <button onClick={exportAsJSON}>Export Data</button>;
}
```

## Performance Optimization

1. **Memoization**: Use `useCallback` for expensive computations
2. **Lazy Loading**: Load charts only when visible
3. **Virtual Lists**: For large transaction lists, use react-window
4. **Context Optimization**: Split context into smaller, focused providers if needed

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Troubleshooting

### Recharts not rendering
- Ensure ResponsiveContainer has a defined height
- Check that data array is not empty
- Verify chart component is within a div with a defined width

### Context not accessible
- Ensure component is wrapped in FinanceProvider
- Check that useFinance is called within a component that's a child of FinanceProvider

### Balance not updating
- Verify transaction type is 'income' or 'expense'
- Check accountId matches an existing account
- Ensure amount is a valid number

## Future Enhancements

- [ ] Budget limits and alerts
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Receipt scanning/OCR
- [ ] Investment portfolio tracking
- [ ] Tax report generation
- [ ] Bill payment reminders
- [ ] Collaborative budgeting
- [ ] Machine learning spending predictions
- [ ] Mobile app version

## Support

For issues or questions, please refer to the documentation or check the component comments.

## License

This Finance Module is part of the Planner application and follows the same license.
