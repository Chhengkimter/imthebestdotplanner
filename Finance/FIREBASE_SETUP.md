# Firebase Integration Guide for Finance Module

This guide explains how to set up Firebase Firestore for your Finance module.

## Prerequisites

- A Google account
- Node.js and npm installed
- Your Finance module React project

## Step 1: Install Firebase Dependencies

Run the following command in your project root:

```bash
npm install firebase
```

Or if using yarn:

```bash
yarn add firebase
```

## Step 2: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project (e.g., "ImTheBestDotPlanner")
4. Follow the setup wizard and create the project

## Step 3: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose a location (closest to your users)
4. Select "Start in test mode" (for development) or "Start in production mode" (with proper security rules)
5. Click "Create"

## Step 4: Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **General** tab, scroll down to "Your apps"
3. Select the web app (or create one with `</>` icon)
4. Copy the firebaseConfig object

Your config should look like:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
}
```

## Step 5: Set Up Environment Variables

Create a `.env` file in your project root (same level as `package.json`):

```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
```

Replace each value with your actual Firebase config values.

**Important:** Never commit `.env` to version control. Add it to `.gitignore`:

```
.env
.env.local
```

## Step 6: Firestore Security Rules (Optional but Recommended)

For production, set up proper security rules in Firestore:

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /data/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

This restricts data access to authenticated users only.

## Step 7: Add Authentication (Optional)

To enable authentication:

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Enable desired sign-in methods (Email/Password, Google, etc.)

## Data Structure

Your Firestore will have this structure:

```
users/
  └── {userId}/
      └── data/
          ├── accounts
          │   └── items: [{id, name, balance, color}, ...]
          ├── categories
          │   └── items: [{id, name, color, type}, ...]
          ├── transactions
          │   └── items: [{id, date, amount, type, categoryId, accountId, description}, ...]
          └── goals
              └── items: [{id, title, target, current, steps}, ...]
```

## Usage in Your App

The Finance module will automatically:
1. Load data from Firebase when the app starts
2. Save data to Firebase whenever you add/update/delete anything
3. Fall back to default data if Firebase is unavailable

### useFinance Hook

Use the `useFinance()` hook in your components:

```javascript
import { useFinance } from './Finance';

function MyComponent() {
  const {
    accounts,
    transactions,
    addTransaction,
    loading
  } = useFinance();

  if (loading) return <div>Loading...</div>;

  return (
    // Your component JSX
  );
}
```

## Common Issues & Solutions

### Issue: "Module not found: firebase"
**Solution:** Make sure you installed Firebase:
```bash
npm install firebase
```

### Issue: "firebaseConfig is not defined"
**Solution:** Check that your `.env` file exists and contains all required variables. Restart your dev server after adding `.env`.

### Issue: "Permission denied" in console
**Solution:** Update your Firestore security rules to allow read/write access, or ensure you're using authentication properly.

### Issue: Data not syncing
**Solution:** 
- Check browser console for error messages
- Verify Firestore database is created
- Check that your config values are correct
- Ensure Firestore rules allow your requests

## Testing

To test Firebase locally without committing secrets:

1. Create a `.env.local` file with your Firebase config
2. This file is auto-ignored by Create React App
3. Environment variables are loaded automatically

## Next Steps

1. **Add Authentication:** Implement user login/signup with Firebase Auth
2. **Real-time Sync:** Use `onSnapshot()` for live data updates
3. **Offline Support:** Add Firebase offline persistence
4. **Backup & Export:** Set up regular Firestore backups

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
