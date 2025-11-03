'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { auth, firestore } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { LeadModal } from './LeadModal'
import styles from './AdminDashboard.module.css'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  subject?: string
  createdAt: Date
  timestamp?: string
}

export function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Wait for auth to be initialized
    if (!auth) {
      console.warn('Firebase auth is not initialized yet')
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (!firestore || !user) return

    const contactsCollection = collection(firestore, 'contacts')
    let q
    try {
      q = query(contactsCollection, orderBy('createdAt', 'desc'))
    } catch (error) {
      console.warn('No se pudo ordenar por createdAt, cargando sin ordenar:', error)
      q = contactsCollection
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const leadsData: Lead[] = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data()
          const createdAt = data.createdAt?.toDate 
            ? data.createdAt.toDate() 
            : (data.createdAt ? new Date(data.createdAt) : new Date())
          
          return {
            id: docSnapshot.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            service: data.service || '',
            message: data.message || '',
            subject: data.subject || '',
            createdAt: createdAt,
            timestamp: createdAt.toISOString()
          }
        })

        leadsData.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.timestamp || 0)
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.timestamp || 0)
          return dateB.getTime() - dateA.getTime()
        })

        setLeads(leadsData)
        setLoading(false)
      },
      (error) => {
        console.error('Error al cargar leads:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
          lead.phone?.toLowerCase().includes(searchLower)
      )
    }

    if (serviceFilter) {
      filtered = filtered.filter((lead) => lead.service === serviceFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, serviceFilter])

  const handleLogout = async () => {
    try {
      if (!auth) {
        router.push('/login')
        return
      }
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Error al cerrar sesión. Por favor, intenta nuevamente.')
    }
  }

  const handleDelete = async (leadId: string, leadName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el lead de "${leadName}"?\n\nEsta acción no se puede deshacer.`)) {
      return
    }

    try {
      if (!firestore) throw new Error('Firestore no está disponible')
      const leadDocRef = doc(collection(firestore, 'contacts'), leadId)
      await deleteDoc(leadDocRef)
    } catch (error: any) {
      console.error('Error al eliminar lead:', error)
      alert(error.message || 'Error al eliminar el lead. Por favor, intenta nuevamente.')
    }
  }

  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setShowModal(true)
  }

  const stats = {
    total: filteredLeads.length,
    today: filteredLeads.filter((lead) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const leadDate = new Date(lead.createdAt)
      leadDate.setHours(0, 0, 0, 0)
      return leadDate.getTime() === today.getTime()
    }).length,
    week: filteredLeads.filter((lead) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      const leadDate = new Date(lead.createdAt)
      return leadDate >= weekAgo
    }).length
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getServiceName = (serviceKey: string) => {
    const services: Record<string, string> = {
      relajante: 'Masaje Relajante',
      descontracturante: 'Masaje Descontracturante',
      piedras: 'Masaje con Piedras Volcánicas',
      prenatal: 'Masaje Prenatal',
      '4manos': 'Masaje a 4 Manos',
      piernas: 'Masaje Piernas Cansadas',
      pareja: 'Masaje en Pareja',
      soulbalance: 'Masaje Soul Balance - Cuatro Elementos',
      otro: 'Otro servicio'
    }
    return services[serviceKey] || serviceKey || 'No especificado'
  }

  return (
    <>
      <header className={styles.adminHeader}>
        <div className={styles.adminHeaderContent}>
          <div className={styles.adminLogo}>
            <Image
              src="/superLogo.png"
              alt="Soul Balance"
              width={40}
              height={40}
              className={styles.adminLogoImage}
            />
            <span className={styles.adminLogoText}>SOUL BALANCE</span>
            <span className={styles.adminBadge}>Admin</span>
          </div>
          <div className={styles.adminUserInfo}>
            <span>{user?.email}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className={styles.adminMain}>
        <div className={styles.adminContainer}>
          <div className={styles.adminHeaderSection}>
            <h1 className={styles.adminTitle}>Dashboard de Leads</h1>
            <p className={styles.adminSubtitle}>
              Gestiona y revisa todos los leads capturados desde el formulario de contacto
            </p>
          </div>

          <div className={styles.adminStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fa-solid fa-chart-bar"></i>
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stats.total}</h3>
                <p className={styles.statLabel}>Total de Leads</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fa-solid fa-star"></i>
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stats.today}</h3>
                <p className={styles.statLabel}>Leads Hoy</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stats.week}</h3>
                <p className={styles.statLabel}>Leads Esta Semana</p>
              </div>
            </div>
          </div>

          <div className={styles.adminFilters}>
            <div className={styles.searchInputWrapper}>
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                placeholder="Buscar por nombre, email o teléfono..."
              />
            </div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todos los servicios</option>
              <option value="relajante">Masaje Relajante</option>
              <option value="descontracturante">Masaje Descontracturante</option>
              <option value="piedras">Masaje con Piedras Volcánicas</option>
              <option value="prenatal">Masaje Prenatal</option>
              <option value="4manos">Masaje a 4 Manos</option>
              <option value="piernas">Masaje Piernas Cansadas</option>
              <option value="pareja">Masaje en Pareja</option>
              <option value="soulbalance">Masaje Soul Balance - Cuatro Elementos</option>
              <option value="empresarial">Servicios Empresariales</option>
              <option value="otro">Otro servicio</option>
            </select>
          </div>

          <div className={styles.adminTableContainer}>
            {loading ? (
              <div className={styles.tableLoading}>
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinnerCircle}></div>
                  <div className={styles.spinnerCircle}></div>
                  <div className={styles.spinnerCircle}></div>
                </div>
                <p>Cargando leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className={styles.tableEmpty}>
                <div className={styles.emptyIcon}>
                  <i className="fa-regular fa-inbox"></i>
                </div>
                <h3>No hay leads aún</h3>
                <p>Los leads aparecerán aquí cuando los usuarios completen el formulario</p>
              </div>
            ) : (
              <div className={styles.adminTableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Servicio</th>
                      <th>Mensaje</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <div className={styles.dateCell}>
                            <span className={styles.dateValue}>{formatDate(lead.createdAt)}</span>
                            <span className={styles.timeValue}>{formatTime(lead.createdAt)}</span>
                          </div>
                        </td>
                        <td><strong>{lead.name || 'N/A'}</strong></td>
                        <td>
                          <a href={`mailto:${lead.email}`} className={styles.emailLink}>
                            {lead.email || 'N/A'}
                          </a>
                        </td>
                        <td>
                          <a href={`tel:${lead.phone}`} className={styles.phoneLink}>
                            {lead.phone || 'N/A'}
                          </a>
                        </td>
                        <td>
                          <span className={styles.serviceBadge}>{getServiceName(lead.service)}</span>
                        </td>
                        <td>
                          {lead.message ? (
                            <button
                              className={styles.viewMessageBtn}
                              onClick={() => handleViewDetail(lead)}
                            >
                              Ver mensaje
                            </button>
                          ) : (
                            <span className={styles.noMessage}>Sin mensaje</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <a href={`tel:${lead.phone}`} className={`${styles.actionBtn} ${styles.callBtn}`} title="Llamar">
                              <i className="fa-solid fa-phone"></i>
                            </a>
                            <a href={`mailto:${lead.email}`} className={`${styles.actionBtn} ${styles.emailBtn}`} title="Email">
                              <i className="fa-regular fa-envelope"></i>
                            </a>
                            <button
                              className={`${styles.actionBtn} ${styles.detailBtn}`}
                              onClick={() => handleViewDetail(lead)}
                              title="Ver detalles"
                            >
                              <i className="fa-regular fa-eye"></i>
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.deleteBtn}`}
                              onClick={() => handleDelete(lead.id, lead.name)}
                              title="Eliminar"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => {
            setShowModal(false)
            setSelectedLead(null)
          }}
          onDelete={(leadId, leadName) => {
            handleDelete(leadId, leadName)
            setShowModal(false)
            setSelectedLead(null)
          }}
        />
      )}
    </>
  )
}

