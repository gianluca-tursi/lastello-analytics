'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Flame, Cross, Shovel } from 'lucide-react';

export function FuneralRequestsChart() {
  const data = [
    { name: 'Cremazioni', value: 45.2, count: 1250, color: '#3B82F6' },
    { name: 'Tumulazioni', value: 32.8, count: 907, color: '#10B981' },
    { name: 'Inumazioni', value: 22.0, count: 608, color: '#F59E0B' },
  ];

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#374151" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentuale: <span className="font-semibold">{data.value}%</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Totale: <span className="font-semibold">{data.count.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Cremazioni':
        return <Flame className="h-4 w-4" />;
      case 'Tumulazioni':
        return <Cross className="h-4 w-4" />;
      case 'Inumazioni':
        return <Shovel className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Flame className="h-5 w-5 text-blue-500" />
          </div>
          Distribuzione Tipologie
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Dati dell'ultimo anno - Totale: {total.toLocaleString()} richieste
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={20}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend - Compact Layout */}
        <div className="mt-4 space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-center gap-1 flex-1">
                {getIcon(item.name)}
                <span className="text-xs font-medium">{item.name}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-bold">{item.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
