'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const metrics = [
  {
    title: 'Nord Italia',
    value: 52.3,
    change: 3.2,
    trend: 'up',
    description: 'Tasso di cremazione',
    color: 'blue',
  },
  {
    title: 'Centro Italia',
    value: 41.7,
    change: 1.8,
    trend: 'up',
    description: 'Tasso di cremazione',
    color: 'cyan',
  },
  {
    title: 'Sud Italia',
    value: 28.9,
    change: -0.5,
    trend: 'down',
    description: 'Tasso di cremazione',
    color: 'purple',
  },
  {
    title: 'Isole',
    value: 35.2,
    change: 0,
    trend: 'neutral',
    description: 'Tasso di cremazione',
    color: 'indigo',
  },
];

const colorClasses = {
  blue: 'bg-blue-500',
  cyan: 'bg-cyan-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
};

export function MarketMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card 
          key={metric.title} 
          className="modern-card hover-lift"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">{metric.title}</CardTitle>
              {metric.trend === 'up' && (
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              )}
              {metric.trend === 'down' && (
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
              )}
              {metric.trend === 'neutral' && (
                <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                  <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
            <CardDescription>{metric.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{metric.value}%</span>
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                  metric.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-2"
                indicatorClassName={colorClasses[metric.color as keyof typeof colorClasses]}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
