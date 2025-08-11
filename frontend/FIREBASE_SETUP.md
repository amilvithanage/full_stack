# Firebase Authentication Setup

This project now includes Firebase Authentication. Follow these steps to set it up:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## 3. Get Your Firebase Config

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web app icon (</>)
5. Register your app with a nickname
6. Copy the Firebase configuration object

## 4. Update Firebase Configuration

### Option 1: Direct Configuration (Quick Setup)
1. Open `src/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### Option 2: Environment Variables (Recommended for Production)
1. Create a `.env.local` file in the frontend directory
2. Add your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Note**: The `.env.local` file is automatically ignored by git for security.

## 5. Test the Authentication

1. Start your development server: `npm run dev`
2. You should see the login/signup form
3. Create a new account or sign in with existing credentials
4. After successful authentication, you'll see the Todo app

## 6. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Features

- **Email/Password Authentication**: Users can sign up and sign in
- **Protected Routes**: Todo list is only accessible to authenticated users
- **User Management**: Users can see their email and logout
- **Form Validation**: Proper validation for email and password fields
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on all device sizes

## Security Notes

- Firebase handles all authentication securely
- Passwords are never stored in plain text
- JWT tokens are managed automatically
- Session persistence across browser refreshes

## Troubleshooting

- Make sure your Firebase project has Authentication enabled
- Verify your Firebase config values are correct
- Check the browser console for any error messages
- Ensure you're using the correct Firebase project ID
