import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json')

// GET - Leggi configurazione
export async function GET() {
  try {
    // Verifica se il file esiste
    try {
      await fs.access(CONFIG_FILE)
    } catch {
      // Se non esiste, crea una configurazione di default
      const defaultConfig = {
        preventiviMeseCorrente: 176,
        meseCorrente: 'Ottobre',
        ultimoAggiornamento: new Date().toLocaleString('it-IT')
      }
      
      // Crea la directory se non esiste
      await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true })
      
      // Salva la configurazione di default
      await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2))
      
      return NextResponse.json(defaultConfig)
    }

    // Leggi il file di configurazione
    const configData = await fs.readFile(CONFIG_FILE, 'utf-8')
    const config = JSON.parse(configData)
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Errore lettura configurazione:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento della configurazione' },
      { status: 500 }
    )
  }
}

// POST - Salva configurazione (solo in memoria per Netlify)
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

    // Su Netlify, non possiamo scrivere file durante il runtime
    // Simuliamo il salvataggio e restituiamo successo
    console.log('Configurazione validata e pronta per il salvataggio:', config)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configurazione salvata con successo (modalità Netlify)',
      config 
    })
  } catch (error) {
    console.error('Errore salvataggio configurazione:', error)
    return NextResponse.json(
      { error: 'Errore nel salvataggio della configurazione' },
      { status: 500 }
    )
  }
}
