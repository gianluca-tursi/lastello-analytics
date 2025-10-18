'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Area, AreaChart, ReferenceLine } from 'recharts';
import React from 'react';
import { useConfig } from '@/hooks/use-config';

// Dati del Termometro mortalità - Italia (aggiornati con dati ISTAT)
const data = [
  { 
    month: 'Gen', 
    monthFull: 'Gennaio',
    p25: 66127, 
    p75: 72424, 
    bandaWidth: 72424 - 66127, // Larghezza della banda
    mediana: 66896,
    reali2025: 66021,
    stime2025: null,
    classificazione: null
  },
  { 
    month: 'Feb', 
    monthFull: 'Febbraio',
    p25: 56743, 
    p75: 59996, 
    bandaWidth: 59996 - 56743,
    mediana: 59077,
    reali2025: 54243,
    stime2025: null,
    classificazione: null
  },
  { 
    month: 'Mar', 
    monthFull: 'Marzo',
    p25: 57279, 
    p75: 66866, 
    bandaWidth: 66866 - 57279,
    mediana: 60269,
    reali2025: 56404,
    stime2025: null,
    classificazione: null
  },
  { 
    month: 'Apr', 
    monthFull: 'Aprile',
    p25: 52329, 
    p75: 61857, 
    bandaWidth: 61857 - 52329,
    mediana: 55092,
    reali2025: 51533,
    stime2025: null,
    classificazione: null
  },
  { 
    month: 'Mag', 
    monthFull: 'Maggio',
    p25: 50882, 
    p75: 54211, 
    bandaWidth: 54211 - 50882,
    mediana: 51812,
    reali2025: 49776,
    stime2025: null,
    classificazione: null
  },
  { 
    month: 'Giu', 
    monthFull: 'Giugno',
    p25: 48190, 
    p75: 51985, 
    bandaWidth: 51985 - 48190,
    mediana: 50114,
    reali2025: 49294,
    stime2025: null,
    classificazione: null
  },
  { 
    month: 'Lug', 
    monthFull: 'Luglio',
    p25: 52142, 
    p75: 54477, 
    bandaWidth: 54477 - 52142,
    mediana: 53702,
    reali2025: null,
    stime2025: 53520,
    classificazione: 'NORMALE'
  },
  { 
    month: 'Ago', 
    monthFull: 'Agosto',
    p25: 52297, 
    p75: 56433, 
    bandaWidth: 56433 - 52297,
    mediana: 54847,
    reali2025: null,
    stime2025: 51314,
    classificazione: 'BASSO'
  },
  { 
    month: 'Set', 
    monthFull: 'Settembre',
    p25: 48420, 
    p75: 50974, 
    bandaWidth: 50974 - 48420,
    mediana: 49830,
    reali2025: 49830, // Dato reale basato su 249 preventivi Lastello
    stime2025: null,
    classificazione: 'NORMALE'
  },
  { 
    month: 'Ott', 
    monthFull: 'Ottobre',
    p25: 51839, 
    p75: 54839, 
    bandaWidth: 54839 - 51839,
    mediana: 54288,
    reali2025: null,
    stime2025: 54288, // Proiezione basata su 176 preventivi (18/31 giorni)
    classificazione: 'NORMALE'
  },
  { 
    month: 'Nov', 
    monthFull: 'Novembre',
    p25: 54337, 
    p75: 56353, 
    bandaWidth: 56353 - 54337,
    mediana: 54786,
    reali2025: null,
    stime2025: null,
    classificazione: null
  },
  { 
    month: 'Dic', 
    monthFull: 'Dicembre',
    p25: 60910, 
    p75: 67361, 
    bandaWidth: 67361 - 60910,
    mediana: 65468,
    reali2025: null,
    stime2025: null,
    classificazione: null
  },
];

