# Firebase Integration - Quick Reference

## What Changed

Your Finance module now reads from and writes to Firebase Firestore automatically.

## Files Added/Modified

### New Files:
- **firebaseConfig.js** - Firebase initialization and configuration
- **FIREBASE_SETUP.md** - Complete setup instructions
- **.env.example** - Example environment variables template

### Modified Files:
- **FinanceContext.jsx** - Added Firebase integration for all state operations

## Quick Setup (3 Steps)

### 1. Install Firebase
```bash
npm install firebase
```

### 2. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com)
- Create a new project
- Set up Firestore Database
- Copy your config from Project Settings

### 3. Set Environment Variables
Create `.env` file in your project root with your Firebase config:
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

## How It Works

✅ **Automatic Loading**
- Data loads from Firestore when app starts
- Falls back to default data if Firestore unavailable

✅ **Automatic Saving**
- Every add/update/delete operation saves to Firestore
- No extra code needed in components

✅ **Real-time Persistence**
- All financial data stored in Firestore
- Data persists across sessions
- Accessible from any device

## Component Usage (No Changes Needed)

Your components work exactly the same:
```javascript
const { accounts, addTransaction, loading } = useFinance();
```

The `loading` state is now available to show loading indicators.

## Data Auto-Saved
- ✅ New accounts
- ✅ New transactions
- ✅ Account balance updates
- ✅ New categories
- ✅ New goals
- ✅ Goal progress updates
- ✅ Goal step toggles
- ✅ Transaction deletions

## Firestore Structure

```
users/
  └── user-default/
      └── data/
          ├── accounts (stores all accounts)
          ├── categories (stores all categories)
          ├── transactions (stores all transactions)
          └── goals (stores all goals)
```

## Troubleshooting

**Q: Data not saving?**
A: Check browser console for errors. Verify `.env` has correct Firebase config.

**Q: "Module not found: firebase"?**
A: Run `npm install firebase`

**Q: Permission errors in Firestore?**
A: Update Firestore rules to allow read/write (see FIREBASE_SETUP.md)

**Q: Default data showing instead of Firebase data?**
A: Firestore might not be initialized yet. Check browser console for errors.

## Next Steps

1. Follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup
2. Test adding transactions to verify data saves to Firestore
3. Check Firebase Console → Firestore to see your data
4. (Optional) Add authentication for multi-user support

## Environment Variables Needed

All these must be in your `.env` file:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

Use `.env.example` as a template!
