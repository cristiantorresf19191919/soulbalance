// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// ============================================
// SCROLL INDICATOR FUNCTIONALITY
// ============================================
const scrollIndicator = document.querySelector('.scroll-indicator');
let lastScrollY = 0;

// Combined navbar and scroll indicator handler
function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Navbar scroll effect
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Scroll indicator hide/show
    if (currentScrollY > 100) {
        scrollIndicator?.classList.add('hidden');
        scrollIndicator?.classList.remove('visible');
    } else if (currentScrollY < 50) {
        // Only show with animation when scrolling back up
        if (lastScrollY > 100) {
            scrollIndicator?.classList.remove('hidden');
            scrollIndicator?.classList.add('visible');
        }
    }
    
    lastScrollY = currentScrollY;
}

// Optimized scroll handler with throttling
let scrollTimeout;
window.addEventListener('scroll', () => {
    handleScroll();
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Cleanup
    }, 10);
}, { passive: true });

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// LOADING & TOAST FUNCTIONALITY
// ============================================
const loadingOverlay = document.getElementById('loadingOverlay');
const toastContainer = document.getElementById('toastContainer');
const loadingTip = document.getElementById('loadingTip');
let loadingTipInterval = null;
let loadingTimeout = null;

// Tips rotativos mientras carga
const loadingTips = [
    { icon: '🌿', text: 'Un masaje regular ayuda a reducir el estrés y mejorar la calidad del sueño' },
    { icon: '✨', text: 'Los aceites esenciales no solo relajan, también nutren tu piel' },
    { icon: '🧘', text: 'Respirar profundamente durante el masaje aumenta sus beneficios terapéuticos' },
    { icon: '💆', text: 'Un ambiente tranquilo y música suave maximizan la experiencia de relajación' },
    { icon: '🌱', text: 'La hidratación después del masaje ayuda a eliminar toxinas liberadas' },
    { icon: '✨', text: 'Nuestros profesionales certificados se adaptan a tus necesidades específicas' },
    { icon: '🧘', text: 'Un masaje semanal puede mejorar significativamente tu bienestar general' },
    { icon: '💆', text: 'La aromaterapia durante el masaje activa múltiples sentidos para mayor relajación' }
];

let currentTipIndex = 0;

function showLoadingTip() {
    if (!loadingTip) return;
    
    const tip = loadingTips[currentTipIndex];
    loadingTip.innerHTML = `
        <span class="tip-icon">${tip.icon}</span>
        <span class="tip-text">${tip.text}</span>
    `;
    
    // Fade animation
    loadingTip.style.opacity = '0';
    setTimeout(() => {
        loadingTip.style.opacity = '1';
    }, 50);
    
    currentTipIndex = (currentTipIndex + 1) % loadingTips.length;
}

function showLoading() {
    loadingOverlay?.classList.add('active');
    currentTipIndex = 0;
    showLoadingTip();
    
    // Rotar tips cada 3 segundos
    loadingTipInterval = setInterval(showLoadingTip, 3000);
    
    // Timeout de seguridad: ocultar loading después de 10 segundos máximo
    loadingTimeout = setTimeout(() => {
        console.warn('Loading timeout reached, forcing hide');
        hideLoading();
    }, 10000);
}

function hideLoading() {
    // Limpiar intervalos y timeouts
    if (loadingTipInterval) {
        clearInterval(loadingTipInterval);
        loadingTipInterval = null;
    }
    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }
    
    loadingOverlay?.classList.remove('active');
}

function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✓' : '✕';
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer?.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.classList.add('slide-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Form validation function
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
        errors.push('Por favor, ingresa tu nombre completo');
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.get('email') || !emailPattern.test(formData.get('email'))) {
        errors.push('Por favor, ingresa un email válido');
    }
    
    // Phone validation (Colombian format)
    const phonePattern = /^(\+?57)?[0-9]{10}$/;
    const phone = formData.get('phone').replace(/\s+/g, '');
    if (!formData.get('phone') || !phonePattern.test(phone)) {
        errors.push('Por favor, ingresa un teléfono válido (ej: +57 300 123 4567)');
    }
    
    // Service selection validation
    if (!formData.get('service')) {
        errors.push('Por favor, selecciona un servicio');
    }
    
    return errors;
}

