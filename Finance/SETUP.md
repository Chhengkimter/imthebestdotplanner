# Finance Module Setup Guide

## Quick Start

### 1. Install Dependencies

Add these packages to your `package.json`:

```bash
npm install react recharts firebase
npm install -D tailwindcss postcss autoprefixer
```

Or if using yarn:

```bash
yarn add react recharts firebase
yarn add -D tailwindcss postcss autoprefixer
```

### 2. Configure Tailwind CSS

Initialize Tailwind (if not already initialized):

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors (optional)
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Nunito'", "sans-serif"],
      }
    },
  },
  plugins: [],
}
```

### 3. Set Up Firebase (NEW!)

Follow the complete guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) or quick start in [FIREBASE_QUICKSTART.md](./FIREBASE_QUICKSTART.md)

**TL;DR:**
1. Install Firebase: `npm install firebase`
2. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
3. Create Firestore Database
4. Copy config to `.env` file (use `.env.example` as template)
5. Done! Data now syncs automatically to Firebase

## Project Structure

```
Finance/
├── Finance.jsx              # Main component
├── FinanceContext.jsx       # State management with Firebase
├── firebaseConfig.js        # Firebase configuration
├── firebaseUtils.js         # Helper utilities for Firebase
├── index.js                 # Exports
├── .env.example            # Environment variables template
├── SETUP.md               # This file
├── FIREBASE_SETUP.md      # Detailed Firebase setup
├── FIREBASE_QUICKSTART.md # Quick Firebase reference
└── components/
    ├── Analytics.jsx
    ├── BalanceCards.jsx
    ├── SavingsGoals.jsx
    └── TransactionPanel.jsx
```

## Environment Variables

Create a `.env` file with your Firebase config:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

See `.env.example` for the template.

## Features

✅ **React Context API** - State management  
✅ **Firestore Integration** - Cloud data persistence  
✅ **Automatic Syncing** - Data saves automatically  
✅ **Real-time Updates** - Up-to-date financial information  
✅ **Offline Fallback** - Works with default data if offline  
✅ **Component Library** - Pre-built UI components  
✅ **Analytics** - Charts and data visualization  

## Using the Finance Module

```javascript
import { FinanceModule } from './Finance';

function App() {
  return <FinanceModule />;
}
```

## useFinance Hook

Access finance data in any component:

```javascript
import { useFinance } from './Finance';

function MyComponent() {
  const {
    accounts,
    transactions,
    goals,
    addTransaction,
    loading
  } = useFinance();

  if (loading) return <div>Loading...</div>;

  return (
    // Your component
  );
}
```

## Available Functions

### Account Operations
- `addAccount(name, color)` - Create new account
- `updateAccountBalance(accountId, type, amount)` - Update balance

### Transaction Operations
- `addTransaction(transaction)` - Record transaction
- `deleteTransaction(transactionId)` - Remove transaction
- `getMonthTransactions(year, month)` - Filter by month

### Category Operations
- `addCategory(name, color, type)` - Create category
- `getCategoryColor(categoryId)` - Get category color
- `getCategoryName(categoryId)` - Get category name

### Goal Operations
- `addGoal(title, target)` - Create savings goal
- `updateGoalProgress(goalId, amount)` - Update goal progress
- `toggleGoalStep(goalId, stepId)` - Toggle goal step completion

### Analytics
- `getTotalBalance()` - Sum of all account balances
- `getMonthlyData()` - Income vs expense by month
- `getIncomeVsSpendingBreakdown()` - Overall breakdown
- `getExpensesByCategory()` - Spending by category

## Firebase Data Structure

Data is automatically organized in Firestore:

```
users/
  └── user-default/
      └── data/
          ├── accounts/items
          ├── categories/items
          ├── transactions/items
          └── goals/items
```

## Troubleshooting

### Firebase not initialized?
- Check `.env` file has all required variables
- Restart dev server after adding `.env`
- Check browser console for errors

### Data not syncing?
- Verify Firestore Database is created
- Check Firestore security rules allow read/write
- Ensure environment variables are correct

### Module not found: firebase?
- Run `npm install firebase`
- Restart dev server

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up Firebase project
3. ✅ Configure environment variables
4. ✅ Import and use FinanceModule
5. 📅 (Optional) Add authentication for multi-user support
6. 📅 (Optional) Set up Firestore backup strategy

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Reference](https://firebase.google.com/docs/firestore)
- [React Context API](https://react.dev/reference/react/useContext)
- [Recharts Documentation](https://recharts.org)

## Support

For issues:
1. Check browser console for error messages
2. Review [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
3. Check Firebase Console for data structure
4. Verify environment variables in `.env`

```

### 3. Include Tailwind in Your CSS

