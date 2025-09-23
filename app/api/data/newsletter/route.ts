import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataDir = path.join(process.cwd(), 'data');
const newsletterFilePath = path.join(dataDir, 'newsletter.json');

// Helper to read JSON file
async function readJsonFile(filePath: string) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // File does not exist, return empty array
    }
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

export async function GET() {
  try {
    const newsletterData = await readJsonFile(newsletterFilePath);
    return NextResponse.json(newsletterData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