// Show form message
function showMessage(message, type = 'success') {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
        formMessage.textContent = '';
    }, 5000);
}

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('📝 [FORM] Iniciando envío del formulario...');
    
    // Disable submit button
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando...</span> <span class="btn-icon">⏳</span>';
    
    // Get form data
    const formData = new FormData(contactForm);
    console.log('📋 [FORM] Datos del formulario capturados');
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        console.warn('❌ [FORM] Error de validación:', errors);
        showToast('Error de validación', errors[0], 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
    }
    
    console.log('✅ [FORM] Validación exitosa');
    
    // Show loading overlay
    showLoading();
    console.log('⏳ [FORM] Mostrando overlay de carga');
    
    try {
        // Convert FormData to object
        const submissionData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        console.log('📦 [FORM] Datos preparados para envío:', {
            name: submissionData.name,
            email: submissionData.email,
            phone: submissionData.phone,
            service: submissionData.service,
            hasMessage: !!submissionData.message,
            timestamp: submissionData.timestamp
        });
        
        // Verificar que Firestore esté disponible
        console.log('🔍 [FIRESTORE] Verificando disponibilidad de Firestore...');
        console.log('  - firebaseFirestore:', !!window.firebaseFirestore);
        console.log('  - firebaseCollection:', !!window.firebaseCollection);
        console.log('  - firebaseAddDoc:', !!window.firebaseAddDoc);
        
        if (!window.firebaseFirestore || !window.firebaseCollection || !window.firebaseAddDoc) {
            console.error('❌ [FIRESTORE] Firestore no está disponible');
            throw new Error('Firestore no está disponible');
        }
        
        console.log('✅ [FIRESTORE] Firestore está disponible');
        
        // Log información de Firestore
        if (window.firebaseFirestore) {
            console.log('📊 [FIRESTORE] Información de Firestore:', {
                type: 'Cloud Firestore',
                app: window.firebaseFirestore.app?.name || 'N/A',
                projectId: window.firebaseFirestore.app?.options?.projectId || 'N/A'
            });
        }
        
        // Preparar datos para Firestore (usando la estructura de contacts)
        const firestoreData = {
            name: submissionData.name,
            email: submissionData.email,
            phone: submissionData.phone || '',
            service: submissionData.service || '',
            message: submissionData.message || '',
            subject: submissionData.service ? `Consulta sobre: ${submissionData.service}` : 'Consulta general',
            createdAt: window.firebaseServerTimestamp ? window.firebaseServerTimestamp() : new Date()
        };
        
        console.log('📦 [FIRESTORE] Datos preparados para Firestore:', firestoreData);
        
        // Guardar en Firestore - colección 'contacts'
        const contactsCollection = window.firebaseCollection(window.firebaseFirestore, 'contacts');
        console.log('📍 [FIRESTORE] Colección creada: contacts');
        
        console.log('🚀 [FIRESTORE] Iniciando petición a Firestore...');
        const requestStartTime = Date.now();
        
        // Verificar que addDoc sea una función
        if (typeof window.firebaseAddDoc !== 'function') {
            console.error('❌ [FIRESTORE] firebaseAddDoc no es una función:', typeof window.firebaseAddDoc);
            throw new Error('firebaseAddDoc no está disponible como función');
        }
        
        console.log('✅ [FIRESTORE] firebaseAddDoc es una función válida');
        
        // Crear una promesa con mejor manejo de errores
        let firestorePromise;
        try {
            console.log('🔄 [FIRESTORE] Llamando a firebaseAddDoc...');
            firestorePromise = window.firebaseAddDoc(contactsCollection, firestoreData);
            console.log('✅ [FIRESTORE] firebaseAddDoc llamado, promise creada:', !!firestorePromise);
            
            // Verificar que sea una promesa
            if (!firestorePromise || typeof firestorePromise.then !== 'function') {
                console.error('❌ [FIRESTORE] firebaseAddDoc no devolvió una promesa');
                throw new Error('firebaseAddDoc no devolvió una promesa válida');
            }
        } catch (addDocError) {
            console.error('❌ [FIRESTORE] Error al llamar firebaseAddDoc:', addDocError);
            throw addDocError;
        }
        
        firestorePromise = firestorePromise
            .then((docRef) => {
                console.log('✅ [FIRESTORE] Promise resuelta exitosamente');
                console.log('📦 [FIRESTORE] Documento creado con ID:', docRef.id);
                return docRef;
            })
            .catch((firestoreError) => {
                console.error('❌ [FIRESTORE] Error capturado en la promesa:', {
                    message: firestoreError?.message || 'Sin mensaje',
                    code: firestoreError?.code || 'N/A',
                    name: firestoreError?.name || 'N/A',
                    stack: firestoreError?.stack || 'N/A',
                    errorObject: firestoreError
                });
                throw firestoreError;
            });
        
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => {
                const elapsedTime = Date.now() - requestStartTime;
                console.error('⏱️ [FIRESTORE] Timeout alcanzado después de', elapsedTime, 'ms');
                console.error('⚠️ [FIRESTORE] Esto puede indicar:');
                console.error('  1. ❌ Reglas de seguridad de Firestore bloqueando la escritura');
                console.error('  2. ❌ Problemas de conectividad a Internet');
                console.error('  3. ❌ La colección "contacts" no existe o hay problemas de permisos');
                reject(new Error('Timeout: La solicitud tardó demasiado'));
            }, 8000)
        );
        
        // Ejecutar con timeout
        let result;
        try {
            result = await Promise.race([firestorePromise, timeoutPromise]);
        } catch (raceError) {
            console.error('❌ [FIRESTORE] Error en Promise.race:', raceError);
            throw raceError;
        }
        
        const elapsedTime = Date.now() - requestStartTime;
        console.log('✅ [FIRESTORE] Petición exitosa en', elapsedTime, 'ms');
        console.log('📊 [FIRESTORE] Documento creado:', result);
        console.log('🔑 [FIRESTORE] Document ID:', result?.id || 'N/A');
        
        // Pequeña pausa para que el usuario vea el último tip
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Hide loading overlay
        hideLoading();
        console.log('✅ [FORM] Overlay de carga ocultado');
        
        // Show success toast
        showToast(
            '¡Mensaje enviado!',
            'Te responderemos muy pronto. Tu bienestar es nuestra prioridad ✨',
            'success'
        );
        console.log('✅ [FORM] Toast de éxito mostrado');
        
        // Reset form
        contactForm.reset();
        console.log('✅ [FORM] Formulario reseteado');
        console.log('🎉 [FORM] Proceso completado exitosamente');
        
    } catch (error) {
        const errorDetails = {
            message: error.message,
            code: error.code || 'N/A',
            name: error.name || 'Error',
            stack: error.stack || 'N/A'
        };
        
        console.error('❌ [FORM] Error en el proceso de envío:', errorDetails);
        console.error('❌ [FORM] Error completo:', error);
        
        // Log adicional según el tipo de error
        if (error.message.includes('Timeout')) {
            console.error('⏱️ [FORM] Error: Timeout - La petición tardó más de 8 segundos');
            console.error('🔧 [FORM] SOLUCIÓN: Verifica las siguientes cosas:');
            console.error('  1. Abre Firebase Console: https://console.firebase.google.com/');
            console.error('  2. Selecciona el proyecto: barber-s-app-18e7e');
            console.error('  3. Ve a "Firestore Database" → "Rules"');
            console.error('  4. Asegúrate de que las reglas permitan escritura a la colección "contacts":');
            console.error('     rules_version = \'2\';');
            console.error('     service cloud.firestore {');
            console.error('       match /databases/{database}/documents {');
            console.error('         match /contacts/{document=**} {');
            console.error('           allow read, write: if true;');
            console.error('         }');
            console.error('       }');
            console.error('     }');
        } else if (error.message.includes('Firebase') || error.message.includes('Firestore')) {
            console.error('🔥 [FORM] Error: Firestore no está disponible o configurado incorrectamente');
        } else if (error.code) {
            console.error('🔢 [FORM] Error code:', error.code);
            
            // Errores específicos de Firestore
            if (error.code === 'permission-denied') {
                console.error('🚫 [FORM] permission-denied: Las reglas de Firestore están bloqueando la escritura');
                console.error('🔧 [FORM] Ve a Firebase Console → Firestore Database → Rules');
                console.error('🔧 [FORM] Asegúrate de permitir escritura en la colección "contacts"');
            } else if (error.code === 'unavailable') {
                console.error('🌐 [FORM] unavailable: Firestore no está disponible');
                console.error('🔧 [FORM] Verifica que Firestore esté habilitado en Firebase Console');
            } else if (error.code === 'network-error' || error.code === 'failed-precondition') {
                console.error('📡 [FORM] Error de conexión o configuración');
                console.error('🔧 [FORM] Verifica tu conexión a Internet y las reglas de Firestore');
            }
        }
        
        // Mostrar información de Firestore para verificación
        console.error('🔗 [FIRESTORE] Proyecto: barber-s-app-18e7e');
        console.error('🔗 [FIRESTORE] Colección esperada: contacts');
        
        // Hide loading overlay
        hideLoading();
        console.log('⚠️ [FORM] Overlay de carga ocultado después del error');
        
        // Determinar mensaje de error
        let errorMessage = 'Hubo un problema al enviar tu mensaje.';
        if (error.message.includes('Timeout')) {
            errorMessage = 'La conexión está tardando más de lo esperado. Por favor, intenta nuevamente.';
        } else if (error.message.includes('Firebase')) {
            errorMessage = 'Hay un problema con la conexión. Por favor, contáctanos directamente por teléfono o email.';
        }
        
        // Show error toast
        showToast(
            'Error al enviar',
            errorMessage + ' Tu mensaje es importante para nosotros.',
            'error'
        );
        console.log('⚠️ [FORM] Toast de error mostrado');
        
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        console.log('🔄 [FORM] Botón de envío re-habilitado');
    }
});

