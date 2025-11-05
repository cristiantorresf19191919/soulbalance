'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth, firestore } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { LeadModal } from './LeadModal'
import { allServiceOptions, getServiceLabel } from '@/data/serviceCategories'
import styles from './AdminDashboard.module.css'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  serviceName?: string
  message: string
  subject?: string
  createdAt: Date
  timestamp?: string
  // Booking fields
  bookingDate?: Date | any
  bookingDateTimestamp?: number
  duration?: string
  price?: string
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
          
          // Handle booking date
          let bookingDate: Date | undefined
          if (data.bookingDateTimestamp) {
            bookingDate = new Date(data.bookingDateTimestamp)
          } else if (data.bookingDate?.toDate) {
            bookingDate = data.bookingDate.toDate()
          } else if (data.bookingDate) {
            bookingDate = new Date(data.bookingDate)
          }
          
          return {
            id: docSnapshot.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            service: data.service || '',
            serviceName: data.serviceName || '',
            message: data.message || '',
            subject: data.subject || '',
            createdAt: createdAt,
            timestamp: createdAt.toISOString(),
            bookingDate: bookingDate,
            bookingDateTimestamp: data.bookingDateTimestamp,
            duration: data.duration || '',
            price: data.price || ''
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
    return getServiceLabel(serviceKey) || serviceKey || 'No especificado'
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
            <Link href="/" className={styles.adminLogoText}>
              SOUL BALANCE
            </Link>
            <span 
              className={styles.adminBadge}
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            >
              Admin
            </span>
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
              {allServiceOptions.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
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
              <>
                {/* Desktop Table View */}
                <div className={styles.adminTableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Fecha Registro</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Servicio</th>
                        <th>Fecha Reserva</th>
                        <th>Duración</th>
                        <th>Precio</th>
                        <th>Mensaje</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr 
                          key={lead.id}
                          className={`${lead.bookingDate ? styles.bookingRow : ''} ${styles.clickableRow}`}
                          onClick={() => handleViewDetail(lead)}
                        >
                          <td>
                            <div className={styles.dateCell}>
                              <span className={styles.dateValue}>{formatDate(lead.createdAt)}</span>
                              <span className={styles.timeValue}>{formatTime(lead.createdAt)}</span>
                            </div>
                          </td>
                          <td><strong>{lead.name || 'N/A'}</strong></td>
                          <td>
                            <a href={`mailto:${lead.email}`} className={styles.emailLink} onClick={(e) => e.stopPropagation()}>
                              {lead.email || 'N/A'}
                            </a>
                          </td>
                          <td>
                            <a href={`tel:${lead.phone}`} className={styles.phoneLink} onClick={(e) => e.stopPropagation()}>
                              {lead.phone || 'N/A'}
                            </a>
                          </td>
                          <td>
                            <div className={styles.serviceWrapper}>
                              <i className="fa-solid fa-spa"></i>
                              <span className={styles.serviceBadge}>
                                {lead.serviceName || getServiceName(lead.service)}
                              </span>
                            </div>
                          </td>
                          <td>
                            {lead.bookingDate ? (
                              <div className={styles.bookingDateCell}>
                                <div className={styles.bookingDateWrapper}>
                                  <i className="fa-solid fa-calendar-days"></i>
                                  <span className={styles.bookingDate}>
                                    {formatDate(lead.bookingDate)}
                                  </span>
                                </div>
                                <span className={styles.bookingTime}>
                                  {formatTime(lead.bookingDate)}
                                </span>
                              </div>
                            ) : (
                              <span className={styles.noBooking}>Sin reserva</span>
                            )}
                          </td>
                          <td>
                            {lead.duration ? (
                              <div className={styles.durationWrapper}>
                                <i className="fa-solid fa-clock"></i>
                                <span className={styles.durationBadge}>{lead.duration}</span>
                              </div>
                            ) : (
                              <span className={styles.noBooking}>-</span>
                            )}
                          </td>
                          <td>
                            {lead.price ? (
                              <div className={styles.priceWrapper}>
                                <i className="fa-solid fa-dollar-sign"></i>
                                <span className={styles.priceBadge}>
                                  {(() => {
                                    // Clean price: remove double $, keep only numbers and decimal points
                                    const cleaned = lead.price.replace(/\$\s*/g, '').replace(/[^0-9.,]/g, '')
                                    return cleaned ? `$${cleaned}` : lead.price
                                  })()}
                                </span>
                              </div>
                            ) : (
                              <span className={styles.noBooking}>-</span>
                            )}
                          </td>
                          <td>
                            {lead.message ? (
                              <span 
                                className={styles.hasMessage}
                                title={lead.message.length > 50 ? lead.message.substring(0, 100) + '...' : lead.message}
                              >
                                <i className="fa-solid fa-comment"></i> 
                                <span className={styles.messagePreview}>
                                  {lead.message.length > 30 ? lead.message.substring(0, 30) + '...' : lead.message}
                                </span>
                              </span>
                            ) : (
                              <span className={styles.noMessage}>Sin mensaje</span>
                            )}
                          </td>
                          <td>
                            <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
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

                {/* Mobile Card View */}
                <div className={styles.leadsCardContainer}>
                  {filteredLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      className={`${styles.leadCard} ${lead.bookingDate ? styles.bookingCard : ''}`}
                      onClick={() => handleViewDetail(lead)}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.cardHeaderLeft}>
                          <div className={styles.cardDate}>
                            <i className="fa-solid fa-calendar"></i>
                            <div>
                              <span className={styles.cardDateValue}>{formatDate(lead.createdAt)}</span>
                              <span className={styles.cardTimeValue}>{formatTime(lead.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        {lead.bookingDate && (
                          <div className={styles.cardBookingBadge}>
                            <i className="fa-solid fa-check-circle"></i>
                            Reservado
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.cardBody}>
                        <div className={styles.cardName}>
                          <i className="fa-solid fa-user"></i>
                          <strong>{lead.name || 'N/A'}</strong>
                        </div>
                        
                        <div className={styles.cardContactInfo}>
                          <a 
                            href={`mailto:${lead.email}`} 
                            className={styles.cardEmail}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="fa-regular fa-envelope"></i>
                            {lead.email || 'N/A'}
                          </a>
                          <a 
                            href={`tel:${lead.phone}`} 
                            className={styles.cardPhone}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="fa-solid fa-phone"></i>
                            {lead.phone || 'N/A'}
                          </a>
                        </div>

                        <div className={styles.cardService}>
                          <i className="fa-solid fa-spa"></i>
                          <span>{lead.serviceName || getServiceName(lead.service)}</span>
                        </div>

                        {lead.bookingDate && (
                          <div className={styles.cardBookingInfo}>
                            <div className={styles.cardBookingDate}>
                              <i className="fa-solid fa-calendar-days"></i>
                              <div>
                                <span className={styles.cardBookingDateLabel}>Fecha Reserva</span>
                                <span className={styles.cardBookingDateValue}>
                                  {formatDate(lead.bookingDate)} {formatTime(lead.bookingDate)}
                                </span>
                              </div>
                            </div>
                            {lead.duration && (
                              <div className={styles.cardDuration}>
                                <i className="fa-solid fa-clock"></i>
                                <span>{lead.duration}</span>
                              </div>
                            )}
                            {lead.price && (
                              <div className={styles.cardPrice}>
                                <i className="fa-solid fa-dollar-sign"></i>
                                <span className={styles.cardPriceValue}>{lead.price}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {lead.message && (
                          <div className={styles.cardMessageIndicator}>
                            <i className="fa-solid fa-comment"></i>
                            <span>Tiene mensaje</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                        <a href={`tel:${lead.phone}`} className={`${styles.cardActionBtn} ${styles.cardCallBtn}`} title="Llamar">
                          <i className="fa-solid fa-phone"></i>
                        </a>
                        <a href={`mailto:${lead.email}`} className={`${styles.cardActionBtn} ${styles.cardEmailBtn}`} title="Email">
                          <i className="fa-regular fa-envelope"></i>
                        </a>
                        <button
                          className={`${styles.cardActionBtn} ${styles.cardDetailBtn}`}
                          onClick={() => handleViewDetail(lead)}
                          title="Ver detalles"
                        >
                          <i className="fa-regular fa-eye"></i>
                        </button>
                        <button
                          className={`${styles.cardActionBtn} ${styles.cardDeleteBtn}`}
                          onClick={() => handleDelete(lead.id, lead.name)}
                          title="Eliminar"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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