In your main CSS file (e.g., `index.css` or `App.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Import Finance Module

In your main React component (e.g., `App.jsx`):

```javascript
import React from 'react';
import FinanceModule from './Finance/Finance';
import './index.css'; // Make sure Tailwind CSS is imported

function App() {
  return (
    <div>
      {/* Your navigation and other components */}
      <FinanceModule />
    </div>
  );
}

export default App;
```

### 5. (Optional) Integrate with Planner Navigation

Add a link to the Finance Module in your planner navigation:

```javascript
<nav>
  <a href="#planner">Planner</a>
  <a href="#dashboard">Dashboard</a>
  <a href="#goals">Goals</a>
  <a href="#finance">Finance</a> {/* Add this */}
</nav>
```

## Minimum Requirements

- **Node.js**: 14+
- **React**: 16.8+
- **npm/yarn**: Latest version

## Package Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "recharts": "^2.7.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

## File Structure Setup

```
your-project/
├── public/
├── src/
│   ├── components/
│   ├── Finance/                    <-- Add this folder
│   │   ├── Finance.jsx
│   │   ├── FinanceContext.jsx
│   │   ├── index.js
│   │   ├── README.md
│   │   └── components/
│   │       ├── BalanceCards.jsx
│   │       ├── TransactionPanel.jsx
│   │       ├── SavingsGoals.jsx
│   │       └── Analytics.jsx
│   ├── App.jsx
│   ├── index.css
│   └── index.jsx
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Integration Examples

### With React Router

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FinanceModule from './Finance/Finance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/finance" element={<FinanceModule />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}
```

### With Redux (Optional)

If you're using Redux, you can create a middleware to sync Finance data:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    transactions: [],
    goals: [],
    accounts: []
  },
  reducers: {
    setFinanceData: (state, action) => {
      state.transactions = action.payload.transactions;
      state.goals = action.payload.goals;
      state.accounts = action.payload.accounts;
    }
  }
});

export default financeSlice.reducer;
```

### With Firebase

```javascript
import { useEffect } from 'react';
import { useFinance } from './Finance/FinanceContext';
import { db } from './firebase-config';

function FirebaseSync() {
  const { transactions, goals, accounts } = useFinance();

  useEffect(() => {
    // Save to Firebase
    db.collection('users').doc(userId).set({
      finance: {
        transactions,
        goals,
        accounts,
        lastUpdated: new Date()
      }
    });
  }, [transactions, goals, accounts]);

  return null;
}
```

## Environment Variables (Optional)

Create a `.env` file if you plan to use external APIs:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## Common Issues & Solutions

### Issue: Tailwind CSS not working

**Solution**: 
1. Ensure `tailwind.config.js` includes all your file paths
2. Run `npm run build` or check that PostCSS is properly configured
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Issue: Recharts showing blank charts

**Solution**:
1. Ensure data is not empty before rendering
2. Add height to ResponsiveContainer
3. Check that colors are valid hex codes

### Issue: Import errors for Finance components

**Solution**:
1. Verify file paths match your project structure
2. Use correct relative paths (e.g., `../../Finance`)
3. Ensure all components are exported in `index.js`

## Performance Optimization Tips

### 1. Code Splitting

```javascript
import React, { lazy, Suspense } from 'react';

const FinanceModule = lazy(() => import('./Finance/Finance'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FinanceModule />
    </Suspense>
  );
}
```

### 2. Memoization

```javascript
import React, { memo } from 'react';
import { BalanceCards } from './Finance';

const MemoizedBalanceCards = memo(BalanceCards);
```

## Testing Setup

### Jest + React Testing Library

```javascript
import { render, screen } from '@testing-library/react';
import { FinanceProvider } from './Finance/FinanceContext';
import FinanceModule from './Finance/Finance';

test('renders finance module', () => {
  render(
    <FinanceProvider>
      <FinanceModule />
    </FinanceProvider>
  );
  expect(screen.getByText(/Finance/)).toBeInTheDocument();
});
```

## Build & Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `build` folder.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## Next Steps

1. **Customize Colors**: Update the color palette in components to match your brand
2. **Add Persistence**: Integrate with Firebase or your backend
3. **Implement Authentication**: Add user login to protect financial data
4. **Create Reports**: Add PDF export functionality
5. **Mobile App**: Consider building a React Native version

## Support & Resources

- [Recharts Documentation](https://recharts.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [Finance Module README](./README.md)

## Additional Configuration Files

### postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### .gitignore

Add these to ignore unnecessary files:

```
node_modules/
build/
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Performance Metrics

After setup, you can check your app's performance:

```bash
npm install -g lighthouse
lighthouse https://your-app-url.com
```

Target metrics:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

**Need help?** Check the [README.md](./README.md) for detailed documentation.
