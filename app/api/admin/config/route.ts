import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json')

// GET - Leggi configurazione
export async function GET() {
  try {
    // Prova a leggere dal file
    try {
      const fileContent = await fs.readFile(CONFIG_FILE, 'utf-8')
      const config = JSON.parse(fileContent)
      console.log('Configurazione caricata da file:', config)
      return NextResponse.json(config)
    } catch (fileError) {
      console.log('File config non trovato o errore lettura:', fileError instanceof Error ? fileError.message : String(fileError))
      
      // Se il file non esiste, crealo con valori di default
      const defaultConfig = {
        preventiviMeseCorrente: 176,
        meseCorrente: 'Ottobre',
        ultimoAggiornamento: new Date().toLocaleString('it-IT')
      }
      
      try {
        // Crea la directory se non esiste
        const dataDir = path.dirname(CONFIG_FILE)
        await fs.mkdir(dataDir, { recursive: true })
        
        // Crea il file con i valori di default
        await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf-8')
        console.log('File config creato con valori di default:', defaultConfig)
        return NextResponse.json(defaultConfig)
      } catch (createError) {
        console.error('Errore creazione file config:', createError)
        return NextResponse.json(defaultConfig)
      }
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

    // Salva sempre su file
    try {
      // Assicurati che la directory esista
      const dataDir = path.dirname(CONFIG_FILE)
      await fs.mkdir(dataDir, { recursive: true })
      
      // Salva la configurazione
      await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
      console.log('Configurazione salvata su file:', CONFIG_FILE)
      console.log('Contenuto salvato:', config)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Configurazione salvata su file con successo',
        config,
        fileSaved: true
      })
    } catch (fileError) {
      console.error('Errore salvataggio su file:', fileError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Errore nel salvataggio su file',
          details: fileError instanceof Error ? fileError.message : String(fileError)
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Errore salvataggio configurazione:', error)
    return NextResponse.json(
      { error: 'Errore nel salvataggio della configurazione' },
      { status: 500 }
    )
  }
}
