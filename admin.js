// ============================================
// ADMIN DASHBOARD FUNCTIONALITY
// ============================================

let leadsData = [];
let filteredLeads = [];

const logoutBtn = document.getElementById('logoutBtn');
const adminEmail = document.getElementById('adminEmail');
const tableLoading = document.getElementById('tableLoading');
const tableEmpty = document.getElementById('tableEmpty');
const tableWrapper = document.getElementById('tableWrapper');
const leadsTableBody = document.getElementById('leadsTableBody');
const searchInput = document.getElementById('searchInput');
const serviceFilter = document.getElementById('serviceFilter');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// Función para inicializar autenticación
function initAuth() {
  if (!window.firebaseAuth || !window.firebaseOnAuthStateChanged) {
    console.error('❌ [ADMIN] Firebase no está disponible aún');
    // Reintentar después de un momento
    setTimeout(initAuth, 100);
    return;
  }

  console.log('✅ [ADMIN] Firebase listo, inicializando autenticación...');
  
  // Verificar autenticación
  window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
    if (!user) {
      // No autenticado, redirigir a login
      console.log('⚠️ [ADMIN] Usuario no autenticado, redirigiendo...');
      window.location.href = 'login.html';
    } else {
      // Usuario autenticado, mostrar email y cargar datos
      console.log('✅ [ADMIN] Usuario autenticado:', user.email);
      adminEmail.textContent = user.email;
      loadLeads();
    }
  });
}

// Esperar a que Firebase esté listo o que el DOM esté cargado
if (window.firebaseReady) {
  // Firebase ya está listo
  initAuth();
} else {
  // Esperar al evento de Firebase listo o al DOM
  window.addEventListener('firebaseReady', initAuth);
  document.addEventListener('DOMContentLoaded', () => {
    // Si Firebase aún no está listo, esperar un poco más
    if (!window.firebaseReady) {
      setTimeout(() => {
        if (window.firebaseOnAuthStateChanged) {
          initAuth();
        }
      }, 500);
    }
  });
}

// Cerrar sesión
logoutBtn.addEventListener('click', async () => {
  try {
    await window.firebaseSignOut(window.firebaseAuth);
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
  }
});

// Cargar leads desde Firestore
function loadLeads() {
  console.log('📥 [ADMIN] Cargando leads desde Firestore...');
  
  const contactsCollection = window.firebaseCollection(window.firebaseFirestore, 'contacts');
  
  // Intentar ordenar por createdAt, si falla, cargar sin ordenar
  let q;
  try {
    q = window.firebaseQuery(contactsCollection, window.firebaseOrderBy('createdAt', 'desc'));
    console.log('✅ [ADMIN] Query con ordenamiento por createdAt');
  } catch (error) {
    console.warn('⚠️ [ADMIN] No se pudo ordenar por createdAt, cargando sin ordenar:', error);
    q = contactsCollection; // Cargar sin ordenar
  }
  
  // Usar onSnapshot para actualización en tiempo real
  window.firebaseOnSnapshot(q, (snapshot) => {
    console.log('📊 [ADMIN] Snapshot recibido, documentos:', snapshot.size);
    
    if (!snapshot.empty) {
      // Convertir documentos a array
      leadsData = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convertir Timestamp a Date si es necesario
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date());
        
        return {
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          service: data.service || '',
          message: data.message || '',
          subject: data.subject || '',
          createdAt: createdAt,
          timestamp: createdAt.toISOString()
        };
      });
      
      console.log('✅ [ADMIN] Leads cargados:', leadsData.length);
      
      // Ordenar por fecha si no se ordenó en la query
      leadsData.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.timestamp || 0));
        const dateB = b.createdAt instanceof Date ? b.createdAt : (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.timestamp || 0));
        return dateB - dateA; // Más reciente primero
      });
      
      filteredLeads = [...leadsData];
      renderLeads();
      updateStats();
    } else {
      console.log('📭 [ADMIN] No hay leads aún');
      leadsData = [];
      filteredLeads = [];
      showEmptyState();
    }
    
    tableLoading.style.display = 'none';
  }, (error) => {
    console.error('❌ [ADMIN] Error al cargar leads:', error);
    tableLoading.style.display = 'none';
    alert('Error al cargar los leads. Por favor, recarga la página.');
  });
}

// Filtrar leads
searchInput.addEventListener('input', filterLeads);
serviceFilter.addEventListener('change', filterLeads);

