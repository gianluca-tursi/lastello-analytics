import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()
    
    if (!type || !data) {
      return NextResponse.json({ error: 'Tipo e dati richiesti' }, { status: 400 })
    }

    // Crea la directory data se non esiste
    const dataDir = path.join(process.cwd(), 'data')
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Determina il file basato sul tipo
    const filename = type === 'feedback' ? 'feedback.json' : 'newsletter.json'
    const filepath = path.join(dataDir, filename)

    // Leggi i dati esistenti
    let existingData = []
    try {
      const fileContent = await fs.readFile(filepath, 'utf-8')
      existingData = JSON.parse(fileContent)
    } catch {
      // File non esiste ancora, continua con array vuoto
    }

    // Aggiungi i nuovi dati
    const newData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('it-IT'),
      ...data
    }

    existingData.push(newData)

    // Salva i dati aggiornati
    await fs.writeFile(filepath, JSON.stringify(existingData, null, 2), 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: 'Dati salvati con successo',
      id: newData.id 
    })

  } catch (error) {
    console.error('Errore nel salvataggio:', error)
    return NextResponse.json({ 
      error: 'Errore interno del server' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type || !['feedback', 'newsletter'].includes(type)) {
      return NextResponse.json({ error: 'Tipo non valido' }, { status: 400 })
    }

    const dataDir = path.join(process.cwd(), 'data')
    const filename = type === 'feedback' ? 'feedback.json' : 'newsletter.json'
    const filepath = path.join(dataDir, filename)

    try {
      const fileContent = await fs.readFile(filepath, 'utf-8')
      const data = JSON.parse(fileContent)
      return NextResponse.json({ success: true, data })
    } catch {
      return NextResponse.json({ success: true, data: [] })
    }

  } catch (error) {
    console.error('Errore nel caricamento:', error)
    return NextResponse.json({ 
      error: 'Errore interno del server' 
    }, { status: 500 })
  }
}
