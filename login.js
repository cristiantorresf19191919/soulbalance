// ============================================
// LOGIN FUNCTIONALITY
// ============================================

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

// Función para inicializar verificación de autenticación
function initAuthCheck() {
  if (!window.firebaseAuth || !window.firebaseOnAuthStateChanged) {
    console.log('⏳ [LOGIN] Firebase aún no está disponible, esperando...');
    // Reintentar después de un momento
    setTimeout(initAuthCheck, 100);
    return;
  }

  console.log('✅ [LOGIN] Firebase listo, verificando autenticación...');
  
  // Verificar si ya está autenticado
  window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
    if (user) {
      // Usuario ya autenticado, redirigir a admin
      console.log('✅ [LOGIN] Usuario ya autenticado, redirigiendo...');
      window.location.href = 'admin.html';
    }
  });
}

// Esperar a que Firebase esté listo o que el DOM esté cargado
if (window.firebaseReady) {
  // Firebase ya está listo
  initAuthCheck();
} else {
  // Esperar al evento de Firebase listo o al DOM
  window.addEventListener('firebaseReady', initAuthCheck);
  document.addEventListener('DOMContentLoaded', () => {
    // Si Firebase aún no está listo, esperar un poco más
    if (!window.firebaseReady) {
      setTimeout(() => {
        if (window.firebaseOnAuthStateChanged) {
          initAuthCheck();
        }
      }, 500);
    }
  });
}

// Manejar envío del formulario
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Validación básica
  if (!email || !password) {
    showError('Por favor, completa todos los campos');
    return;
  }
  
  // Deshabilitar botón y mostrar loading
  loginBtn.disabled = true;
  const originalText = loginBtn.innerHTML;
  loginBtn.innerHTML = '<span>Iniciando sesión...</span> <span class="btn-icon">⏳</span>';
  loginError.textContent = '';
  loginError.style.display = 'none';
  
  try {
    // Verificar que Firebase esté disponible
    if (!window.firebaseAuth || !window.firebaseSignIn) {
      throw new Error('Firebase no está disponible. Por favor, recarga la página.');
    }
    
    // Debug: Log auth config before sign in
    console.log('🔍 [LOGIN] Attempting sign in with:', {
      email: email,
      authApp: window.firebaseAuth?.app?.name,
      authConfig: window.firebaseAuth?.app?.options ? {
        apiKey: window.firebaseAuth.app.options.apiKey ? window.firebaseAuth.app.options.apiKey.substring(0, 10) + '...' : 'MISSING',
        projectId: window.firebaseAuth.app.options.projectId,
        authDomain: window.firebaseAuth.app.options.authDomain
      } : 'NOT AVAILABLE'
    });
    
    // Intentar iniciar sesión
    await window.firebaseSignIn(window.firebaseAuth, email, password);
    
    // Si es exitoso, redirigir (onAuthStateChanged se encargará)
    // O redirigir manualmente
    window.location.href = 'admin.html';
    
  } catch (error) {
    console.error('❌ [LOGIN] Error al iniciar sesión:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Full error:', error);
    
    let errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    
    if (error.code === 'auth/api-key-not-valid' || error.message?.includes('api-key-not-valid')) {
      errorMessage = '⚠️ Error de configuración: La API Key de Firebase no es válida. Por favor, verifica las variables de entorno en Netlify.';
      console.error('🔴 [LOGIN] API Key inválida. Verifica:');
      console.error('   1. Que FIREBASE_API_KEY esté configurada en Netlify');
      console.error('   2. Que la API Key empiece con "AIza" (no "Alza")');
      console.error('   3. Que la API Key esté completa (~39 caracteres)');
      console.error('   4. Que hayas redesplegado después de agregar las variables');
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No existe una cuenta con este email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Contraseña incorrecta.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
    } else if (error.code === 'auth/invalid-api-key') {
      errorMessage = 'API Key inválida. Verifica la configuración en Netlify.';
    }
    
    showError(errorMessage);
    
  } finally {
    // Re-habilitar botón
    loginBtn.disabled = false;
    loginBtn.innerHTML = originalText;
  }
});

function showError(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
  
  // Scroll to error
  loginError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Toggle de visibilidad de contraseña
const passwordToggle = document.getElementById('passwordToggle');
const passwordInput = document.getElementById('password');

if (passwordToggle && passwordInput) {
  passwordToggle.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Cambiar icono
    const eyeIcon = passwordToggle.querySelector('.eye-icon');
    if (type === 'text') {
      eyeIcon.textContent = '🙈';
      passwordToggle.setAttribute('aria-label', 'Ocultar contraseña');
    } else {
      eyeIcon.textContent = '👁️';
      passwordToggle.setAttribute('aria-label', 'Mostrar contraseña');
    }
  });
}

