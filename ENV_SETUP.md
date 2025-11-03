# Environment Variables Setup Guide

## Local Development (.env.local)

The project uses `.env.local` for local environment variables. This file is automatically ignored by git (already in `.gitignore`).

### Required Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
# These variables are prefixed with NEXT_PUBLIC_ to make them accessible in the browser
# Next.js will bundle these values at build time

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBX44sf-qYZKbZG48_yMWYJ6k2g__Oy_qc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=soulbalance-1e02e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=soulbalance-1e02e
```

### How It Works

1. **NEXT_PUBLIC_ prefix**: Variables with this prefix are bundled into the client-side JavaScript at build time, making them accessible in the browser.

2. **Automatic Loading**: Next.js automatically loads `.env.local` when you run `npm run dev` or `next dev`.

3. **Usage in Code**: The variables are accessed via `process.env.NEXT_PUBLIC_FIREBASE_API_KEY` etc., as shown in `src/lib/firebase.ts`.

4. **Security**: Since these are public (client-side), they're visible in the browser. This is expected for Firebase API keys, but ensure your Firebase security rules are properly configured.

## Verification

After creating `.env.local`:

1. Restart your Next.js development server (`npm run dev`)
2. Check the browser console - you should no longer see "Firebase auth is not initialized yet" warnings
3. The login page should work without the "Firebase no está inicializado" error

## Production Deployment (Netlify)

When deploying to Netlify, add these same environment variables in:

**Netlify Dashboard → Site settings → Build & deploy → Environment variables**

Add each variable:
- `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyBX44sf-qYZKbZG48_yMWYJ6k2g__Oy_qc`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `soulbalance-1e02e.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `soulbalance-1e02e`

**Important**: After adding environment variables in Netlify, you must trigger a new deployment for them to take effect.

## Firebase Configuration Reference

- **projectId**: `soulbalance-1e02e`
- **projectNumber**: `495046810996`
- **webapikey**: `AIzaSyBX44sf-qYZKbZG48_yMWYJ6k2g__Oy_qc`
- **authDomain**: `soulbalance-1e02e.firebaseapp.com` (derived from projectId)

## Troubleshooting

If you're still seeing Firebase initialization errors:

1. **Verify `.env.local` exists** in the project root (same level as `package.json`)
2. **Check variable names** - they must start with `NEXT_PUBLIC_`
3. **Restart the dev server** - environment variables are loaded at startup
4. **Check for typos** - especially in the API key (should start with `AIza`)
5. **Verify values** match exactly what's in Firebase Console

## Notes

- Never commit `.env.local` to version control (already in `.gitignore`)
- The `.env.local` file takes precedence over `.env` files
- Environment variables are bundled at build time, so changes require a rebuild
- For runtime changes, you'd need to use API routes or server-side props

