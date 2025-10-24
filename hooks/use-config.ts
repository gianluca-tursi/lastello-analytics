'use client'

import { useState, useEffect } from 'react'

interface ConfigData {
  preventiviMeseCorrente: number
  meseCorrente: string
  ultimoAggiornamento: string
}

export function useConfig() {
  const [config, setConfig] = useState<ConfigData>({
    preventiviMeseCorrente: 176,
    meseCorrente: 'Ottobre',
    ultimoAggiornamento: new Date().toLocaleString('it-IT')
  })
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
      console.log('useConfig: Caricamento configurazione dal server...')
      const response = await fetch('/api/admin/config')
      console.log('useConfig: Response status:', response.status)
      
      if (response.ok) {
        const configData = await response.json()
        console.log('useConfig: Dati ricevuti dal server:', configData)
        setConfig(configData)
        console.log('useConfig: Configurazione caricata dal server:', configData)
      } else {
        console.error('useConfig: Errore caricamento configurazione dal server:', response.status)
      }
    } catch (error) {
      console.error('useConfig: Errore caricamento configurazione:', error)
    } finally {
      console.log('useConfig: Caricamento completato, isLoading = false')
      setIsLoading(false)
    }
  }

  // Ascolta i cambiamenti di focus per aggiornamenti quando si torna dalla pagina admin
  useEffect(() => {
    const handleFocus = () => {
      console.log('useConfig: Focus ripristinato, ricaricando configurazione...')
      loadConfig()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return { config, isLoading, refetch: loadConfig }
}
