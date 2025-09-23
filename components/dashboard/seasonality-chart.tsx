'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

export function SeasonalityChart() {
  // Dati di stagionalità basati su analisi degli ultimi 5 anni
  const data = [
    { month: 'Gen', avgFunerals: 68892, trend: 'Alto', color: '#3B82F6' },
    { month: 'Feb', avgFunerals: 60371, trend: 'Alto', color: '#3B82F6' },
    { month: 'Mar', avgFunerals: 60661, trend: 'Alto', color: '#3B82F6' },
    { month: 'Apr', avgFunerals: 55846, trend: 'Alto', color: '#10B981' },
    { month: 'Mag', avgFunerals: 52425, trend: 'Basso', color: '#10B981' },
    { month: 'Giu', avgFunerals: 50563, trend: 'Basso', color: '#10B981' },
    { month: 'Lug', avgFunerals: 54176, trend: 'Medio', color: '#F59E0B' },
    { month: 'Ago', avgFunerals: 55369, trend: 'Medio', color: '#F59E0B' },
    { month: 'Set', avgFunerals: 51139, trend: 'Basso', color: '#F59E0B' },
    { month: 'Ott', avgFunerals: 54538, trend: 'Medio', color: '#EF4444' },
    { month: 'Nov', avgFunerals: 54934, trend: 'Medio', color: '#EF4444' },
    { month: 'Dic', avgFunerals: 65932, trend: 'Alto', color: '#EF4444' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Media Funerali: <span className="font-semibold">{data.avgFunerals.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Trend: <span className={`font-semibold ${
              data.trend === 'Alto' ? 'text-red-600' :
              data.trend === 'Medio' ? 'text-yellow-600' :
              'text-green-600'
            }`}>{data.trend}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (trend: string) => {
    switch (trend) {
      case 'Alto':
        return '#1E40AF'; // Blu scuro per mesi con molti funerali
      case 'Medio':
        return '#3B82F6'; // Blu medio per mesi medi
      case 'Basso':
        return '#93C5FD'; // Blu chiaro per mesi con pochi funerali
      default:
        return '#6B7280';
    }
  };

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          Stagionalità Funerali
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Media mensile degli ultimi 5 anni - Analisi stagionale
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
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
                domain={[45000, 70000]}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="avgFunerals"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.trend)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legenda stagionale */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1E40AF' }}></div>
            <span className="text-muted-foreground">Alto (Gen, Feb, Mar, Apr, Dic)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
            <span className="text-muted-foreground">Medio (Lug, Ago, Ott, Nov)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#93C5FD' }}></div>
            <span className="text-muted-foreground">Basso (Mag, Giu, Set)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
