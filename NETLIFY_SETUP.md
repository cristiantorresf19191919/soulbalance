# Netlify Environment Variables Setup Guide

This guide will help you configure Firebase environment variables in Netlify to keep your sensitive credentials secure.

## 🔐 Setting Up Environment Variables in Netlify

### Step 1: Access Netlify Dashboard

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site

### Step 2: Add Environment Variables

1. Navigate to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add the following variables:

   | Variable Name | Value | Description |
   |--------------|-------|-------------|
   | `FIREBASE_API_KEY` | `AIzaSyDuPgi8cPs-Mlpx0UyAhFCuq5e7vhQTTxM` | Your Firebase API Key |
   | `FIREBASE_PROJECT_ID` | `barber-s-app-18e7e` | Your Firebase Project ID |

4. Click **Save**

### Step 3: Deploy Your Site

After adding the environment variables:

1. **Redeploy your site** (if it's already deployed):
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - This will apply the new environment variables

2. Or **push to your Git repository** (if connected):
   - Netlify will automatically redeploy on push

## 🧪 Testing Locally (Optional)

For local development, you can create a `.env` file (make sure it's in `.gitignore`):

```bash
# .env (don't commit this file!)
FIREBASE_API_KEY=AIzaSyDuPgi8cPs-Mlpx0UyAhFCuq5e7vhQTTxM
FIREBASE_PROJECT_ID=barber-s-app-18e7e
```

However, **Netlify Functions don't run locally by default**. You have two options:

### Option A: Use Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally with functions support
netlify dev
```

### Option B: Use Hardcoded Config for Local Dev

You can create a fallback in `js/firebase-config.js` for local development:

```javascript
// Fallback for local development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  firebaseConfigCache = {
    apiKey: "YOUR_API_KEY_HERE",
    projectId: "YOUR_PROJECT_ID_HERE"
  };
}
```

## 🔒 Security Best Practices

1. **Never commit environment variables to Git**
   - Add `.env` to `.gitignore`
   - Only use Netlify Dashboard for production

2. **Restrict CORS (Optional)**
   - You can set `ALLOWED_ORIGINS` in Netlify environment variables
   - Update `get-firebase-config.js` to use it for stricter security

3. **Use different configs for different environments**
   - Netlify supports **Context-specific variables**:
     - Production: Site Settings → Environment Variables
     - Deploy Previews: Same location, select context
     - Branch Deploys: Same location, select context

## 🐛 Troubleshooting

### Function Not Found (404)

- Make sure the function is in `netlify/functions/get-firebase-config.js`
- Check that `netlify.toml` is configured correctly
- Redeploy your site after creating the function

### Environment Variables Not Working

1. Check that variables are set in Netlify Dashboard
2. Make sure you redeployed after adding variables
3. Check function logs: **Functions** tab → Click on function → View logs

### CORS Errors

- The function allows all origins by default (`Access-Control-Allow-Origin: *`)
- To restrict, set `ALLOWED_ORIGINS` in environment variables and update the function

## 📝 How It Works

1. Client-side JavaScript calls `/.netlify/functions/get-firebase-config`
2. Netlify Function reads environment variables
3. Returns Firebase config as JSON (only safe public config values)
4. Client initializes Firebase with the config

This keeps sensitive values server-side while still allowing client-side Firebase initialization.

## ✅ Verification

After deployment, check the browser console:

```
✅ [FIREBASE] Firebase initialized successfully
```

If you see errors, check:
- Function logs in Netlify Dashboard
- Browser Network tab for the function request
- Console for error messages

