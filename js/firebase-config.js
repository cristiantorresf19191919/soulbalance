// Firebase Configuration Loader
// Fetches Firebase config from Netlify Function and initializes Firebase

(function() {
  'use strict';
  
  let firebaseConfigCache = null;
  let configLoadPromise = null;

  async function loadFirebaseConfig() {
    // Return cached config if available
    if (firebaseConfigCache) {
      return firebaseConfigCache;
    }

    // Return existing promise if load is in progress
    if (configLoadPromise) {
      return configLoadPromise;
    }

    // Load config from Netlify Function
    configLoadPromise = fetch('/.netlify/functions/get-firebase-config')
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { error: errorText };
          }
          
          console.error('❌ [FIREBASE CONFIG] Server error:', response.status, errorData);
          
          if (response.status === 500 && errorData.missing) {
            throw new Error(`Missing environment variables in Netlify: ${errorData.missing.join(', ')}. Please configure them in Netlify Dashboard.`);
          }
          
          throw new Error(`Failed to load Firebase config: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
        }
        
        const config = await response.json();
        
        // Debug logging
        console.log('✅ [FIREBASE CONFIG] Config loaded:', {
          hasApiKey: !!config.apiKey,
          apiKeyLength: config.apiKey ? config.apiKey.length : 0,
          apiKeyStart: config.apiKey ? config.apiKey.substring(0, 10) : 'N/A',
          hasProjectId: !!config.projectId,
          projectId: config.projectId || 'N/A',
          hasAuthDomain: !!config.authDomain
        });
        
        // Validate config
        if (!config.apiKey || !config.projectId) {
          console.error('❌ [FIREBASE CONFIG] Invalid config received:', config);
          throw new Error('Invalid Firebase configuration received: missing apiKey or projectId');
        }

        // Validate API key format
        if (!config.apiKey.startsWith('AIza')) {
          console.warn('⚠️ [FIREBASE CONFIG] API key format may be invalid (should start with "AIza")');
        }

        // Cache the config
        firebaseConfigCache = config;
        return config;
      })
      .catch((error) => {
        console.error('❌ [FIREBASE CONFIG] Error loading config:', error);
        // Clear promise on error so we can retry
        configLoadPromise = null;
        throw error;
      });

    return configLoadPromise;
  }

  // Initialize Firebase with config from Netlify Function
  async function initializeFirebase() {
    try {
      const config = await loadFirebaseConfig();
      
      // Final validation before initializing
      if (!config.apiKey || !config.apiKey.startsWith('AIza')) {
        throw new Error(`Invalid API key format. API key should start with "AIza". Received: ${config.apiKey ? config.apiKey.substring(0, 20) + '...' : 'undefined'}`);
      }
      
      if (!config.projectId) {
        throw new Error('Missing projectId in Firebase configuration');
      }
      
      // Ensure authDomain is set (required for Authentication)
      if (!config.authDomain && config.projectId) {
        config.authDomain = `${config.projectId}.firebaseapp.com`;
        console.log('⚠️ [FIREBASE] authDomain was missing, auto-generated:', config.authDomain);
      }
      
      console.log('🚀 [FIREBASE] Initializing with config:', {
        projectId: config.projectId,
        authDomain: config.authDomain,
        apiKeyFormat: config.apiKey ? config.apiKey.substring(0, 10) + '...' : 'MISSING',
        apiKeyLength: config.apiKey ? config.apiKey.length : 0
      });
      
      // Dynamic import of Firebase modules
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
      
      const app = initializeApp(config);
      console.log('✅ [FIREBASE] Firebase initialized successfully');
      
      return { app, config };
    } catch (error) {
      console.error('❌ [FIREBASE] Error initializing Firebase:', error);
      console.error('   Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Export for use in other scripts
  window.loadFirebaseConfig = loadFirebaseConfig;
  window.initializeFirebase = initializeFirebase;
})();

