import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Percorso del file feedback
    const feedbackFile = path.join(process.cwd(), 'data', 'feedback.json');

    // Leggi i feedback
    try {
      const fileContent = await fs.readFile(feedbackFile, 'utf8');
      const feedback = JSON.parse(fileContent);
      
      return NextResponse.json({
        success: true,
        count: feedback.length,
        feedback
      });
    } catch (error) {
      // File non esiste ancora
      return NextResponse.json({
        success: true,
        count: 0,
        feedback: []
      });
    }

  } catch (error) {
    console.error('Errore nella lettura del feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Errore nella lettura del feedback' },
      { status: 500 }
    );
  }
}