function filterLeads() {
  const searchTerm = searchInput.value.toLowerCase();
  const serviceFilterValue = serviceFilter.value;
  
  filteredLeads = leadsData.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm) ||
      lead.phone?.toLowerCase().includes(searchTerm);
    
    const matchesService = !serviceFilterValue || lead.service === serviceFilterValue;
    
    return matchesSearch && matchesService;
  });
  
  renderLeads();
  updateStats();
}

// Renderizar tabla de leads
function renderLeads() {
  if (filteredLeads.length === 0) {
    showEmptyState();
    return;
  }
  
  tableEmpty.style.display = 'none';
  tableWrapper.style.display = 'block';
  
  leadsTableBody.innerHTML = filteredLeads.map(lead => {
    // Manejar diferentes formatos de fecha
    let date;
    if (lead.createdAt instanceof Date) {
      date = lead.createdAt;
    } else if (lead.timestamp) {
      date = new Date(lead.timestamp);
    } else if (lead.createdAt) {
      date = lead.createdAt.toDate ? lead.createdAt.toDate() : new Date(lead.createdAt);
    } else {
      date = new Date();
    }
    
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(date);
    const serviceName = getServiceName(lead.service);
    
    return `
      <tr>
        <td>
          <div class="date-cell">
            <span class="date-value">${formattedDate}</span>
            <span class="time-value">${formattedTime}</span>
          </div>
        </td>
        <td><strong>${escapeHtml(lead.name || 'N/A')}</strong></td>
        <td>
          <a href="mailto:${lead.email}" class="email-link">
            ${escapeHtml(lead.email || 'N/A')}
          </a>
        </td>
        <td>
          <a href="tel:${lead.phone}" class="phone-link">
            ${escapeHtml(lead.phone || 'N/A')}
          </a>
        </td>
        <td><span class="service-badge">${serviceName}</span></td>
        <td>
          ${lead.message ? 
            `<button class="view-message-btn" onclick="showLeadDetail('${lead.id}')">Ver mensaje</button>` :
            '<span class="no-message">Sin mensaje</span>'
          }
        </td>
        <td>
          <div class="action-buttons">
            <a href="tel:${lead.phone}" class="action-btn call-btn" title="Llamar">
              <i class="fa-solid fa-phone"></i>
            </a>
            <a href="mailto:${lead.email}" class="action-btn email-btn" title="Email">
              <i class="fa-regular fa-envelope"></i>
            </a>
            <button class="action-btn detail-btn" onclick="showLeadDetail('${lead.id}')" title="Ver detalles">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteLead('${lead.id}', '${escapeHtml(lead.name || 'este lead')}')" title="Eliminar">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Mostrar estado vacío
function showEmptyState() {
  tableWrapper.style.display = 'none';
  tableEmpty.style.display = 'flex';
}

// Actualizar estadísticas (basadas en filtros)
function updateStats() {
  const total = filteredLeads.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayLeads = filteredLeads.filter(lead => {
    let leadDate;
    if (lead.createdAt instanceof Date) {
      leadDate = lead.createdAt;
    } else if (lead.timestamp) {
      leadDate = new Date(lead.timestamp);
    } else if (lead.createdAt) {
      leadDate = lead.createdAt.toDate ? lead.createdAt.toDate() : new Date(lead.createdAt);
    } else {
      return false;
    }
    leadDate.setHours(0, 0, 0, 0);
    return leadDate.getTime() === today.getTime();
  }).length;
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);
  
  const weekLeads = filteredLeads.filter(lead => {
    let leadDate;
    if (lead.createdAt instanceof Date) {
      leadDate = lead.createdAt;
    } else if (lead.timestamp) {
      leadDate = new Date(lead.timestamp);
    } else if (lead.createdAt) {
      leadDate = lead.createdAt.toDate ? lead.createdAt.toDate() : new Date(lead.createdAt);
    } else {
      return false;
    }
    return leadDate >= weekAgo;
  }).length;
  
  document.getElementById('totalLeads').textContent = total;
  document.getElementById('todayLeads').textContent = todayLeads;
  document.getElementById('weekLeads').textContent = weekLeads;
}

// Mostrar detalle del lead
window.showLeadDetail = function(leadId) {
  const lead = leadsData.find(l => l.id === leadId);
  if (!lead) return;
  
  // Manejar diferentes formatos de fecha
  let date;
  if (lead.createdAt instanceof Date) {
    date = lead.createdAt;
  } else if (lead.timestamp) {
    date = new Date(lead.timestamp);
  } else if (lead.createdAt) {
    date = lead.createdAt.toDate ? lead.createdAt.toDate() : new Date(lead.createdAt);
  } else {
    date = new Date();
  }
  
  const serviceName = getServiceName(lead.service);
  
  modalBody.innerHTML = `
    <div class="lead-detail">
      <div class="detail-section">
        <h3>Información Personal</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Nombre:</span>
            <span class="detail-value">${escapeHtml(lead.name || 'N/A')}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">
              <a href="mailto:${lead.email}">${escapeHtml(lead.email || 'N/A')}</a>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Teléfono:</span>
            <span class="detail-value">
              <a href="tel:${lead.phone}">${escapeHtml(lead.phone || 'N/A')}</a>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Fecha:</span>
            <span class="detail-value">${formatDate(date)} ${formatTime(date)}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3>Servicio de Interés</h3>
        <div class="service-detail">
          <span class="service-badge large">${serviceName}</span>
        </div>
      </div>
      
      ${lead.message ? `
        <div class="detail-section">
          <h3>Mensaje</h3>
          <div class="message-content">
            ${escapeHtml(lead.message)}
          </div>
        </div>
      ` : ''}
      
      ${lead.subject ? `
        <div class="detail-section">
          <h3>Asunto</h3>
          <div class="message-content">
            ${escapeHtml(lead.subject)}
          </div>
        </div>
      ` : ''}
      
      <div class="detail-actions">
        <a href="tel:${lead.phone}" class="detail-action-btn call">
          <i class="fa-solid fa-phone"></i> Llamar
        </a>
        <a href="mailto:${lead.email}" class="detail-action-btn email">
          <i class="fa-regular fa-envelope"></i> Enviar Email
        </a>
        <button class="detail-action-btn delete" onclick="deleteLead('${lead.id}', '${escapeHtml(lead.name || 'este lead')}'); modalOverlay.style.display = 'none';">
          <i class="fa-solid fa-trash"></i> Eliminar Lead
        </button>
      </div>
    </div>
  `;
  
  modalOverlay.style.display = 'flex';
};

// Cerrar modal
modalClose.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});

// Funciones auxiliares
function formatDate(date) {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getServiceName(serviceKey) {
  const services = {
    'relajante': 'Masaje Relajante',
    'descontracturante': 'Masaje Descontracturante',
    'piedras': 'Masaje con Piedras Volcánicas',
    'prenatal': 'Masaje Prenatal',
    '4manos': 'Masaje a 4 Manos',
    'piernas': 'Masaje Piernas Cansadas',
    'pareja': 'Masaje en Pareja',
    'soulbalance': 'Masaje Soul Balance - Cuatro Elementos',
    'otro': 'Otro servicio'
  };
  return services[serviceKey] || serviceKey || 'No especificado';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Eliminar lead
window.deleteLead = async function(leadId, leadName) {
  // Confirmar eliminación
  const confirmMessage = `¿Estás seguro de que deseas eliminar el lead de "${leadName}"?\n\nEsta acción no se puede deshacer.`;
  
  if (!confirm(confirmMessage)) {
    return; // Usuario canceló
  }
  
  try {
    console.log('🗑️ [ADMIN] Eliminando lead:', leadId);
    
    // Verificar que Firebase esté disponible
    if (!window.firebaseFirestore || !window.firebaseDoc || !window.firebaseDeleteDoc) {
      throw new Error('Firebase no está disponible. Por favor, recarga la página.');
    }
    
    // Obtener referencia al documento
    const contactsCollection = window.firebaseCollection(window.firebaseFirestore, 'contacts');
    const leadDocRef = window.firebaseDoc(contactsCollection, leadId);
    
    // Eliminar el documento
    await window.firebaseDeleteDoc(leadDocRef);
    
    console.log('✅ [ADMIN] Lead eliminado exitosamente:', leadId);
    
    // La UI se actualizará automáticamente gracias a onSnapshot
    // Pero mostramos un mensaje de confirmación
    console.log(`Lead de "${leadName}" eliminado exitosamente.`);
    
  } catch (error) {
    console.error('❌ [ADMIN] Error al eliminar lead:', error);
    
    let errorMessage = 'Error al eliminar el lead. Por favor, intenta nuevamente.';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'No tienes permisos para eliminar leads. Verifica las reglas de Firestore.';
    } else if (error.code === 'not-found') {
      errorMessage = 'El lead no fue encontrado. Puede que ya haya sido eliminado.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(errorMessage);
  }
};

