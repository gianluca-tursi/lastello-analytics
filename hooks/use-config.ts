'use client'

import { useState, useEffect } from 'react'

interface ConfigData {
  preventiviMeseCorrente: number
  meseCorrente: string
  ultimoAggiornamento: string
}

export function useConfig() {
  // Carica immediatamente i dati da localStorage se disponibili
  const getInitialConfig = (): ConfigData => {
    if (typeof window !== 'undefined') {
      try {
        const localConfig = localStorage.getItem('lastello-config')
        if (localConfig) {
          const parsed = JSON.parse(localConfig)
          console.log('Configurazione iniziale caricata da localStorage:', parsed)
          return parsed
        }
      } catch (error) {
        console.warn('Errore caricamento configurazione iniziale:', error)
      }
    }
    return {
      preventiviMeseCorrente: 176,
      meseCorrente: 'Ottobre',
      ultimoAggiornamento: new Date().toLocaleString('it-IT')
    }
  }

  const [config, setConfig] = useState<ConfigData>(getInitialConfig())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Forza il caricamento anche se abbiamo dati iniziali
    loadConfig()
  }, [])

  // Aggiungi anche un listener per il caricamento della pagina
  useEffect(() => {
    const handlePageLoad = () => {
      console.log('Pagina caricata, verificando configurazione...')
      loadConfig()
    }

    window.addEventListener('load', handlePageLoad)
    return () => window.removeEventListener('load', handlePageLoad)
  }, [])

  const loadConfig = async () => {
    try {
      // Controlla se abbiamo già dati validi da localStorage
      const localConfig = localStorage.getItem('lastello-config')
      if (localConfig) {
        try {
          const parsedConfig = JSON.parse(localConfig)
          // Solo aggiorna se i dati sono diversi da quelli attuali
          if (parsedConfig.preventiviMeseCorrente !== config.preventiviMeseCorrente) {
            setConfig(parsedConfig)
            console.log('Configurazione aggiornata da localStorage:', parsedConfig)
          } else {
            console.log('Configurazione già sincronizzata con localStorage')
          }
          setIsLoading(false)
          return // Esci subito se abbiamo dati locali validi
        } catch (parseError) {
          console.warn('Errore parsing localStorage config:', parseError)
        }
      }

      // Solo se non ci sono dati locali, prova a caricare dal server
      console.log('Nessun dato locale trovato, caricamento dal server...')
      const response = await fetch('/api/admin/config')
      if (response.ok) {
        const configData = await response.json()
        setConfig(configData)
        // Salva anche in localStorage come backup
        localStorage.setItem('lastello-config', JSON.stringify(configData))
        console.log('Configurazione caricata dal server e salvata in localStorage:', configData)
      }
    } catch (error) {
      console.error('Errore caricamento configurazione:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Ascolta i cambiamenti di localStorage per aggiornamenti in tempo reale
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastello-config' && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue)
          setConfig(newConfig)
          console.log('Configurazione aggiornata da localStorage:', newConfig)
        } catch (error) {
          console.error('Errore parsing nuova configurazione:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Ascolta anche i cambiamenti di focus (quando l'utente torna dalla pagina admin)
    const handleFocus = () => {
      loadConfig()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return { config, isLoading, refetch: loadConfig }
}
