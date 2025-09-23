'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Target, TrendingUp, Users } from 'lucide-react';

export function MarketingInsights() {
  const insights = [
    {
      icon: Target,
      title: 'Target Audience',
      description: 'Focus su famiglie 45-65 anni',
      metric: '+23%',
      color: 'blue',
    },
    {
      icon: TrendingUp,
      title: 'Conversion Rate',
      description: 'Tasso di conversione online',
      metric: '3.4%',
      color: 'green',
    },
    {
      icon: Users,
      title: 'Customer Retention',
      description: 'Clienti che ritornano',
      metric: '67%',
      color: 'purple',
    },
    {
      icon: Lightbulb,
      title: 'Campaign ROI',
      description: 'Ritorno sugli investimenti',
      metric: '245%',
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <Card 
            key={insight.title} 
            className="modern-card hover-lift"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[insight.color as keyof typeof colorClasses]}`}>
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-medium mt-4">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-1">{insight.metric}</p>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
