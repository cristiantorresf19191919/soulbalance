import { useState, useEffect } from 'react'
import { firestore } from '@/lib/firebase'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'

interface JuegaSettings {
  enabled: boolean
}

const SETTINGS_DOC_ID = 'juega'
const SETTINGS_COLLECTION = 'settings'

export function useJuegaSettings() {
  const [enabled, setEnabled] = useState<boolean>(true) // Por defecto habilitado
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firestore) {
      setLoading(false)
      return
    }

    const settingsDocRef = doc(firestore, SETTINGS_COLLECTION, SETTINGS_DOC_ID)

    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as JuegaSettings
          setEnabled(data.enabled !== false) // Por defecto true si no existe
        } else {
          // Si no existe el documento, crear uno por defecto habilitado
          setDoc(settingsDocRef, { enabled: true })
            .then(() => setEnabled(true))
            .catch((err) => {
              console.error('Error creando configuración por defecto:', err)
              setError('Error al inicializar configuración')
            })
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error escuchando configuración:', err)
        setError('Error al cargar configuración')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const updateSettings = async (newEnabled: boolean) => {
    if (!firestore) {
      setError('Firestore no está disponible')
      return { success: false, message: 'Firestore no está disponible' }
    }

    try {
      const settingsDocRef = doc(firestore, SETTINGS_COLLECTION, SETTINGS_DOC_ID)
      await setDoc(settingsDocRef, { enabled: newEnabled }, { merge: true })
      return { success: true, message: 'Configuración actualizada exitosamente' }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar configuración'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }

  return { enabled, loading, error, updateSettings }
}

