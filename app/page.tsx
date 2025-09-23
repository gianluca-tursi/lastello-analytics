'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from '@/components/dashboard/overview';
import { RecentRequests } from '@/components/dashboard/recent-requests';
import { MarketMetrics } from '@/components/dashboard/market-metrics';
import { RegionalComparison } from '@/components/dashboard/regional-comparison';
import { MarketingInsights } from '@/components/dashboard/marketing-insights';
import { FuneralRequestsChart } from '@/components/dashboard/funeral-requests-chart';
import { SeasonalityChart } from '@/components/dashboard/seasonality-chart';
import { TrendEvolutionChart } from '@/components/dashboard/trend-evolution-chart';
import { DeathsVariationChart } from '@/components/dashboard/deaths-variation-chart';
import { ProvinceChart } from '@/components/dashboard/province-chart';
import { FeedbackSystem } from '@/components/feedback-system';
import { TrendingUp, Users, Euro, Building2, Activity, BarChart3, Globe, Sparkles, X } from 'lucide-react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [trendType, setTrendType] = useState<'Crescente' | 'Moderato' | 'Decrescente'>('Crescente');
  const [showViewportTip, setShowViewportTip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const handleGoToProvinces = () => {
    const el = document.getElementById('province-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleString('it-IT'));
    
    // Set trend type to 'Crescente' for September (High)
    setTrendType('Crescente');
    
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      if (isMobileDevice) {
        setShowViewportTip(true);
      }
    };
    
    checkMobile();
    
    // Check orientation change
    const handleOrientationChange = () => {
      if (isMobile && window.innerWidth > window.innerHeight) {
        // Landscape mode on mobile - hide tip
        setShowViewportTip(false);
      }
    };
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('it-IT'));
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile]);

  if (!mounted) {
    return null; // Return null on server-side to prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {showViewportTip && isMobile && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg px-4 py-2 flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Per una migliore esperienza, ruota il telefono in orizzontale per vedere meglio i grafici.
            </span>
            <button
              type="button"
              aria-label="Chiudi suggerimento"
              onClick={() => setShowViewportTip(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}
      {/* Header with gradient */}
      <div className="animated-gradient text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="h-8 w-8" />
                Lastello Analytics
              </h1>
              <p className="text-blue-100">Monitoraggio dei dati del settore funebre</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Ultimo aggiornamento</p>
              <p className="text-lg font-semibold">{currentTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass rounded-full p-1 shadow-lg">
            <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            {/* Bottone scroll a sezione province */}
            <button type="button" onClick={handleGoToProvinces} className="rounded-full px-3 py-2 text-sm font-medium hover:bg-white/70 bg-white text-blue-600 shadow-md inline-flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Dati Provinciali
            </button>
            <TabsTrigger value="marketing" disabled title="presto in arrivo" className="rounded-full opacity-60 cursor-not-allowed">
              <Activity className="h-4 w-4 mr-2" />
              Marketing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="modern-card hover-lift group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Trend Richieste Settembre
                  </CardTitle>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Alto
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      ↗
                    </span>
                    <span className="text-xs text-muted-foreground">
                      sopra il trend storico
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Decessi 2025 - spostata in seconda posizione */}
              <Card className="modern-card hover-lift group animation-delay-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Decessi Anno 2025
                  </CardTitle>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    +0,61%
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    rispetto al 2024
                  </div>
                </CardContent>
              </Card>

              {/* Tasso Cremazione - spostata in terza posizione */}
              <Card className="modern-card hover-lift group animation-delay-400">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tasso Cremazione
                  </CardTitle>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                    44.2%
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">+2.1%</span>
                    <span className="text-xs text-muted-foreground">rispetto all'anno scorso</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card hover-lift group animation-delay-600">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Agenzie in Italia
                  </CardTitle>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                    8.176
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    fonte registroaziende.it
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-12">
              <Card className="col-span-8 modern-card glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Termometro mortalità – Italia
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              
              <div className="col-span-4 space-y-6">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Insight Termometro Mortalità Italia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">Prima metà 2025</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Andamento in linea con i trend degli ultimi anni, ma sotto soglia minima.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">Estate stabile</h4>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Luglio e agosto si mantengono nella fascia normale o leggermente bassa rispetto agli ultimi anni.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-400">
                        <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm mb-1">Settembre in rialzo</h4>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          I preventivi indicano un possibile aumento della mortalità: il mese è stimato NORMALE/ALTO rispetto alla mediana storica, che rimane però tra i mesi più bassi dell'anno.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-400">
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1">Strategia operativa</h4>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          Questo trend suggerisce di ottimizzare il personale e la disponibilità di mezzi in vista di un autunno potenzialmente più impegnativo.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Seasonality Chart Section */}
            <SeasonalityChart />

            {/* Funeral Requests and Trend Evolution Charts Section */}
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <TrendEvolutionChart />
              </div>
              <div className="lg:col-span-1">
                <FuneralRequestsChart />
              </div>
            </div>

            {/* Deaths Variation Chart Section */}
            <DeathsVariationChart />

            {/* Province Chart Section */}
            <div id="province-section">
              <ProvinceChart />
            </div>

            {/* Recent Requests Section - nascosto temporaneamente */}
            <Card className="modern-card hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Richieste Recenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentRequests />
              </CardContent>
            </Card>
            
            {/* Nota Metodologica */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Nota Metodologica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Il grafico <strong>Termometro mortalità – Italia</strong> è basato su dati ufficiali ISTAT sui decessi mensili dal 2019 e sui volumi di preventivi rilevati da Lastello.it, utilizzati come indicatore anticipatore. Le proiezioni per i mesi non ancora pubblicati sono ottenute con un modello statistico che combina l'andamento storico e la stagionalità con le tendenze più recenti dei preventivi, per stimare se la mortalità corrente si colloca in fascia bassa, normale o alta.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6 animate-fade-in">
            <MarketMetrics />
            <RegionalComparison />
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6 animate-fade-in">
            <MarketingInsights />
          </TabsContent>
        </Tabs>
        
        {/* Feedback System */}
        <FeedbackSystem />
      </div>
    </div>
  );
}
