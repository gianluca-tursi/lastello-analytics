'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Calendar,
  Save,
  LogOut
} from 'lucide-react'
import { AuthGuard } from '@/components/auth-guard'

interface ConfigData {
  preventiviMeseCorrente: number
  meseCorrente: string
  ultimoAggiornamento: string
}

interface NewsletterData {
  id: string
  email: string
  timestamp: string
  date: string
}

interface FeedbackData {
  id: string
  rating: number
  emoji: string
  label: string
  suggestion: string
  timestamp: string
  date: string
  userAgent: string
  url: string
}

export default function AdminPage() {
  const [config, setConfig] = useState<ConfigData>({
    preventiviMeseCorrente: 176,
    meseCorrente: 'Ottobre',
    ultimoAggiornamento: new Date().toLocaleString('it-IT')
  })
  
  const [newsletterData, setNewsletterData] = useState<NewsletterData[]>([])
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Carica dati iniziali
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Carica configurazione
      const configResponse = await fetch('/api/admin/config')
      if (configResponse.ok) {
        const configData = await configResponse.json()
        setConfig(configData)
      }

      // Carica newsletter
      const newsletterResponse = await fetch('/api/data/newsletter')
      if (newsletterResponse.ok) {
        const newsletter = await newsletterResponse.json()
        setNewsletterData(newsletter)
      }

      // Carica feedback
      const feedbackResponse = await fetch('/api/data/feedback')
      if (feedbackResponse.ok) {
        const feedback = await feedbackResponse.json()
        setFeedbackData(feedback)
      }
    } catch (error) {
      console.error('Errore caricamento dati:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfig = async () => {
    setIsLoading(true)
    try {
      const configToSave = {
        ...config,
        ultimoAggiornamento: new Date().toLocaleString('it-IT')
      }
      
      console.log('Config da salvare:', configToSave)
      
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configToSave),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (response.ok) {
        // Salva anche in localStorage come backup
        localStorage.setItem('lastello-config', JSON.stringify(configToSave))
        
        // Notifica il cambiamento per aggiornare altri componenti
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'lastello-config',
          newValue: JSON.stringify(configToSave),
          oldValue: localStorage.getItem('lastello-config')
        }))
        
        setMessage('Configurazione salvata con successo!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error(responseData.error || 'Errore nel salvataggio')
      }
    } catch (error) {
      console.error('Errore salvataggio:', error)
      setMessage(`Errore nel salvataggio della configurazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    window.location.href = '/'
  }

  const getCurrentMonth = () => {
    const months = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ]
    return months[new Date().getMonth()]
  }

  // Funzione per calcolare la stima completa (stessa logica semplificata)
  const getStimaCompleta = (preventivi: number) => {
    const currentMonth = new Date().getMonth(); // Ottobre = 9
    
    // Baseline storica 2019-2024 per ottobre (P25, P50, P75)
    const baselineOttobre = {
      P25: 51839,
      P50: 54288, 
      P75: 54839
    };

    // Calibra baseline 2025 (usando giugno come riferimento)
    const giugno2025 = 49294; // Dato reale giugno 2025
    const giugnoBaseline = 50114; // Giugno baseline P50
    const scale = giugno2025 / giugnoBaseline;
    
    const baseline2025Ottobre = baselineOttobre.P50 * scale;
    
    // Normalizza preventivi parziali (se siamo a metà mese)
    const giorniTrascorsi = new Date().getDate(); // 18 ottobre
    const giorniTotali = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate(); // 31 giorni
    const preventiviNormalizzati = (preventivi / giorniTrascorsi) * giorniTotali;
    
    // Metodologia semplificata: rapporto diretto con baseline
    const rapporto = preventiviNormalizzati / 246; // 246 = preventivi giugno 2025
    const stima = baseline2025Ottobre * rapporto;
    
    return Math.round(stima);
  };

  // Funzione per calcolare la classificazione basata sui preventivi (metodologia semplificata e stabile)
  const getClassification = (preventivi: number) => {
    const currentMonth = new Date().getMonth(); // Ottobre = 9
    
    // Baseline storica 2019-2024 per ottobre (P25, P50, P75)
    const baselineOttobre = {
      P25: 51839,
      P50: 54288, 
      P75: 54839
    };

    // Calibra baseline 2025 (usando giugno come riferimento)
    const giugno2025 = 49294; // Dato reale giugno 2025
    const giugnoBaseline = 50114; // Giugno baseline P50
    const scale = giugno2025 / giugnoBaseline;
    
    const baseline2025Ottobre = baselineOttobre.P50 * scale;
    
    // Normalizza preventivi parziali (se siamo a metà mese)
    const giorniTrascorsi = new Date().getDate(); // 18 ottobre
    const giorniTotali = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate(); // 31 giorni
    const preventiviNormalizzati = (preventivi / giorniTrascorsi) * giorniTotali;
    
    // Metodologia semplificata: rapporto diretto con baseline
    const rapporto = preventiviNormalizzati / 246; // 246 = preventivi giugno 2025
    const stima = baseline2025Ottobre * rapporto;
    
    // Classificazione basata su percentili della baseline storica
    const P10 = baselineOttobre.P25 * 0.8; // ~41,471
    const P25 = baselineOttobre.P25; // 51,839
    const P50 = baselineOttobre.P50; // 54,288
    const P75 = baselineOttobre.P75; // 54,839
    const P90 = baselineOttobre.P75 * 1.2; // ~65,807
    
    if (stima < P10) return 'Basso';
    if (stima < P25) return 'Medio Basso';
    if (stima < P75) return 'Normale';
    if (stima < P90) return 'Medio Alto';
    return 'Alto';
  };

  const updateCurrentMonth = () => {
    setConfig(prev => ({
      ...prev,
      meseCorrente: getCurrentMonth()
    }))
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Pannello Amministrativo
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gestisci configurazioni, newsletter e feedback
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="config" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurazione
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Newsletter ({newsletterData.length})
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Feedback ({feedbackData.length})
              </TabsTrigger>
            </TabsList>

            {/* Configurazione */}
            <TabsContent value="config" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Configurazione Dashboard
                  </CardTitle>
                  <CardDescription>
                    Aggiorna i dati delle card e del termometro mortalità
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {message && (
                    <div className={`p-3 rounded-lg ${
                      message.includes('successo') 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {message}
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Card Trend Richieste */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Card Trend Richieste
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="meseCorrente">Mese Corrente</Label>
                        <div className="flex gap-2">
                          <Input
                            id="meseCorrente"
                            value={config.meseCorrente}
                            onChange={(e) => setConfig(prev => ({ ...prev, meseCorrente: e.target.value }))}
                            placeholder="es. Ottobre"
                          />
                          <Button onClick={updateCurrentMonth} variant="outline" size="sm">
                            Auto
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Il mese si aggiorna automaticamente ogni mese
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preventivi">Preventivi del Mese (ad oggi)</Label>
                        <Input
                          id="preventivi"
                          type="number"
                          value={config.preventiviMeseCorrente || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setConfig(prev => ({ 
                              ...prev, 
                              preventiviMeseCorrente: value === '' ? 0 : parseInt(value) || 0 
                            }));
                          }}
                          placeholder="es. 176"
                        />
                        <p className="text-xs text-gray-500">
                          Questo valore aggiorna automaticamente la card e il termometro mortalità
                        </p>
                      </div>
                    </div>

                    {/* Anteprima */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Anteprima Card</h3>
                      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Trend Richieste {config.meseCorrente}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            {getClassification(config.preventiviMeseCorrente)}
                          </div>
                          <div className="mt-2 space-y-1">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">{getStimaCompleta(config.preventiviMeseCorrente).toLocaleString()}</span> decessi stimati
                            </div>
                            <div className="text-xs text-gray-500">
                              Da {config.preventiviMeseCorrente} preventivi (metodologia avanzata)
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                ↗
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Ultimo aggiornamento: {config.ultimoAggiornamento}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Tabella Debug Formula */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Debug Formula - Analisi Calcoli</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tabella per analizzare i salti nella formula. Mostra preventivi da 1 a 200 con tutti i calcoli intermedi.
                    </p>
                    
                    {/* Valori di Soglia e Preventivi Necessari */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      {(() => {
                        // Calcola i preventivi necessari per ogni soglia
                        const giorniTrascorsi = 18;
                        const giorniTotali = 31;
                        const giugno2025 = 49294;
                        const giugnoBaseline = 50114;
                        const scale = giugno2025 / giugnoBaseline;
                        const baseline2025Ottobre = 54288 * scale;
                        
                        const soglie = [
                          { nome: 'P10 (Basso)', valore: 41471, colore: 'red' },
                          { nome: 'P25 (Medio Basso)', valore: 51839, colore: 'orange' },
                          { nome: 'P50 (Normale)', valore: 54288, colore: 'yellow' },
                          { nome: 'P75 (Medio Alto)', valore: 54839, colore: 'blue' },
                          { nome: 'P90 (Alto)', valore: 65807, colore: 'green' }
                        ];
                        
                        return soglie.map((soglia) => {
                          // Calcola preventivi necessari: stima = baseline * rapporto
                          // rapporto = preventiviNormalizzati / 246
                          // preventiviNormalizzati = (preventivi / 18) * 31
                          const rapporto = soglia.valore / baseline2025Ottobre;
                          const preventiviNormalizzati = rapporto * 246;
                          const preventiviNecessari = Math.round((preventiviNormalizzati * giorniTrascorsi) / giorniTotali);
                          
                          return (
                            <div key={soglia.nome} className={`p-3 bg-${soglia.colore}-50 dark:bg-${soglia.colore}-900/20 rounded-lg border border-${soglia.colore}-200`}>
                              <div className={`text-sm font-semibold text-${soglia.colore}-800`}>{soglia.nome}</div>
                              <div className={`text-lg font-mono text-${soglia.colore}-600`}>{soglia.valore.toLocaleString()}</div>
                              <div className={`text-xs text-${soglia.colore}-600 mt-1`}>Preventivi: {preventiviNecessari}</div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    <div className="max-h-96 overflow-auto border rounded-lg">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                          <tr>
                            <th className="px-2 py-1 text-left border-b">Preventivi</th>
                            <th className="px-2 py-1 text-left border-b">Normalizzati</th>
                            <th className="px-2 py-1 text-left border-b">Rapporto</th>
                            <th className="px-2 py-1 text-left border-b">Baseline 2025</th>
                            <th className="px-2 py-1 text-left border-b">Stima</th>
                            <th className="px-2 py-1 text-left border-b">Classificazione</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 200 }, (_, i) => i + 1).map((preventivi) => {
                            const currentMonth = 9; // Ottobre = 9
                            
                            // Baseline storica 2019-2024 per ottobre
                            const baselineOttobre = {
                              P25: 51839,
                              P50: 54288, 
                              P75: 54839
                            };

                            // Calibra baseline 2025
                            const giugno2025 = 49294;
                            const giugnoBaseline = 50114;
                            const scale = giugno2025 / giugnoBaseline;
                            const baseline2025Ottobre = baselineOttobre.P50 * scale;
                            
                            // Normalizza preventivi parziali (18 ottobre su 31 giorni)
                            const giorniTrascorsi = 18;
                            const giorniTotali = 31;
                            const preventiviNormalizzati = (preventivi / giorniTrascorsi) * giorniTotali;
                            
                            // Metodologia semplificata
                            const rapporto = preventiviNormalizzati / 246;
                            const stima = baseline2025Ottobre * rapporto;
                            
                            // Classificazione
                            const P10 = baselineOttobre.P25 * 0.8;
                            const P25 = baselineOttobre.P25;
                            const P50 = baselineOttobre.P50;
                            const P75 = baselineOttobre.P75;
                            const P90 = baselineOttobre.P75 * 1.2;
                            
                            let classificazione = '';
                            if (stima < P10) classificazione = 'Basso';
                            else if (stima < P25) classificazione = 'Medio Basso';
                            else if (stima < P75) classificazione = 'Normale';
                            else if (stima < P90) classificazione = 'Medio Alto';
                            else classificazione = 'Alto';

                            return (
                              <tr key={preventivi} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-2 py-1 border-b font-mono">{preventivi}</td>
                                <td className="px-2 py-1 border-b font-mono">{preventiviNormalizzati.toFixed(1)}</td>
                                <td className="px-2 py-1 border-b font-mono">{rapporto.toFixed(3)}</td>
                                <td className="px-2 py-1 border-b font-mono">{baseline2025Ottobre.toFixed(0)}</td>
                                <td className="px-2 py-1 border-b font-mono">{Math.round(stima).toLocaleString()}</td>
                                <td className="px-2 py-1 border-b">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    classificazione === 'Basso' ? 'bg-red-100 text-red-800' :
                                    classificazione === 'Medio Basso' ? 'bg-orange-100 text-orange-800' :
                                    classificazione === 'Normale' ? 'bg-yellow-100 text-yellow-800' :
                                    classificazione === 'Medio Alto' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {classificazione}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button onClick={saveConfig} disabled={isLoading} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isLoading ? 'Salvataggio...' : 'Salva Configurazione'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter */}
            <TabsContent value="newsletter" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Iscrizioni Newsletter ({newsletterData.length})
                  </CardTitle>
                  <CardDescription>
                    Gestisci le iscrizioni alla newsletter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Caricamento...</div>
                  ) : (
                    <div className="space-y-4">
                      {newsletterData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Nessuna iscrizione trovata
                        </div>
                      ) : (
                        newsletterData.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{item.email}</p>
                              <p className="text-sm text-gray-500">{item.date}</p>
                            </div>
                            <Badge variant="secondary">
                              {item.timestamp}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Feedback */}
            <TabsContent value="feedback" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Feedback Utenti ({feedbackData.length})
                  </CardTitle>
                  <CardDescription>
                    Visualizza i feedback degli utenti
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Caricamento...</div>
                  ) : (
                    <div className="space-y-4">
                      {feedbackData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Nessun feedback trovato
                        </div>
                      ) : (
                        feedbackData.map((item) => (
                          <div key={item.id} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="font-medium">{item.label}</span>
                                <Badge variant="outline">Voto: {item.rating}/5</Badge>
                              </div>
                              <span className="text-sm text-gray-500">{item.date}</span>
                            </div>
                            {item.suggestion && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                "{item.suggestion}"
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
