import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json')

// GET - Leggi configurazione
export async function GET() {
  try {
    // Prova a leggere dal file (funziona in sviluppo locale)
    try {
      const fileContent = await fs.readFile(CONFIG_FILE, 'utf-8')
      const config = JSON.parse(fileContent)
      console.log('Configurazione caricata da file:', config)
      return NextResponse.json(config)
    } catch (fileError) {
      console.log('File config non trovato, restituendo configurazione di default')
    }
    
    // Configurazione di default se il file non esiste
    const defaultConfig = {
      preventiviMeseCorrente: 176,
      meseCorrente: 'Ottobre',
      ultimoAggiornamento: new Date().toLocaleString('it-IT')
    }
    
    console.log('Restituendo configurazione di default:', defaultConfig)
    return NextResponse.json(defaultConfig)
  } catch (error) {
    console.error('Errore lettura configurazione:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento della configurazione' },
      { status: 500 }
    )
  }
}

// POST - Salva configurazione (con localStorage come fallback)
export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    
    console.log('Config ricevuta:', config)
    console.log('Tipo preventiviMeseCorrente:', typeof config.preventiviMeseCorrente)
    console.log('Tipo meseCorrente:', typeof config.meseCorrente)
    
    // Validazione dati
    if (typeof config.preventiviMeseCorrente !== 'number' || 
        typeof config.meseCorrente !== 'string') {
      console.log('Validazione fallita')
      return NextResponse.json(
        { error: 'Dati di configurazione non validi' },
        { status: 400 }
      )
    }

    // Prova a salvare su file (funziona in sviluppo locale)
    let fileSaved = false
    try {
      await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
      console.log('Configurazione salvata su file:', CONFIG_FILE)
      fileSaved = true
    } catch (fileError) {
      console.log('Impossibile salvare su file (Netlify), configurazione validata:', config)
      fileSaved = false
    }
    
    return NextResponse.json({ 
      success: true, 
      message: fileSaved ? 'Configurazione salvata su server' : 'Configurazione salvata in locale (modalità Netlify)',
      config,
      fileSaved
    })
  } catch (error) {
    console.error('Errore salvataggio configurazione:', error)
    return NextResponse.json(
      { error: 'Errore nel salvataggio della configurazione' },
      { status: 500 }
    )
  }
}
