'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, TrendingUp } from 'lucide-react';

export function RegionalComparison() {
  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Confronto Regionale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Mappa interattiva delle regioni italiane
        </div>
      </CardContent>
    </Card>
  );
}
