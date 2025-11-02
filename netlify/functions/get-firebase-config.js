// Netlify Function to serve Firebase config securely
exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Optional: Add origin check for extra security
  // const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  // const origin = event.headers.origin || event.headers.referer;
  
  // Return Firebase config from environment variables
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    // Add other Firebase config if needed:
    // authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    // storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  };

  // Validate that required config exists
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Missing Firebase configuration in environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Firebase configuration not available' })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Or restrict to your domain
      // 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    },
    body: JSON.stringify(firebaseConfig)
  };
};

