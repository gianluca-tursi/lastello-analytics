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
      console.log('Caricamento configurazione dal server...')
      const response = await fetch('/api/admin/config')
      if (response.ok) {
        const configData = await response.json()
        setConfig(configData)
        console.log('Configurazione caricata dal server:', configData)
      } else {
        console.error('Errore caricamento configurazione dal server:', response.status)
      }
    } catch (error) {
      console.error('Errore caricamento configurazione:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Ascolta i cambiamenti di focus per aggiornamenti quando si torna dalla pagina admin
  useEffect(() => {
    const handleFocus = () => {
      console.log('Focus ripristinato, ricaricando configurazione...')
      loadConfig()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return { config, isLoading, refetch: loadConfig }
}
