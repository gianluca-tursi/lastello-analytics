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
import { NewsletterSignup } from '@/components/newsletter-signup';
import { useConfig } from '@/hooks/use-config';
import { TrendingUp, Users, Euro, Building2, Activity, BarChart3, Globe, Sparkles, X } from 'lucide-react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [trendType, setTrendType] = useState<'Crescente' | 'Moderato' | 'Decrescente'>('Crescente');
  const { config, isLoading: configLoading } = useConfig();

  // Funzione per calcolare la classificazione basata sui preventivi (metodologia avanzata)
  const getClassification = (preventivi: number) => {
    const currentMonth = new Date().getMonth();
    
    // Baseline storica 2019-2024 (P25, P50, P75)
    const baseline = {
      P25: [66127, 56743, 57279, 52329, 50882, 48190, 52142, 52297, 48420, 51839, 54337, 60910],
      P50: [66896, 59077, 60269, 55092, 51812, 50114, 53702, 54847, 49830, 54288, 54786, 65468],
      P75: [72424, 59996, 66866, 61857, 54211, 51985, 54477, 56433, 50974, 54839, 56353, 67361]
    };

    // Calibra baseline 2025 (usando giugno come riferimento)
    const giugno2025 = 49294; // Dato reale giugno 2025
    const giugnoBaseline = baseline.P50[5]; // Giugno baseline
    const scale = giugno2025 / giugnoBaseline;
    
    const baseline2025 = baseline.P50.map(p50 => p50 * scale);
    
    // Normalizza preventivi parziali (se siamo a metà mese)
    const giorniTrascorsi = new Date().getDate();
    const giorniTotali = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
    const preventiviNormalizzati = (preventivi / giorniTrascorsi) * giorniTotali;
    
    // Elasticità e shrinkage
    const P_giu = 246; // Preventivi giugno 2025 (dato reale)
    const ratio = preventiviNormalizzati / P_giu;
    const e = 0.8; // Elasticità
    const N0 = 1000; // Shrinkage parameter
    
    // Stima finale
    const D_raw = baseline2025[currentMonth] * Math.pow(ratio, e);
    const w = preventiviNormalizzati / (preventiviNormalizzati + N0);
    const stima = w * D_raw + (1 - w) * baseline2025[currentMonth];
    
    // Classificazione a 5 livelli basata su quantili
    const P10 = baseline.P25[currentMonth] * 0.8; // Approssimazione P10
    const P25 = baseline.P25[currentMonth];
    const P50 = baseline.P50[currentMonth];
    const P75 = baseline.P75[currentMonth];
    const P90 = baseline.P75[currentMonth] * 1.2; // Approssimazione P90
    
    if (stima < P10) return 'Basso';
    if (stima < P25) return 'Medio Basso';
    if (stima < P75) return 'Normale';
    if (stima < P90) return 'Medio Alto';
    return 'Alto';
  };
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
      
      // Check if user has previously dismissed the tip
      const hasDismissedTip = localStorage.getItem('viewport-tip-dismissed');
      
      if (isMobileDevice && !hasDismissedTip) {
        setShowViewportTip(true);
      }
    };
    
    checkMobile();
    
    // Check orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        if (isMobile && window.innerWidth > window.innerHeight) {
          // Landscape mode on mobile - hide tip
          setShowViewportTip(false);
        }
      }, 100); // Small delay to ensure orientation change is complete
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
              onClick={() => {
                setShowViewportTip(false);
                localStorage.setItem('viewport-tip-dismissed', 'true');
              }}
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
            <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md hidden">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            {/* Bottone scroll a sezione province */}
            <button type="button" onClick={handleGoToProvinces} className="rounded-full px-3 py-2 text-sm font-medium hover:bg-white/70 bg-white text-blue-600 shadow-md inline-flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Dati Provinciali
            </button>
            <a 
              href="https://lastello.it/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="rounded-full px-3 py-2 text-sm font-medium hover:bg-white/70 bg-white text-blue-600 shadow-md inline-flex items-center transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Lastello
            </a>
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
                    Trend Richieste {config.meseCorrente}
                  </CardTitle>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    {configLoading ? '...' : getClassification(config.preventiviMeseCorrente)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      ↗
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Al 18 ottobre 2024 - Trend in crescita rispetto ai mesi precedenti
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

              <Card className="modern-card hover-lift group animation-delay-400">
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

              {/* Alessandro WhatsApp Card - ultima posizione */}
              <Card className="modern-card hover-lift group animation-delay-600 cursor-pointer" 
                    onClick={() => window.open('https://api.whatsapp.com/send?phone=393517610950&text=salve-alessandro&source=&data=', '_blank')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Vuoi informazioni su Lastello.it?
                  </CardTitle>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        Alessandro
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Supporto Clienti
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span className="text-xs font-medium">Scrivi su WhatsApp</span>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-12">
              <Card className="col-span-12 lg:col-span-8 modern-card glow">
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
              
              <div className="col-span-12 lg:col-span-4 space-y-6">
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
                        <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm mb-1">{config.meseCorrente} {getClassification(config.preventiviMeseCorrente)}</h4>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          I preventivi indicano un tasso di mortalità in linea con il periodo storico: il mese è stimato NORMALE rispetto alla mediana storica, mese in rialzo verso i picchi di novembre e dicembre.
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
        
        {/* Newsletter System */}
        <NewsletterSignup />
      </div>
    </div>
  );
}
