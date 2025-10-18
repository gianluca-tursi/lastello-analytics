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
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/config')
      if (response.ok) {
        const configData = await response.json()
        setConfig(configData)
      }
    } catch (error) {
      console.error('Errore caricamento configurazione:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { config, isLoading, refetch: loadConfig }
}
