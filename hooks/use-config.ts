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
      // Prima prova a caricare da localStorage (fallback)
      const localConfig = localStorage.getItem('lastello-config')
      if (localConfig) {
        try {
          const parsedConfig = JSON.parse(localConfig)
          setConfig(parsedConfig)
          console.log('Configurazione caricata da localStorage:', parsedConfig)
        } catch (parseError) {
          console.warn('Errore parsing localStorage config:', parseError)
        }
      }

      // Poi prova a caricare dal server
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

  return { config, isLoading, refetch: loadConfig }
}
