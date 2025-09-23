'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, MessageSquare, Calendar, Globe, LogOut, Star } from 'lucide-react'
import { AuthGuard } from '@/components/auth-guard'
import { logout } from '@/lib/auth'

interface Feedback {
  id: number
  timestamp: string
  date: string
  rating: number
  emoji: string
  label: string
  suggestion: string
  userAgent: string
  url: string
}

function FeedbackContent() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedFeedbacks = localStorage.getItem('dashboard-feedback')
      if (storedFeedbacks) {
        setFeedbacks(JSON.parse(storedFeedbacks))
      }
    } catch (error) {
      console.error('Errore nel caricamento dei feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const downloadCSV = () => {
    const csvContent = [
      ['Rating', 'Emoji', 'Label', 'Suggerimento', 'Data', 'URL', 'User Agent'].join(','),
      ...feedbacks.map(feedback => [
        feedback.rating,
        feedback.emoji,
        feedback.label,
        `"${feedback.suggestion.replace(/"/g, '""')}"`,
        feedback.date,
        feedback.url,
        `"${feedback.userAgent}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `feedback-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearAll = () => {
    if (confirm('Sei sicuro di voler cancellare tutti i feedback? Questa azione non può essere annullata.')) {
      localStorage.removeItem('dashboard-feedback')
      setFeedbacks([])
    }
  }

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0)
    return (sum / feedbacks.length).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestione Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Visualizza e gestisci i feedback degli utenti sulla dashboard
          </p>
        </div>
        <Button
          onClick={() => {
            logout()
            window.location.reload()
          }}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
            <p className="text-xs text-muted-foreground">
              Feedback ricevuti
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Medio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageRating()}</div>
            <p className="text-xs text-muted-foreground">
              Su 5 stelle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ultimo Mese</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter(feedback => {
                const feedbackDate = new Date(feedback.timestamp)
                const lastMonth = new Date()
                lastMonth.setMonth(lastMonth.getMonth() - 1)
                return feedbackDate >= lastMonth
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nuovi feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Suggerimenti</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter(feedback => feedback.suggestion.trim().length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con testo aggiuntivo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Azioni */}
      <div className="flex gap-4 mb-6">
        <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Esporta CSV
        </Button>
        <Button onClick={clearAll} variant="destructive" disabled={feedbacks.length === 0}>
          Cancella Tutto
        </Button>
      </div>

      {/* Tabella feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Utenti</CardTitle>
        </CardHeader>
        <CardContent>
          {feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nessun feedback trovato</p>
              <p className="text-sm text-gray-400">I feedback degli utenti appariranno qui</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rating</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Suggerimento</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Browser</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{feedback.emoji}</span>
                          <span className="text-sm font-medium">{feedback.label}</span>
                          <span className="text-xs text-gray-500">({feedback.rating}/5)</span>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.date}</TableCell>
                      <TableCell className="max-w-xs">
                        {feedback.suggestion ? (
                          <p className="truncate" title={feedback.suggestion}>
                            {feedback.suggestion}
                          </p>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={feedback.url}>
                        {feedback.url}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={feedback.userAgent}>
                        {feedback.userAgent.split(' ')[0]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informazioni */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Informazioni</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>• I feedback vengono salvati localmente nel browser</p>
          <p>• I dati includono rating, suggerimenti e informazioni tecniche</p>
          <p>• Puoi esportare tutti i dati in formato CSV</p>
          <p>• I feedback sono anonimi e non contengono informazioni personali</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <AuthGuard>
      <FeedbackContent />
    </AuthGuard>
  )
}
