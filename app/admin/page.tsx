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
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          ultimoAggiornamento: new Date().toLocaleString('it-IT')
        }),
      })

      if (response.ok) {
        setMessage('Configurazione salvata con successo!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Errore nel salvataggio')
      }
    } catch (error) {
      console.error('Errore salvataggio:', error)
      setMessage('Errore nel salvataggio della configurazione')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    window.location.href = '/admin'
  }

  const getCurrentMonth = () => {
    const months = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ]
    return months[new Date().getMonth()]
  }

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
    const P_giu = 49294; // Preventivi giugno 2025 (dato reale)
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
                          value={config.preventiviMeseCorrente}
                          onChange={(e) => setConfig(prev => ({ 
                            ...prev, 
                            preventiviMeseCorrente: parseInt(e.target.value) || 0 
                          }))}
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
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              ↗
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Ultimo aggiornamento: {config.ultimoAggiornamento}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
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
