'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Flame, Cross, Shovel } from 'lucide-react';

export function TrendEvolutionChart() {
  const data = [
    {
      year: '2019',
      cremazione: 30.7,
      tumulazione: 50.8,
      inumazione: 18.5,
      fonte: 'Stima basata sul tasso di cremazione 2019 (30,68%) e sul rapporto 2021 tra tumulazione e inumazione'
    },
    {
      year: '2020',
      cremazione: 33.2,
      tumulazione: 49.0,
      inumazione: 17.8,
      fonte: 'Stima derivata dal tasso di cremazione 2020 (33,22%)'
    },
    {
      year: '2021',
      cremazione: 34.44,
      tumulazione: 48.06,
      inumazione: 17.50,
      fonte: 'Dati effettivi: SEFIT riporta 244.186 cremazioni (34,44%), 340.767 tumulazioni (48,06%) e 124.082 inumazioni (17,5%)'
    },
    {
      year: '2022',
      cremazione: 35.0,
      tumulazione: 46.0,
      inumazione: 19.0,
      fonte: 'Previsioni SEFIT per il 2022: 234.500 cremazioni (35%), 308.200 tumulazioni (46%) e 127.300 inumazioni (19%)'
    },
    {
      year: '2023',
      cremazione: 38.16,
      tumulazione: 44.34,
      inumazione: 17.50,
      fonte: 'Dati effettivi 2023: 252.075 cremazioni (38,16%), 292.920 tumulazioni (44,34%) e 115.605 inumazioni (17,5%)'
    },
    {
      year: '2024',
      cremazione: 40.0,
      tumulazione: 41.0,
      inumazione: 19.0,
      fonte: 'Stime SEFIT per il 2024'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-3">Anno {label}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Cremazione:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{data.cremazione}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Cross className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Tumulazione:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{data.tumulazione}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Shovel className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Inumazione:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{data.inumazione}%</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              {data.fonte}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          Evoluzione Tipologie Funebri (2019-2024)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Trend percentuale delle modalità di sepoltura in Italia - Fonte: SEFIT, ISTAT
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 55]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry) => (
                  <div className="flex items-center gap-2">
                    {value === 'cremazione' && <Flame className="h-4 w-4" style={{ color: entry.color }} />}
                    {value === 'tumulazione' && <Cross className="h-4 w-4" style={{ color: entry.color }} />}
                    {value === 'inumazione' && <Shovel className="h-4 w-4" style={{ color: entry.color }} />}
                    <span className="capitalize">{value}</span>
                  </div>
                )}
              />
              
              <Line
                type="monotone"
                dataKey="cremazione"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                name="cremazione"
              />
              <Line
                type="monotone"
                dataKey="tumulazione"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                name="tumulazione"
              />
              <Line
                type="monotone"
                dataKey="inumazione"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }}
                name="inumazione"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Insight Box */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Trend Crescente delle Cremazioni
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Le cremazioni sono passate dal <span className="font-bold">30,7%</span> nel 2019 al <span className="font-bold">40%</span> nel 2024, 
                registrando un incremento di <span className="font-bold">+9,3 punti percentuali</span> in soli 5 anni. 
                Questo trend riflette il cambiamento culturale verso modalità di sepoltura più sostenibili e meno costose, al superamento dei tabù religiosi, alla secolarizzazione e a nuove esigenze pratiche legate a spazi cimiteriali.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
