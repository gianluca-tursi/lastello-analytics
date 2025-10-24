import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json')

// GET - Leggi configurazione
export async function GET() {
  try {
    // Leggi sempre dal file JSON statico
    try {
      const fileContent = await fs.readFile(CONFIG_FILE, 'utf-8')
      const config = JSON.parse(fileContent)
      console.log('Configurazione caricata da file JSON:', config)
      return NextResponse.json(config)
    } catch (fileError) {
      console.log('File config non trovato, restituendo configurazione di default')
      
      // Configurazione di default se il file non esiste
      const defaultConfig = {
        preventiviMeseCorrente: 176,
        meseCorrente: 'Ottobre',
        ultimoAggiornamento: new Date().toLocaleString('it-IT')
      }
      
      return NextResponse.json(defaultConfig)
    }
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

    // Prova a salvare nel file JSON (funziona in locale)
    try {
      // Assicurati che la directory esista
      const dataDir = path.dirname(CONFIG_FILE)
      await fs.mkdir(dataDir, { recursive: true })
      
      // Salva la configurazione nel file JSON
      await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
      console.log('Configurazione salvata su file JSON:', CONFIG_FILE)
      console.log('Contenuto salvato:', config)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Configurazione salvata su file JSON con successo',
        config,
        fileSaved: true
      })
    } catch (fileError) {
      console.log('Impossibile salvare su file (Netlify), ma configurazione validata:', config)
      console.log('Errore file:', fileError instanceof Error ? fileError.message : String(fileError))
      
      // Su Netlify, restituisci successo ma indica che non è stato salvato su file
      return NextResponse.json({ 
        success: true, 
        message: 'Configurazione validata (su Netlify il file viene aggiornato tramite Git)',
        config,
        fileSaved: false
      })
    }
  } catch (error) {
    console.error('Errore salvataggio configurazione:', error)
    return NextResponse.json(
      { error: 'Errore nel salvataggio della configurazione' },
      { status: 500 }
    )
  }
}
