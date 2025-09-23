import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { rating, suggestion, emoji, label } = await request.json();

    // Crea il feedback object
    const feedback = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('it-IT'),
      rating,
      emoji,
      label,
      suggestion: suggestion || 'Nessun suggerimento fornito',
      userAgent: request.headers.get('user-agent') || 'Unknown',
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'Unknown'
    };

    // Percorso del file feedback
    const feedbackDir = path.join(process.cwd(), 'data');
    const feedbackFile = path.join(feedbackDir, 'feedback.json');

    // Crea la directory se non esiste
    try {
      await fs.mkdir(feedbackDir, { recursive: true });
    } catch (error) {
      // Directory già esiste
    }

    // Leggi i feedback esistenti
    let existingFeedback = [];
    try {
      const fileContent = await fs.readFile(feedbackFile, 'utf8');
      existingFeedback = JSON.parse(fileContent);
    } catch (error) {
      // File non esiste ancora, inizializza array vuoto
      existingFeedback = [];
    }

    // Aggiungi il nuovo feedback
    existingFeedback.push(feedback);

    // Salva nel file
    await fs.writeFile(feedbackFile, JSON.stringify(existingFeedback, null, 2), 'utf8');

    // Log per debug
    console.log('Feedback salvato:', feedback);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback salvato con successo!',
        feedbackId: feedback.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Errore nel salvataggio del feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Errore nel salvataggio del feedback' },
      { status: 500 }
    );
  }
}
