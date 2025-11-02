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
  const apiKey = process.env.FIREBASE_API_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  
  // Debug logging (only in Netlify logs, not exposed to client)
  console.log('🔍 [FIREBASE CONFIG] Environment variables check:');
  console.log('  - FIREBASE_API_KEY exists:', !!apiKey);
  console.log('  - FIREBASE_API_KEY length:', apiKey ? apiKey.length : 0);
  console.log('  - FIREBASE_API_KEY starts with:', apiKey ? apiKey.substring(0, 10) : 'N/A');
  console.log('  - FIREBASE_PROJECT_ID exists:', !!projectId);
  console.log('  - FIREBASE_PROJECT_ID value:', projectId || 'N/A');

  const firebaseConfig = {
    apiKey: apiKey,
    projectId: projectId,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || (projectId ? `${projectId}.firebaseapp.com` : undefined),
    // Add other Firebase config if needed:
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.FIREBASE_APP_ID,
  };

  // Validate that required config exists
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    const missingVars = [];
    if (!firebaseConfig.apiKey) missingVars.push('FIREBASE_API_KEY');
    if (!firebaseConfig.projectId) missingVars.push('FIREBASE_PROJECT_ID');
    
    console.error('❌ [FIREBASE CONFIG] Missing environment variables:', missingVars.join(', '));
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Firebase configuration not available',
        missing: missingVars,
        message: `Please set the following environment variables in Netlify: ${missingVars.join(', ')}`
      })
    };
  }

  // Validate API key format (should start with "AIza" and be ~39 characters)
  if (!firebaseConfig.apiKey.startsWith('AIza') || firebaseConfig.apiKey.length < 30) {
    console.warn('⚠️ [FIREBASE CONFIG] API key format may be invalid');
    console.warn('  - Expected format: Starts with "AIza" and ~39 characters');
    console.warn('  - Actual value:', firebaseConfig.apiKey.substring(0, 20) + '...');
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

