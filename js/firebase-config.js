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
          throw new Error(`Failed to load Firebase config: ${response.status} ${response.statusText}`);
        }
        const config = await response.json();
        
        // Validate config
        if (!config.apiKey || !config.projectId) {
          throw new Error('Invalid Firebase configuration received');
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
      
      // Dynamic import of Firebase modules
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
      
      const app = initializeApp(config);
      console.log('✅ [FIREBASE] Firebase initialized successfully');
      
      return { app, config };
    } catch (error) {
      console.error('❌ [FIREBASE] Error initializing Firebase:', error);
      throw error;
    }
  }

  // Export for use in other scripts
  window.loadFirebaseConfig = loadFirebaseConfig;
  window.initializeFirebase = initializeFirebase;
})();

