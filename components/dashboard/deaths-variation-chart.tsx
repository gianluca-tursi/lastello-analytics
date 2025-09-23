'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart3, Percent } from 'lucide-react';
import { useState } from 'react';

export function DeathsVariationChart() {
  const [showPercentages, setShowPercentages] = useState(true);
  const data = [
    { year: '2015', deaths: 656196, variation: 47243, variationPercent: 7.76 },
    { year: '2016', deaths: 627071, variation: -29125, variationPercent: -4.44 },
    { year: '2017', deaths: 659473, variation: 32402, variationPercent: 5.17 },
    { year: '2018', deaths: 640843, variation: -18630, variationPercent: -2.82 },
    { year: '2019', deaths: 644515, variation: 3672, variationPercent: 0.57 },
    { year: '2020', deaths: 746146, variation: 101631, variationPercent: 15.77 },
    { year: '2021', deaths: 709035, variation: -37111, variationPercent: -4.97 },
    { year: '2022', deaths: 713499, variation: 4464, variationPercent: 0.63 },
    { year: '2023', deaths: 660600, variation: -52899, variationPercent: -7.41 },
    { year: '2024', deaths: 650587, variation: -10013, variationPercent: -1.52 },
    { year: '2025', deaths: 654542, variation: 3955, variationPercent: 0.61 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Anno {label}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Decessi:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {data.deaths.toLocaleString()}
              </span>
            </div>
            {data.variation !== null && (
              <div className="flex items-center gap-2">
                {data.variation > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">Variazione:</span>
                <span className={`text-sm font-bold ${
                  data.variation > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {data.variation > 0 ? '+' : ''}{data.variation.toLocaleString()} 
                  ({data.variation > 0 ? '+' : ''}{data.variationPercent}%)
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="modern-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-red-500" />
            </div>
            <CardTitle>
              Variazione Decessi Anno su Anno (2015–2025)
            </CardTitle>
          </div>
          
          {/* Toggle Switch */}
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${!showPercentages ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              <BarChart3 className="h-4 w-4 inline mr-1" />
              Valori Assoluti
            </span>
            <button
              onClick={() => setShowPercentages(!showPercentages)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                showPercentages ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showPercentages ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${showPercentages ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              <Percent className="h-4 w-4 inline mr-1" />
              Percentuali
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {showPercentages 
            ? 'Analisi della variazione percentuale dei decessi in Italia - Fonte: ISTAT'
            : 'Analisi dei valori assoluti dei decessi in Italia - Fonte: ISTAT'
          }
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
                domain={showPercentages ? [-8, 18] : [600000, 750000]}
                tickFormatter={(value) => showPercentages ? `${value}%` : `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={showPercentages ? 0 : 650000} 
                stroke="#6b7280" 
                strokeDasharray="2 2" 
                opacity={0.5} 
              />
              
              <Line
                type="monotone"
                dataKey={showPercentages ? "variationPercent" : "deaths"}
                stroke="#3B82F6"
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  
                  if (showPercentages) {
                    if (payload.variationPercent === null) {
                      return <circle cx={cx} cy={cy} r={0} fill="transparent" />;
                    }
                    const isPositive = payload.variationPercent > 0;
                    const isHighVariation = Math.abs(payload.variationPercent) > 5;
                    
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHighVariation ? 6 : 4}
                        fill={isPositive ? '#EF4444' : '#10B981'}
                        stroke={isPositive ? '#DC2626' : '#059669'}
                        strokeWidth={2}
                      />
                    );
                  } else {
                    // Per i valori assoluti, colora in base all'anno
                    const isHigh = payload.deaths > 700000; // Soglia alta
                    const isLow = payload.deaths < 630000; // Soglia bassa
                    
                    let color = '#3B82F6'; // Blu normale
                    let strokeColor = '#1D4ED8';
                    
                    if (isHigh) {
                      color = '#EF4444'; // Rosso per valori alti
                      strokeColor = '#DC2626';
                    } else if (isLow) {
                      color = '#10B981'; // Verde per valori bassi
                      strokeColor = '#059669';
                    }
                    
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHigh ? 6 : 4}
                        fill={color}
                        stroke={strokeColor}
                        strokeWidth={2}
                      />
                    );
                  }
                }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Insight Box */}
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                {showPercentages ? 'Analisi Variazioni Decessi' : 'Analisi Valori Assoluti Decessi'}
              </h4>
              <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {showPercentages ? (
                  <>
                    <p>
                      <span className="font-bold">2020</span> ha registrato il picco più alto (+15,77%) dovuto alla pandemia COVID-19.
                    </p>
                    <p>
                      <span className="font-bold">2023</span> mostra la maggiore riduzione (-7,41%), indicando un ritorno ai livelli pre-pandemici.
                    </p>
                    <p>
                      Il <span className="font-bold">2025</span> proietta una stabilizzazione (+0,61%) verso i trend storici.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="font-bold">2020</span> ha registrato il valore più alto (746.146 decessi) a causa della pandemia COVID-19.
                    </p>
                    <p>
                      <span className="font-bold">2023</span> mostra il valore più basso (660.600 decessi), indicando un ritorno ai livelli pre-pandemici.
                    </p>
                    <p>
                      La <span className="font-bold">media del periodo</span> si attesta intorno ai 665.000 decessi annui.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
