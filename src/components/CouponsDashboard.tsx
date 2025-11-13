'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth, firestore } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { AdminSidebar } from './AdminSidebar'
import styles from './CouponsDashboard.module.css'

interface Coupon {
  id: string
  code: string
  fullName: string
  phone: string
  createdAt: Date
  timestamp?: string
}

export function CouponsDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [maxMoves, setMaxMoves] = useState(18)
  const [editingMaxMoves, setEditingMaxMoves] = useState(false)
  const [savingMaxMoves, setSavingMaxMoves] = useState(false)

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

    const couponsCollection = collection(firestore, 'coupons')
    let q
    try {
      q = query(couponsCollection, orderBy('createdAt', 'desc'))
    } catch (error) {
      console.warn('No se pudo ordenar por createdAt, cargando sin ordenar:', error)
      q = couponsCollection
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const couponsData: Coupon[] = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data()
          const createdAt = data.createdAt?.toDate 
            ? data.createdAt.toDate() 
            : (data.createdAt ? new Date(data.createdAt) : new Date())
          
          return {
            id: docSnapshot.id,
            code: data.code || '',
            fullName: data.fullName || '',
            phone: data.phone || '',
            createdAt: createdAt,
            timestamp: createdAt.toISOString()
          }
        })

        couponsData.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.timestamp || 0)
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.timestamp || 0)
          return dateB.getTime() - dateA.getTime()
        })

        setCoupons(couponsData)
        setLoading(false)
      },
      (error) => {
        console.error('Error al cargar códigos de descuento:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  // Load max moves settings
  useEffect(() => {
    if (!firestore || !user) return

    const settingsDocRef = doc(firestore, 'settings', 'juega')
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          setMaxMoves(data.maxMoves || 18)
        } else {
          // Initialize with default value if doesn't exist
          setMaxMoves(18)
        }
      },
      (error) => {
        console.error('Error loading settings:', error)
        setMaxMoves(18)
      }
    )

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    let filtered = coupons

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (coupon) =>
          coupon.code?.toLowerCase().includes(searchLower) ||
          coupon.fullName?.toLowerCase().includes(searchLower) ||
          coupon.phone?.toLowerCase().includes(searchLower)
      )
    }

    setFilteredCoupons(filtered)
  }, [coupons, searchTerm])

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

  const handleDelete = async (couponId: string, couponCode: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el código "${couponCode}"?\n\nEsta acción no se puede deshacer.`)) {
      return
    }

    try {
      if (!firestore) throw new Error('Firestore no está disponible')
      const couponDocRef = doc(collection(firestore, 'coupons'), couponId)
      await deleteDoc(couponDocRef)
    } catch (error: any) {
      console.error('Error al eliminar código:', error)
      alert(error.message || 'Error al eliminar el código. Por favor, intenta nuevamente.')
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert(`Código "${code}" copiado al portapapeles`)
  }

  const handleSaveMaxMoves = async () => {
    if (!firestore) {
      alert('Error: Firestore no está disponible')
      return
    }

    const newMaxMoves = parseInt(String(maxMoves))
    if (isNaN(newMaxMoves) || newMaxMoves < 1) {
      alert('Por favor, ingresa un número válido mayor a 0')
      return
    }

    setSavingMaxMoves(true)

    try {
      const settingsDocRef = doc(firestore, 'settings', 'juega')
      await setDoc(settingsDocRef, { maxMoves: newMaxMoves }, { merge: true })
      setEditingMaxMoves(false)
      alert('Configuración guardada exitosamente')
    } catch (error: any) {
      console.error('Error saving max moves:', error)
      alert(error.message || 'Error al guardar la configuración. Por favor, intenta nuevamente.')
    } finally {
      setSavingMaxMoves(false)
    }
  }

  const stats = {
    total: filteredCoupons.length,
    today: filteredCoupons.filter((coupon) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const couponDate = new Date(coupon.createdAt)
      couponDate.setHours(0, 0, 0, 0)
      return couponDate.getTime() === today.getTime()
    }).length,
    week: filteredCoupons.filter((coupon) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      const couponDate = new Date(coupon.createdAt)
      return couponDate >= weekAgo
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
        <div className={styles.adminLayout}>
          <AdminSidebar />
          <div className={styles.adminContent}>
            <div className={styles.adminContainer}>
              <div className={styles.adminHeaderSection}>
                <div>
                  <h1 className={styles.adminTitle}>Códigos de Descuento</h1>
                  <p className={styles.adminSubtitle}>
                    Revisa todos los códigos de descuento generados desde el juego
                  </p>
                </div>
              </div>

              <div className={styles.adminStats}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statValue}>{stats.total}</h3>
                    <p className={styles.statLabel}>Total de Códigos</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statValue}>{stats.today}</h3>
                    <p className={styles.statLabel}>Códigos Hoy</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statValue}>{stats.week}</h3>
                    <p className={styles.statLabel}>Códigos Esta Semana</p>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className={styles.settingsSection}>
                <div className={styles.settingsCard}>
                  <div className={styles.settingsHeader}>
                    <div className={styles.settingsIcon}>
                      <i className="fa-solid fa-gear"></i>
                    </div>
                    <div className={styles.settingsContent}>
                      <h3 className={styles.settingsTitle}>Configuración del Juego</h3>
                      <p className={styles.settingsDescription}>Configura el número máximo de intentos permitidos</p>
                    </div>
                  </div>
                  <div className={styles.settingsBody}>
                    {editingMaxMoves ? (
                      <div className={styles.settingsInputGroup}>
                        <label htmlFor="maxMoves">Intentos Máximos:</label>
                        <input
                          type="number"
                          id="maxMoves"
                          min="1"
                          value={maxMoves}
                          onChange={(e) => setMaxMoves(parseInt(e.target.value) || 18)}
                          className={styles.settingsInput}
                        />
                        <div className={styles.settingsActions}>
                          <button
                            onClick={handleSaveMaxMoves}
                            disabled={savingMaxMoves}
                            className={styles.settingsSaveBtn}
                          >
                            {savingMaxMoves ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            onClick={() => setEditingMaxMoves(false)}
                            disabled={savingMaxMoves}
                            className={styles.settingsCancelBtn}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.settingsDisplay}>
                        <div className={styles.settingsValue}>
                          <span className={styles.settingsLabel}>Intentos Máximos:</span>
                          <span className={styles.settingsValueText}>{maxMoves}</span>
                        </div>
                        <button
                          onClick={() => setEditingMaxMoves(true)}
                          className={styles.settingsEditBtn}
                        >
                          <i className="fa-solid fa-pencil"></i>
                          Editar
                        </button>
                      </div>
                    )}
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
                    placeholder="Buscar por código, nombre o celular..."
                  />
                </div>
              </div>

              <div className={styles.adminTableContainer}>
                {loading ? (
                  <div className={styles.tableLoading}>
                    <div className={styles.loadingSpinner}>
                      <div className={styles.spinnerCircle}></div>
                      <div className={styles.spinnerCircle}></div>
                      <div className={styles.spinnerCircle}></div>
                    </div>
                    <p>Cargando códigos de descuento...</p>
                  </div>
                ) : filteredCoupons.length === 0 ? (
                  <div className={styles.tableEmpty}>
                    <div className={styles.emptyIcon}>
                      <i className="fa-regular fa-ticket"></i>
                    </div>
                    <h3>No hay códigos de descuento aún</h3>
                    <p>Los códigos aparecerán aquí cuando los usuarios completen el juego</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className={styles.adminTableWrapper}>
                      <table className={styles.adminTable}>
                        <thead>
                          <tr>
                            <th>Fecha Generación</th>
                            <th>Código</th>
                            <th>Nombre Completo</th>
                            <th>Celular</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCoupons.map((coupon) => (
                            <tr key={coupon.id} className={styles.clickableRow}>
                              <td>
                                <div className={styles.dateCell}>
                                  <span className={styles.dateValue}>{formatDate(coupon.createdAt)}</span>
                                  <span className={styles.timeValue}>{formatTime(coupon.createdAt)}</span>
                                </div>
                              </td>
                              <td>
                                <div className={styles.codeWrapper}>
                                  <span className={styles.codeBadge}>{coupon.code}</span>
                                </div>
                              </td>
                              <td><strong>{coupon.fullName || 'N/A'}</strong></td>
                              <td>
                                {coupon.phone ? (
                                  <a href={`tel:${coupon.phone}`} className={styles.phoneLink} onClick={(e) => e.stopPropagation()}>
                                    {coupon.phone}
                                  </a>
                                ) : (
                                  <span className={styles.noPhone}>N/A</span>
                                )}
                              </td>
                              <td>
                                <div className={styles.actionButtons}>
                                  <button
                                    className={`${styles.actionBtn} ${styles.copyBtn}`}
                                    onClick={() => handleCopyCode(coupon.code)}
                                    title="Copiar código"
                                  >
                                    <i className="fa-regular fa-copy"></i>
                                  </button>
                                  <button
                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                    onClick={() => handleDelete(coupon.id, coupon.code)}
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
                    <div className={styles.couponsCardContainer}>
                      {filteredCoupons.map((coupon) => (
                        <div key={coupon.id} className={styles.couponCard}>
                          <div className={styles.cardHeader}>
                            <div className={styles.cardDate}>
                              <i className="fa-solid fa-calendar"></i>
                              <div>
                                <span className={styles.cardDateValue}>{formatDate(coupon.createdAt)}</span>
                                <span className={styles.cardTimeValue}>{formatTime(coupon.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={styles.cardBody}>
                            <div className={styles.cardCode}>
                              <i className="fa-solid fa-ticket"></i>
                              <span className={styles.cardCodeValue}>{coupon.code}</span>
                            </div>
                            
                            <div className={styles.cardName}>
                              <i className="fa-solid fa-user"></i>
                              <strong>{coupon.fullName || 'N/A'}</strong>
                            </div>
                            
                            {coupon.phone && (
                              <div className={styles.cardPhone}>
                                <i className="fa-solid fa-phone"></i>
                                <a href={`tel:${coupon.phone}`} onClick={(e) => e.stopPropagation()}>
                                  {coupon.phone}
                                </a>
                              </div>
                            )}
                          </div>

                          <div className={styles.cardActions}>
                            <button
                              className={`${styles.cardActionBtn} ${styles.cardCopyBtn}`}
                              onClick={() => handleCopyCode(coupon.code)}
                              title="Copiar código"
                            >
                              <i className="fa-regular fa-copy"></i>
                              <span>Copiar</span>
                            </button>
                            <button
                              className={`${styles.cardActionBtn} ${styles.cardDeleteBtn}`}
                              onClick={() => handleDelete(coupon.id, coupon.code)}
                              title="Eliminar"
                            >
                              <i className="fa-solid fa-trash"></i>
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

