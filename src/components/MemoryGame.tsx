'use client'

import { useState, useEffect, useCallback } from 'react'
import { firestore } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore'
import confetti from 'canvas-confetti'
import { services } from '@/data/services'
import styles from './MemoryGame.module.css'

interface Card {
  id: string
  serviceId: string
  name: string
  image: string
  isFlipped: boolean
  isMatched: boolean
}

interface CouponData {
  code: string
  fullName: string
  phone: string
  createdAt: any
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [maxMoves, setMaxMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [savingCoupon, setSavingCoupon] = useState(false)
  const [couponSaved, setCouponSaved] = useState(false)

  // Select random services for the game (6 pairs = 12 cards)
  const getGameServices = useCallback(() => {
    const shuffled = [...services].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 6)
  }, [])

  // Initialize game
  const initializeGame = useCallback(() => {
    const gameServices = getGameServices()
    const gameCards: Card[] = []
    
    // Create pairs
    gameServices.forEach((service, index) => {
      const pairId = `pair-${index}`
      gameCards.push(
        {
          id: `${pairId}-1`,
          serviceId: service.id,
          name: service.name,
          image: service.image,
          isFlipped: false,
          isMatched: false
        },
        {
          id: `${pairId}-2`,
          serviceId: service.id,
          name: service.name,
          image: service.image,
          isFlipped: false,
          isMatched: false
        }
      )
    })

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5)
    
    setCards(shuffled)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    // maxMoves is loaded from Firebase settings
    setGameWon(false)
    setGameOver(false)
    setCouponCode(null)
    setShowCouponForm(false)
    setFullName('')
    setPhone('')
    setCouponSaved(false)
  }, [getGameServices])

  // Load max moves from Firebase settings
  useEffect(() => {
    if (!firestore) return

    const settingsDocRef = doc(firestore, 'settings', 'juega')
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          const maxMovesFromSettings = data.maxMoves || 18
          setMaxMoves(maxMovesFromSettings)
        } else {
          // Default value if settings don't exist
          setMaxMoves(18)
        }
      },
      (error) => {
        console.error('Error loading settings:', error)
        // Fallback to default
        setMaxMoves(18)
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Generate coupon code
  const generateCouponCode = (): string => {
    const prefix = 'SOUL'
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${randomNum}`
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    if (
      gameWon ||
      gameOver ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedCards.length >= 2
    ) {
      return
    }

    const newFlippedCards = [...flippedCards, index]
    const newCards = [...cards]
    newCards[index].isFlipped = true

    setCards(newCards)
    setFlippedCards(newFlippedCards)

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards
      const firstCard = newCards[firstIndex]
      const secondCard = newCards[secondIndex]

      const isMatch = firstCard.serviceId === secondCard.serviceId
      const willWin = isMatch && matchedPairs === 5

      setMoves(prev => prev + 1)

      // If this is the winning move, set gameWon immediately to prevent game over
      if (willWin) {
        setGameWon(true)
      }

      if (isMatch) {
        // Match found - keep cards flipped and mark as matched
        setTimeout(() => {
          newCards[firstIndex].isMatched = true
          newCards[secondIndex].isMatched = true
          // Keep cards flipped so they remain visible
          newCards[firstIndex].isFlipped = true
          newCards[secondIndex].isFlipped = true
          setCards([...newCards])
          setFlippedCards([])
          setMatchedPairs(prev => {
            const newPairs = prev + 1
            if (newPairs === 6) {
              // Game won!
              handleGameWin()
            }
            return newPairs
          })
        }, 1500)
      } else {
        // No match - flip back
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false
          newCards[secondIndex].isFlipped = false
          setCards([...newCards])
          setFlippedCards([])
        }, 1500)
      }
    }
  }

  // Check if game is over (out of moves)
  useEffect(() => {
    // Only check for game over if the game has been initialized (maxMoves > 0)
    // and the player has actually made moves
    if (maxMoves > 0 && moves > 0 && moves >= maxMoves && matchedPairs < 6 && !gameWon && !gameOver) {
      setGameOver(true)
    }
  }, [moves, maxMoves, matchedPairs, gameWon, gameOver])

  // Handle game win
  const handleGameWin = () => {
    setGameWon(true)
    const code = generateCouponCode()
    setCouponCode(code)
    
    // Confetti celebration
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Show coupon form after a short delay
    setTimeout(() => {
      setShowCouponForm(true)
    }, 2000)
  }

  // Save coupon to Firebase
  const handleSaveCoupon = async () => {
    if (!fullName.trim()) {
      alert('Por favor, ingresa tu nombre completo')
      return
    }

    if (!phone.trim()) {
      alert('Por favor, ingresa tu número de celular')
      return
    }

    if (!firestore || !couponCode) {
      alert('Error: No se pudo guardar el cupón. Por favor, intenta nuevamente.')
      return
    }

    setSavingCoupon(true)

    try {
      const couponData: CouponData = {
        code: couponCode,
        fullName: fullName.trim(),
        phone: phone.trim(),
        createdAt: serverTimestamp()
      }

      const couponsCollection = collection(firestore, 'coupons')
      await addDoc(couponsCollection, couponData)

      setCouponSaved(true)
    } catch (error: any) {
      console.error('Error saving coupon:', error)
      alert('Error al guardar el cupón. Por favor, intenta nuevamente.')
    } finally {
      setSavingCoupon(false)
    }
  }

  return (
    <div className={styles.gameContainer}>
      {/* Game Stats */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Parejas</span>
          <span className={styles.statValue}>{matchedPairs}/6</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Movimientos</span>
          <span className={styles.statValue}>{moves}/{maxMoves}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Restantes</span>
          <span className={styles.statValue}>{maxMoves - moves}</span>
        </div>
      </div>

      {/* Game Over Message */}
      {gameOver && !gameWon && (
        <div className={styles.gameOverModal}>
          <div className={styles.modalContent}>
            <h2>😔 Se acabaron los movimientos</h2>
            <p>No te rindas, ¡inténtalo de nuevo!</p>
            <button onClick={initializeGame} className={styles.resetButton}>
              Jugar de Nuevo
            </button>
          </div>
        </div>
      )}

      {/* Win Modal with Coupon */}
      {gameWon && (
        <div className={styles.winModal}>
          <div className={styles.modalContent}>
            <h2 className={styles.celebrationTitle}>🎉 ¡Felicidades! 🎉</h2>
            <p className={styles.celebrationText}>Has encontrado todas las parejas</p>
            
            {!showCouponForm ? (
              <div className={styles.loadingCoupon}>
                <div className={styles.spinner}></div>
                <p>Preparando tu premio...</p>
              </div>
            ) : !couponSaved ? (
              <div className={styles.couponForm}>
                <div className={styles.couponCodeDisplay}>
                  <span className={styles.couponLabel}>Tu código de descuento:</span>
                  <span className={styles.couponCode}>{couponCode}</span>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Nombre Completo *</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Número de Celular *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ingresa tu número de celular"
                    required
                  />
                </div>
                <button
                  onClick={handleSaveCoupon}
                  disabled={savingCoupon || !fullName.trim() || !phone.trim()}
                  className={styles.saveButton}
                >
                  {savingCoupon ? 'Guardando...' : 'Aplicar Código'}
                </button>
              </div>
            ) : (
              <div className={styles.couponSaved}>
                <h3>✅ ¡Código Guardado!</h3>
                <p>Tu código <strong>{couponCode}</strong> ha sido registrado.</p>
                <p>Puedes usarlo en tu próxima reserva.</p>
                <button onClick={initializeGame} className={styles.resetButton}>
                  Jugar de Nuevo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Grid */}
      <div className={styles.gameGrid}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`${styles.card} ${
              card.isFlipped || card.isMatched ? styles.flipped : ''
            } ${card.isMatched ? styles.matched : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <div className={styles.cardBackPattern}>
                  <i className="fas fa-spa"></i>
                  <span>Aura Spa</span>
                </div>
              </div>
              <div className={styles.cardBack}>
                <img src={card.image} alt={card.name} />
                <div className={styles.cardOverlay}>
                  <span className={styles.cardName}>{card.name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reset Button */}
      {!gameWon && !gameOver && (
        <button onClick={initializeGame} className={styles.resetButton}>
          <i className="fas fa-redo"></i> Reiniciar Juego
        </button>
      )}
    </div>
  )
}