export function Overview() {
  const { config } = useConfig();

  // Funzione per calcolare la classificazione basata sui preventivi
  const getClassification = (preventivi: number, monthIndex: number) => {
    // Mediane storiche per mese (basate sui dati del termometro)
    const medianeStoriche = [
      66896, // Gennaio
      59077, // Febbraio  
      60269, // Marzo
      55092, // Aprile
      51812, // Maggio
      50114, // Giugno
      53702, // Luglio
      54847, // Agosto
      49830, // Settembre
      54288, // Ottobre
      54786, // Novembre
      65468  // Dicembre
    ];

    const medianaCorrente = medianeStoriche[monthIndex];
    
    // Conversione preventivi -> decessi stimati (formula: preventivi × 200)
    const decessiStimati = preventivi * 200;
    
    // Calcolo percentuale rispetto alla mediana
    const percentuale = (decessiStimati / medianaCorrente) * 100;
    
    // Classificazione basata su percentuale
    if (percentuale >= 105) return 'ALTO';
    if (percentuale <= 95) return 'BASSO';
    return 'NORMALE';
  };

  // Aggiorna i dati del grafico basandosi sulla configurazione
  const getUpdatedData = () => {
    const currentMonthIndex = new Date().getMonth(); // 0-11
    
    return data.map((item, index) => {
      // Se è il mese corrente, aggiorna con i dati della configurazione
      if (index === currentMonthIndex) {
        const classificazione = getClassification(config.preventiviMeseCorrente, index);
        return {
          ...item,
          reali2025: config.preventiviMeseCorrente * 200, // Conversione preventivi -> decessi stimati
          stime2025: null,
          classificazione: classificazione
        };
      }
      return item;
    });
  };

  const updatedData = getUpdatedData();
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.monthFull || label}</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Intervallo P25-P75:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {data.p25.toLocaleString()} - {data.p75.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-gray-600 border-dashed"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Mediana:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {data.mediana.toLocaleString()}
              </span>
            </div>
            {data.reali2025 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">2025 Reale:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {data.reali2025.toLocaleString()}
                </span>
              </div>
            )}
            {data.stime2025 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">2025 Stima:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {data.stime2025.toLocaleString()}
                </span>
                {data.classificazione && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    data.classificazione === 'ALTO' ? 'bg-red-100 text-red-800' :
                    data.classificazione === 'BASSO' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {data.classificazione}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={updatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="1 1" stroke="#e5e7eb" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 0}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[48000, 73000]}
            ticks={[48000, 52000, 56000, 60000, 64000, 68000, 72000]}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Linee P25 e P75 */}
          <Line
            type="monotone"
            dataKey="p75"
            stroke="#FDE047"
            strokeWidth={2}
            strokeOpacity={0.6}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="p25"
            stroke="#FDE047"
            strokeWidth={2}
            strokeOpacity={0.6}
            dot={false}
            connectNulls={false}
          />
          
          {/* Linea mediana tratteggiata */}
          <Line
            type="monotone"
            dataKey="mediana"
            stroke="#374151"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          
          {/* Linea dati reali 2025 */}
          <Line
            type="monotone"
            dataKey="reali2025"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload, index } = props;
              if (!payload.reali2025) {
                return <circle cx={cx} cy={cy} r={0} fill="transparent" />;
              }
              return (
                <g key={`reale-dot-${index}`}>
                  <text
                    x={cx}
                    y={cy - 15}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill={payload.classificazione === 'ALTO' ? '#dc2626' : 
                          payload.classificazione === 'BASSO' ? '#16a34a' : '#ca8a04'}
                  >
                    {payload.classificazione}
                  </text>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#3b82f6"
                    stroke="#1d4ed8"
                    strokeWidth={2}
                  />
                </g>
              );
            }}
            connectNulls={false}
          />
          
          {/* Punti stime 2025 */}
          <Line
            type="monotone"
            dataKey="stime2025"
            stroke="none"
            dot={(props) => {
              const { cx, cy, payload, index } = props;
              if (!payload.stime2025) {
                return <circle cx={cx} cy={cy} r={0} fill="transparent" />;
              }
              return (
                <g key={`stima-dot-${index}`}>
                  <text
                    x={cx}
                    y={cy - 15}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill={payload.classificazione === 'ALTO' ? '#dc2626' : 
                          payload.classificazione === 'BASSO' ? '#16a34a' : '#ca8a04'}
                  >
                    {payload.classificazione}
                  </text>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#f97316"
                    stroke="#ea580c"
                    strokeWidth={2}
                  />
                </g>
              );
            }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      
      {/* Legenda personalizzata */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-yellow-400 opacity-60"></div>
            <span>Intervallo storico tipico (2019–2024)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 border-2 border-gray-600 border-dashed"></div>
            <span>Mediana 2019–24</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>2025 reale fino a giugno</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>2025 stima modello</span>
          </div>
        </div>
      </div>
    </div>
  );
}