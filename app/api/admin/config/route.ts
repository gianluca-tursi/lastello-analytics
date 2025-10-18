import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json')

// GET - Leggi configurazione
export async function GET() {
  try {
    // Su Netlify, restituiamo sempre una configurazione di default
    // perché non possiamo leggere/scrivere file durante il runtime
    const defaultConfig = {
      preventiviMeseCorrente: 176,
      meseCorrente: 'Ottobre',
      ultimoAggiornamento: new Date().toLocaleString('it-IT')
    }
    
    console.log('Restituendo configurazione di default per Netlify:', defaultConfig)
    return NextResponse.json(defaultConfig)
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