// Real-time validation feedback
const formInputs = contactForm.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#EF5350';
        } else {
            this.style.borderColor = '';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(239, 83, 80)') {
            this.style.borderColor = '';
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations and initialize translations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll indicator as visible
    if (window.scrollY < 50) {
        scrollIndicator?.classList.add('visible');
    }
    
    // Initialize scroll animations
    const animateElements = document.querySelectorAll('.service-card, .feature-card, .premium-card, .info-card');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.4s ease-out ${index * 0.05}s, transform 0.4s ease-out ${index * 0.05}s`;
        observer.observe(el);
    });
    
    // Initialize translations
    translateAll();
});

// ============================================
// SMOOTH SCROLLING FOR NAVIGATION
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// FORM PLACEHOLDER ANIMATIONS
// ============================================
const formFields = document.querySelectorAll('.form-group input, .form-group textarea');
formFields.forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// ============================================
// PRICE ANIMATION ON HOVER
// ============================================
const priceItems = document.querySelectorAll('.price-item, .price-item-light');
priceItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ============================================
// ADD LOADING STATE TO BUTTONS
// ============================================
const buttons = document.querySelectorAll('button, .cta-button, .submit-btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ============================================
// PARALLAX EFFECTS
// ============================================

// Parallax configuration
const parallaxConfig = {
    // Hero section
    hero: {
        content: 0.3,  // Content moves slower
        overlay: 0.5   // Overlay moves slightly slower
    },
    // Services section
    services: {
        images: 0.15  // Images move slower than scroll
    },
    // Premium section
    premium: {
        cards: 0.2    // Cards move slower
    },
    // About section
    about: {
        features: 0.25 // Features move slower
    }
};

// Throttle function for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Parallax effect function
function applyParallax() {
    const scrollY = window.pageYOffset || window.scrollY;
    const windowHeight = window.innerHeight;
    const windowCenter = windowHeight / 2;
    
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    // Skip parallax on mobile for better performance
    if (window.innerWidth <= 768) {
        return;
    }
    
    // Hero section parallax - Mejorado
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroRect = hero.getBoundingClientRect();
        const heroBackground = hero.querySelector('.hero-background');
        const heroContent = hero.querySelector('.hero-content');
        const heroOverlay = hero.querySelector('.hero-overlay');
        
        // Only apply parallax when hero is visible
        if (heroRect.top < windowHeight && heroRect.bottom > 0) {
            // Calculate scroll progress within hero
            const heroProgress = Math.max(0, Math.min(1, (windowHeight - heroRect.top) / (windowHeight + heroRect.height)));
            
            // Background video parallax - moves slower (creates depth)
            if (heroBackground) {
                const backgroundOffset = scrollY * 0.5; // Background moves slower
                const backgroundScale = 1 + (heroProgress * 0.05); // Slight zoom on scroll
                heroBackground.style.transform = `translateY(${backgroundOffset}px) scale(${backgroundScale}) translateZ(0)`;
            }
            
            // Content parallax - moves at normal speed
            if (heroContent && heroProgress > 0 && heroProgress < 1) {
                const contentOffset = scrollY * parallaxConfig.hero.content;
                heroContent.style.transform = `translateY(${contentOffset}px) translateZ(0)`;
            }
            
            // Overlay parallax - moves at different speed for depth
            if (heroOverlay && heroProgress > 0 && heroProgress < 1) {
                const overlayOffset = scrollY * parallaxConfig.hero.overlay;
                heroOverlay.style.transform = `translateY(${overlayOffset}px) translateZ(0)`;
            }
        }
    }
    
    // Services section parallax
    const services = document.querySelector('.services');
    if (services) {
        const serviceImages = services.querySelectorAll('.service-image');
        const servicesRect = services.getBoundingClientRect();
        
        if (servicesRect.top < windowHeight && servicesRect.bottom > 0) {
            serviceImages.forEach((image, index) => {
                const imageRect = image.getBoundingClientRect();
                const imageCenter = imageRect.top + imageRect.height / 2;
                const distanceFromCenter = imageCenter - windowCenter;
                
                // Apply parallax when image is in viewport
                if (imageRect.top < windowHeight && imageRect.bottom > 0) {
                    const translateY = distanceFromCenter * parallaxConfig.services.images;
                    image.style.transform = `translateY(${translateY}px) translateZ(0)`;
                } else {
                    image.style.transform = 'translateY(0) translateZ(0)';
                }
            });
        }
    }
    
    // Premium section parallax
    const premiumSection = document.querySelector('.premium-section');
    if (premiumSection) {
        const premiumCards = premiumSection.querySelectorAll('.premium-card');
        const premiumRect = premiumSection.getBoundingClientRect();
        
        if (premiumRect.top < windowHeight && premiumRect.bottom > 0) {
            premiumCards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.top + cardRect.height / 2;
                const distanceFromCenter = cardCenter - windowCenter;
                
                if (cardRect.top < windowHeight && cardRect.bottom > 0) {
                    // Alternate direction for visual interest
                    const direction = index % 2 === 0 ? 1 : -0.7;
                    const translateY = distanceFromCenter * parallaxConfig.premium.cards * direction;
                    card.style.transform = `translateY(${translateY}px) translateZ(0)`;
                } else {
                    card.style.transform = 'translateY(0) translateZ(0)';
                }
            });
        }
    }
    
    // About section parallax
    const about = document.querySelector('.about');
    if (about) {
        const featureCards = about.querySelectorAll('.feature-card');
        const aboutRect = about.getBoundingClientRect();
        
        if (aboutRect.top < windowHeight && aboutRect.bottom > 0) {
            featureCards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.top + cardRect.height / 2;
                const distanceFromCenter = cardCenter - windowCenter;
                
                if (cardRect.top < windowHeight && cardRect.bottom > 0) {
                    // Alternate direction for visual interest
                    const direction = index % 2 === 0 ? 1 : -0.5;
                    const translateY = distanceFromCenter * parallaxConfig.about.features * direction;
                    card.style.transform = `translateY(${translateY}px) translateZ(0)`;
                } else {
                    card.style.transform = 'translateY(0) translateZ(0)';
                }
            });
        }
    }
}

// Apply parallax with throttling for better performance
const throttledParallax = throttle(applyParallax, 10);

// Add scroll event listener
window.addEventListener('scroll', throttledParallax, { passive: true });

// Apply parallax on initial load
window.addEventListener('load', applyParallax);

// Reset parallax transforms when scrolling past sections
function resetParallax() {
    const scrollY = window.pageYOffset || window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Reset hero parallax when scrolled past
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom < 0) {
            const heroBackground = hero.querySelector('.hero-background');
            const heroContent = hero.querySelector('.hero-content');
            const heroOverlay = hero.querySelector('.hero-overlay');
            if (heroBackground) heroBackground.style.transform = 'none';
            if (heroContent) heroContent.style.transform = 'none';
            if (heroOverlay) heroOverlay.style.transform = 'none';
        }
    }
}

// Optimized scroll handler
window.addEventListener('scroll', throttle(resetParallax, 100), { passive: true });

console.log('✨ Soul Balance - Website loaded successfully with parallax effects! 🌿');

// ============================================
// LANGUAGE TOGGLE FUNCTIONALITY
// ============================================
let currentLanguage = 'es';

const translations = {
  es: {
    'nav-inicio': 'Inicio',
    'nav-servicios': 'Servicios',
    'nav-experiencias': 'Experiencias',
    'nav-blog': 'Blog',
    'nav-contacto': 'Contacto',
    'hero-title': 'EXPERIENCIAS DE BIENESTAR',
    'hero-subtitle': 'Equilibrio entre cuerpo, mente y alma',
    'hero-cta': 'Reserva tu experiencia',
    'about-title': 'Tu bienestar, nuestra pasión',
    'about-text': 'En Soul Balance, creemos que cada persona merece momentos de paz y renovación. Ofrecemos experiencias de bienestar diseñadas para restaurar la armonía entre cuerpo, mente y alma. Con profesionales certificados y técnicas especializadas, llevamos el spa directamente a tu hogar.',
    'feature-home-title': 'Servicio a Domicilio',
    'feature-home-desc': 'Domingo a Domingo, de 8 AM a 7 PM',
    'feature-custom-title': 'Experiencias Personalizadas',
    'feature-custom-desc': 'Adaptadas a tus necesidades',
    'feature-organic-title': 'Productos Orgánicos',
    'feature-organic-desc': 'Aceites esenciales puros',
    'services-title': 'Masajes Relajantes y Terapéuticos',
    'services-view-all': 'Ver todos',
    'contact-title': 'Hablemos de tu bienestar',
    'contact-intro': 'Estamos aquí para escucharte y crear la experiencia perfecta para ti. Cuéntanos qué necesitas y con gusto te ayudaremos a encontrar el servicio ideal.',
    'contact-phone-title': 'Teléfono',
    'contact-phone-desc': 'Contáctanos directamente',
    'contact-email-title': 'Email',
    'contact-email-desc': 'Escríbenos cuando quieras',
    'contact-hours-title': 'Horarios',
    'contact-hours-desc': 'Estamos disponibles',
    'contact-hours': 'Domingo a Domingo<br />8:00 AM - 7:00 PM',
    'form-name': 'Tu nombre',
    'form-name-placeholder': '¿Cómo te gusta que te llamemos?',
    'form-email': 'Tu email',
    'form-email-placeholder': 'tu@email.com',
    'form-phone': 'Tu teléfono',
    'form-phone-placeholder': '+57 300 123 4567',
    'form-service': '¿Qué servicio te interesa?',
    'form-service-select': 'Selecciona una opción',
    'form-message': 'Cuéntanos más sobre ti y lo que buscas',
    'form-message-placeholder': '¿Hay algo específico que te gustaría que sepamos? Cualquier detalle nos ayuda a personalizar tu experiencia perfecta...',
    'form-submit': 'Enviar mensaje',
    'footer-tagline': 'Equilibrio entre cuerpo, mente y alma',
    'nav-empresarial': 'Corporate',
    'corporate-title': 'Bienestar Empresarial',
    'corporate-intro': 'Nuestros programas están diseñados para promover la salud física, mental y emocional de sus colaboradores. Ofrecemos un enfoque <strong>holístico</strong>, respaldado por la formación dual en <strong>Masaje Terapéutico y Psicología</strong>, lo que nos permite crear jornadas de bienestar que transforman el ambiente de trabajo, fomentando la armonía, reduciendo el estrés y disparando la productividad.',
    'corporate-subtitle': 'Paquetes Corporativos: Opciones flexibles y adaptables a las necesidades específicas y ritmo de cada empresa:',
    'package-half-title': 'Jornada de ½ Día',
    'package-half-desc': 'Perfecta para integrar el bienestar en la rutina sin interrumpir la jornada. Incluye actividades energizantes y de relajación concentradas en un bloque de 3 o 4 horas.',
    'package-half-hours': '3-4 Horas',
    'package-full-title': 'Jornada Full Day',
    'package-full-desc': 'Una inmersión completa en el bienestar. Este programa de día entero maximiza el impacto en la salud y el ánimo, logrando una desconexión y revitalización total del equipo.',
    'package-full-hours': 'Día Completo',
    'package-hourly-title': 'Servicio por Horas',
    'package-hourly-desc': 'Máxima flexibilidad para cubrir necesidades puntuales. Contrata sesiones específicas (ej: masajes express, pausas activas) adaptadas exactamente al horario y presupuesto de su compañía.',
    'package-hourly-hours': 'Por Horas',
    'value-title': 'Maximice el valor para su empresa:',
    'value-desc': 'Nuestros servicios cumplen con altos estándares de calidad y estrictos protocolos de bioseguridad. Además, pueden generar oportunidades de beneficios fiscales y fortalecer su estrategia de Responsabilidad Social Empresarial (RSE), alineándose con las normativas vigentes.',
    'corporate-guarantee-text': 'Garantizamos total flexibilidad de horarios (incluyendo fines de semana) y capacidad de atención simultánea adaptada a su número de colaboradores.',
    'corporate-cta': 'Contáctenos para una cotización personalizada y eleve el bienestar de su equipo al nivel Premium →',
    'service-relajante-desc': 'Un masaje suave diseñado para liberar el estrés, calmar la mente y restaurar la armonía entre cuerpo y emociones. Renueva tu energía, mejora tu bienestar y te ofrece la paz interior que mereces.',
    'service-descontracturante-desc': 'Masaje profundo que disuelve nudos musculares y alivia el dolor, liberando la tensión acumulada. Utiliza técnicas focalizadas para devolver ligereza y movilidad, promoviendo el bienestar y el equilibrio físico total.',
    'service-piedras-desc': 'Experimenta la renovación a través del calor de las piedras volcánicas. Su penetración profunda disuelve la tensión muscular, equilibra la energía y genera una profunda sensación de calma. Ideal para reconectar con tu fuerza interior.',
    'service-prenatal-desc': 'Diseñado especialmente para futuras mamás. Este masaje alivia eficazmente la espalda, piernas y pies, reduce la hinchazón y crea un espacio de calma y profunda conexión con tu bebé.',
    'service-4manos-desc': 'Dos terapeutas en perfecta sincronía envuelven tu cuerpo con un ritmo único de movimientos. Esta experiencia envolvente multiplica la relajación y equilibra tu energía de manera profunda.',
    'service-piernas-desc': 'Masaje revitalizante que estimula la circulación, reduce la fatiga y devuelve frescura y descanso a tus piernas.',
    'service-vela-desc': 'Terapia con velas aromáticas que combinan el calor suave con aceites esenciales. Genera una experiencia sensorial única que nutre la piel, relaja profundamente y restaura la energía vital.',
    'service-drenaje-desc': 'Técnica manual suave que activa la circulación linfática, elimina toxinas y reduce la retención de líquidos. Mejora el sistema inmunológico y aporta una sensación de ligereza y bienestar integral.',
    'service-bambu-desc': 'Masaje revitalizante utilizando varillas de bambú calientes. Mejora la circulación, tonifica los tejidos y libera la tensión muscular, creando una experiencia exótica y profundamente relajante.',
    'service-pindas-desc': 'Bolsitas herbales tibias llenas de hierbas medicinales que liberan sus propiedades curativas sobre tu cuerpo. Equilibra los doshas, alivia el dolor y fomenta un estado de profunda calma y armonía.',
    'service-tejido-desc': 'Técnica intensa que trabaja las capas profundas de los músculos y tejidos conectivos. Ideal para lesiones crónicas y contracturas persistentes, liberando tensiones profundas y mejorando la movilidad.',
    'service-craneo-desc': 'Liberación craneosacral y facial que suaviza las líneas de expresión, alivia dolores de cabeza, reduce el estrés y promueve una sensación de relajación profunda en rostro y cuero cabelludo.',
    'service-espalda-desc': 'Enfoque especializado en la columna vertebral y músculos de la espalda. Reduce tensiones, mejora la postura y alivia dolores crónicos, devolviendo flexibilidad y equilibrio a tu zona central.',
    'service-deportivo-desc': 'Optimizado para atletas y personas activas. Previene lesiones, acelera la recuperación muscular, mejora el rendimiento y mantiene tu cuerpo en óptimas condiciones para el entrenamiento.',
    'service-pies-desc': 'Exfoliación, hidratación profunda y masaje reflexológico. Trata tus pies con el cuidado que se merecen, aliviando la tensión y devolviendo suavidad y bienestar a cada paso.',
    'service-manos-desc': 'Tratamiento completo de exfoliación, hidratación y masaje para tus manos. Nutre la piel, fortalece las uñas y relaja la tensión acumulada por el trabajo diario.'
  },
  en: {
    'nav-inicio': 'Home',
    'nav-servicios': 'Services',
    'nav-experiencias': 'Experiences',
    'nav-blog': 'Blog',
    'nav-contacto': 'Contact',
    'hero-title': 'WELLNESS EXPERIENCES',
    'hero-subtitle': 'Balance between body, mind and soul',
    'hero-cta': 'Book your experience',
    'about-title': 'Your wellbeing, our passion',
    'about-text': 'At Soul Balance, we believe that every person deserves moments of peace and renewal. We offer wellness experiences designed to restore harmony between body, mind and soul. With certified professionals and specialized techniques, we bring the spa directly to your home.',
    'feature-home-title': 'Home Service',
    'feature-home-desc': 'Sunday to Sunday, from 8 AM to 7 PM',
    'feature-custom-title': 'Personalized Experiences',
    'feature-custom-desc': 'Adapted to your needs',
    'feature-organic-title': 'Organic Products',
    'feature-organic-desc': 'Pure essential oils',
    'services-title': 'Relaxing and Therapeutic Massages',
    'services-view-all': 'View all',
    'contact-title': 'Let\'s talk about your wellbeing',
    'contact-intro': 'We are here to listen to you and create the perfect experience for you. Tell us what you need and we will gladly help you find the ideal service.',
    'contact-phone-title': 'Phone',
    'contact-phone-desc': 'Contact us directly',
    'contact-email-title': 'Email',
    'contact-email-desc': 'Write to us anytime',
    'contact-hours-title': 'Hours',
    'contact-hours-desc': 'We are available',
    'contact-hours': 'Sunday to Sunday<br />8:00 AM - 7:00 PM',
    'form-name': 'Your name',
    'form-name-placeholder': 'What should we call you?',
    'form-email': 'Your email',
    'form-email-placeholder': 'your@email.com',
    'form-phone': 'Your phone',
    'form-phone-placeholder': '+57 300 123 4567',
    'form-service': 'What service interests you?',
    'form-service-select': 'Select an option',
    'form-message': 'Tell us more about yourself and what you\'re looking for',
    'form-message-placeholder': 'Is there anything specific you would like us to know? Any detail helps us personalize your perfect experience...',
    'form-submit': 'Send message',
    'footer-tagline': 'Balance between body, mind and soul',
    'nav-empresarial': 'Corporate',
    'corporate-title': 'Corporate Wellness',
    'corporate-intro': 'Our programs are designed to promote the physical, mental, and emotional health of your collaborators. We offer a <strong>holistic</strong> approach, backed by dual training in <strong>Therapeutic Massage and Psychology</strong>, which allows us to create wellness days that transform the work environment, fostering harmony, reducing stress, and boosting productivity.',
    'corporate-subtitle': 'Corporate Packages: Flexible and adaptable options to the specific needs and rhythm of each company:',
    'package-half-title': 'Half-Day Program',
    'package-half-desc': 'Perfect for integrating wellness into the routine without interrupting the workday. Includes energizing and relaxation activities concentrated in a 3 or 4-hour block.',
    'package-half-hours': '3-4 Hours',
    'package-full-title': 'Full-Day Program',
    'package-full-desc': 'A complete immersion in wellness. This full-day program maximizes the impact on health and mood, achieving total disconnection and revitalization of the team.',
    'package-full-hours': 'Full Day',
    'package-hourly-title': 'Hourly Service',
    'package-hourly-desc': 'Maximum flexibility to cover specific needs. Contract specific sessions (e.g., express massages, active breaks) adapted exactly to your company\'s schedule and budget.',
    'package-hourly-hours': 'By Hours',
    'value-title': 'Maximize value for your company:',
    'value-desc': 'Our services comply with high quality standards and strict biosecurity protocols. In addition, they can generate opportunities for tax benefits and strengthen your Corporate Social Responsibility (CSR) strategy, aligning with current regulations.',
    'corporate-guarantee-text': 'We guarantee total flexibility of schedules (including weekends) and simultaneous attention capacity adapted to your number of collaborators.',
    'corporate-cta': 'Contact us for a personalized quote and elevate your team\'s well-being to the Premium level →',
    'service-relajante-desc': 'A gentle massage designed to release stress, calm the mind and restore harmony between body and emotions. Renews your energy, improves your well-being and offers you the inner peace you deserve.',
    'service-descontracturante-desc': 'Deep massage that dissolves muscle knots and relieves pain, releasing accumulated tension. Uses focused techniques to restore lightness and mobility, promoting well-being and total physical balance.',
    'service-piedras-desc': 'Experience renewal through the heat of volcanic stones. Their deep penetration dissolves muscle tension, balances energy and creates a deep sense of calm. Ideal for reconnecting with your inner strength.',
    'service-prenatal-desc': 'Specially designed for expecting mothers. This massage effectively relieves the back, legs and feet, reduces swelling and creates a space of calm and deep connection with your baby.',
    'service-4manos-desc': 'Two therapists in perfect synchrony envelop your body with a unique rhythm of movements. This enveloping experience multiplies relaxation and deeply balances your energy.',
    'service-piernas-desc': 'Revitalizing massage that stimulates circulation, reduces fatigue and restores freshness and rest to your legs.',
    'service-vela-desc': 'Aromatherapy with candles that combine gentle heat with essential oils. Creates a unique sensory experience that nourishes the skin, deeply relaxes and restores vital energy.',
    'service-drenaje-desc': 'Gentle manual technique that activates lymphatic circulation, eliminates toxins and reduces fluid retention. Improves the immune system and provides a sense of lightness and overall well-being.',
    'service-bambu-desc': 'Revitalizing massage using warm bamboo rods. Improves circulation, tones tissues and releases muscle tension, creating an exotic and deeply relaxing experience.',
    'service-pindas-desc': 'Warm herbal pouches filled with medicinal herbs that release their healing properties on your body. Balances the doshas, relieves pain and promotes a state of deep calm and harmony.',
    'service-tejido-desc': 'Intense technique that works the deep layers of muscles and connective tissues. Ideal for chronic injuries and persistent contractures, releasing deep tensions and improving mobility.',
    'service-craneo-desc': 'Craniosacral and facial release that softens expression lines, relieves headaches, reduces stress and promotes a deep sense of relaxation in face and scalp.',
    'service-espalda-desc': 'Specialized focus on the spine and back muscles. Reduces tensions, improves posture and relieves chronic pain, restoring flexibility and balance to your core area.',
    'service-deportivo-desc': 'Optimized for athletes and active people. Prevents injuries, accelerates muscle recovery, improves performance and keeps your body in optimal conditions for training.',
    'service-pies-desc': 'Exfoliation, deep hydration and reflexology massage. Treats your feet with the care they deserve, relieving tension and restoring softness and well-being with each step.',
    'service-manos-desc': 'Complete treatment of exfoliation, hydration and massage for your hands. Nourishes the skin, strengthens nails and relaxes tension accumulated from daily work.'
  }
};

function translateElement(elementId, translationKey) {
  const element = document.getElementById(elementId);
  if (element && translations[currentLanguage][translationKey]) {
    element.textContent = translations[currentLanguage][translationKey];
  }
}

function translateHTML(elementId, translationKey) {
  const element = document.getElementById(elementId);
  if (element && translations[currentLanguage][translationKey]) {
    element.innerHTML = translations[currentLanguage][translationKey];
  }
}

function translatePlaceholder(elementId, translationKey) {
  const element = document.getElementById(elementId);
  if (element && translations[currentLanguage][translationKey]) {
    element.placeholder = translations[currentLanguage][translationKey];
  }
}

function translateAll() {
  // Navigation
  translateElement('nav-inicio', 'nav-inicio');
  translateElement('nav-servicios', 'nav-servicios');
  translateElement('nav-experiencias', 'nav-experiencias');
  translateElement('nav-empresarial', 'nav-empresarial');
  translateElement('nav-blog', 'nav-blog');
  translateElement('nav-contacto', 'nav-contacto');
  
  // Hero
  translateElement('hero-title', 'hero-title');
  translateElement('hero-subtitle', 'hero-subtitle');
  translateElement('hero-cta', 'hero-cta');
  
  // About
  translateElement('about-title', 'about-title');
  translateElement('about-text', 'about-text');
  translateElement('feature-home-title', 'feature-home-title');
  translateElement('feature-home-desc', 'feature-home-desc');
  translateElement('feature-custom-title', 'feature-custom-title');
  translateElement('feature-custom-desc', 'feature-custom-desc');
  translateElement('feature-organic-title', 'feature-organic-title');
  translateElement('feature-organic-desc', 'feature-organic-desc');
  
  // Services
  translateElement('services-title', 'services-title');
  translateElement('services-view-all', 'services-view-all');
  translateElement('service-relajante-desc', 'service-relajante-desc');
  translateElement('service-descontracturante-desc', 'service-descontracturante-desc');
  translateElement('service-piedras-desc', 'service-piedras-desc');
  translateElement('service-prenatal-desc', 'service-prenatal-desc');
  translateElement('service-4manos-desc', 'service-4manos-desc');
  translateElement('service-piernas-desc', 'service-piernas-desc');
  translateElement('service-vela-desc', 'service-vela-desc');
  translateElement('service-drenaje-desc', 'service-drenaje-desc');
  translateElement('service-bambu-desc', 'service-bambu-desc');
  translateElement('service-pindas-desc', 'service-pindas-desc');
  translateElement('service-tejido-desc', 'service-tejido-desc');
  translateElement('service-craneo-desc', 'service-craneo-desc');
  translateElement('service-espalda-desc', 'service-espalda-desc');
  translateElement('service-deportivo-desc', 'service-deportivo-desc');
  translateElement('service-pies-desc', 'service-pies-desc');
  translateElement('service-manos-desc', 'service-manos-desc');
  
  // Corporate
  translateElement('corporate-title', 'corporate-title');
  translateHTML('corporate-intro', 'corporate-intro');
  translateElement('corporate-subtitle', 'corporate-subtitle');
  translateElement('package-half-title', 'package-half-title');
  translateElement('package-half-desc', 'package-half-desc');
  translateElement('package-half-hours', 'package-half-hours');
  translateElement('package-full-title', 'package-full-title');
  translateElement('package-full-desc', 'package-full-desc');
  translateElement('package-full-hours', 'package-full-hours');
  translateElement('package-hourly-title', 'package-hourly-title');
  translateElement('package-hourly-desc', 'package-hourly-desc');
  translateElement('package-hourly-hours', 'package-hourly-hours');
  translateElement('value-title', 'value-title');
  translateElement('value-desc', 'value-desc');
  translateElement('corporate-guarantee-text', 'corporate-guarantee-text');
  translateElement('corporate-cta', 'corporate-cta');
  
  // Contact
  translateElement('contact-title', 'contact-title');
  translateElement('contact-intro', 'contact-intro');
  translateElement('contact-phone-title', 'contact-phone-title');
  translateElement('contact-phone-desc', 'contact-phone-desc');
  translateElement('contact-email-title', 'contact-email-title');
  translateElement('contact-email-desc', 'contact-email-desc');
  translateElement('contact-hours-title', 'contact-hours-title');
  translateElement('contact-hours-desc', 'contact-hours-desc');
  translateHTML('contact-hours', 'contact-hours');
  
  // Form
  translateElement('form-name', 'form-name');
  translatePlaceholder('name', 'form-name-placeholder');
  translateElement('form-email', 'form-email');
  translatePlaceholder('email', 'form-email-placeholder');
  translateElement('form-phone', 'form-phone');
  translatePlaceholder('phone', 'form-phone-placeholder');
  translateElement('form-service', 'form-service');
  translatePlaceholder('service', 'form-service-select');
  translateElement('form-message', 'form-message');
  translatePlaceholder('message', 'form-message-placeholder');
  translateElement('form-submit', 'form-submit');
  
  // Footer
  translateElement('footer-tagline', 'footer-tagline');
}

// Language toggle button
const languageToggle = document.getElementById('languageToggle');
const languageText = languageToggle?.querySelector('.language-text');

if (languageToggle) {
  languageToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    translateAll();
    if (languageText) {
      languageText.textContent = currentLanguage === 'es' ? 'EN' : 'ES';
    }
  });
}


