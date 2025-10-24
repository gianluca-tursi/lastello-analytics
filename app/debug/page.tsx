'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Debug Formula - Analisi Calcoli
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Tabella per analizzare i salti nella formula. Mostra preventivi da 1 a 200 con tutti i calcoli intermedi.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analisi Formula Preventivi → Decessi</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Valori di Soglia e Preventivi Necessari */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {(() => {
                // Calcola i preventivi necessari per ogni soglia
                const giorniTrascorsi = 18;
                const giorniTotali = 31;
                const giugno2025 = 49294;
                const giugnoBaseline = 50114;
                const scale = giugno2025 / giugnoBaseline;
                const baseline2025Ottobre = 54288 * scale;
                
                const soglie = [
                  { nome: 'P10 (Basso)', valore: 41471, colore: 'red' },
                  { nome: 'P25 (Medio Basso)', valore: 51839, colore: 'orange' },
                  { nome: 'P50 (Normale)', valore: 54288, colore: 'yellow' },
                  { nome: 'P75 (Medio Alto)', valore: 54839, colore: 'blue' },
                  { nome: 'P90 (Alto)', valore: 65807, colore: 'green' }
                ];
                
                return soglie.map((soglia) => {
                  // Calcola preventivi necessari: stima = baseline * rapporto
                  // rapporto = preventiviNormalizzati / 246
                  // preventiviNormalizzati = (preventivi / 18) * 31
                  const rapporto = soglia.valore / baseline2025Ottobre;
                  const preventiviNormalizzati = rapporto * 246;
                  const preventiviNecessari = Math.round((preventiviNormalizzati * giorniTrascorsi) / giorniTotali);
                  
                  return (
                    <div key={soglia.nome} className={`p-3 bg-${soglia.colore}-50 dark:bg-${soglia.colore}-900/20 rounded-lg border border-${soglia.colore}-200`}>
                      <div className={`text-sm font-semibold text-${soglia.colore}-800`}>{soglia.nome}</div>
                      <div className={`text-lg font-mono text-${soglia.colore}-600`}>{soglia.valore.toLocaleString()}</div>
                      <div className={`text-xs text-${soglia.colore}-600 mt-1`}>Preventivi: {preventiviNecessari}</div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="max-h-96 overflow-auto border rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-2 py-1 text-left border-b">Preventivi</th>
                    <th className="px-2 py-1 text-left border-b">Normalizzati</th>
                    <th className="px-2 py-1 text-left border-b">Rapporto</th>
                    <th className="px-2 py-1 text-left border-b">Baseline 2025</th>
                    <th className="px-2 py-1 text-left border-b">Stima</th>
                    <th className="px-2 py-1 text-left border-b">Classificazione</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 200 }, (_, i) => i + 1).map((preventivi) => {
                    const currentMonth = 9; // Ottobre = 9
                    
                    // Baseline storica 2019-2024 per ottobre
                    const baselineOttobre = {
                      P25: 51839,
                      P50: 54288, 
                      P75: 54839
                    };

                    // Calibra baseline 2025
                    const giugno2025 = 49294;
                    const giugnoBaseline = 50114;
                    const scale = giugno2025 / giugnoBaseline;
                    const baseline2025Ottobre = baselineOttobre.P50 * scale;
                    
                    // Normalizza preventivi parziali (18 ottobre su 31 giorni)
                    const giorniTrascorsi = 18;
                    const giorniTotali = 31;
                    const preventiviNormalizzati = (preventivi / giorniTrascorsi) * giorniTotali;
                    
                    // Metodologia semplificata
                    const rapporto = preventiviNormalizzati / 246;
                    const stima = baseline2025Ottobre * rapporto;
                    
                    // Classificazione
                    const P10 = baselineOttobre.P25 * 0.8;
                    const P25 = baselineOttobre.P25;
                    const P50 = baselineOttobre.P50;
                    const P75 = baselineOttobre.P75;
                    const P90 = baselineOttobre.P75 * 1.2;
                    
                    let classificazione = '';
                    if (stima < P10) classificazione = 'Basso';
                    else if (stima < P25) classificazione = 'Medio Basso';
                    else if (stima < P75) classificazione = 'Normale';
                    else if (stima < P90) classificazione = 'Medio Alto';
                    else classificazione = 'Alto';

                    return (
                      <tr key={preventivi} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-2 py-1 border-b font-mono">{preventivi}</td>
                        <td className="px-2 py-1 border-b font-mono">{preventiviNormalizzati.toFixed(1)}</td>
                        <td className="px-2 py-1 border-b font-mono">{rapporto.toFixed(3)}</td>
                        <td className="px-2 py-1 border-b font-mono">{baseline2025Ottobre.toFixed(0)}</td>
                        <td className="px-2 py-1 border-b font-mono">{Math.round(stima).toLocaleString()}</td>
                        <td className="px-2 py-1 border-b">
                          <span className={`px-2 py-1 rounded text-xs ${
                            classificazione === 'Basso' ? 'bg-red-100 text-red-800' :
                            classificazione === 'Medio Basso' ? 'bg-orange-100 text-orange-800' :
                            classificazione === 'Normale' ? 'bg-yellow-100 text-yellow-800' :
                            classificazione === 'Medio Alto' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {classificazione}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
