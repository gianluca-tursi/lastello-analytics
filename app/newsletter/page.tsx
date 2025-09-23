'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, Mail, Calendar, Globe, LogOut } from 'lucide-react'
import { AuthGuard } from '@/components/auth-guard'
import { logout } from '@/lib/auth'

interface Subscription {
  id: number
  timestamp: string
  date: string
  email: string
  userAgent: string
  url: string
  source: string
}

function NewsletterContent() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedSubscriptions = localStorage.getItem('dashboard-newsletter')
      if (storedSubscriptions) {
        setSubscriptions(JSON.parse(storedSubscriptions))
      }
    } catch (error) {
      console.error('Errore nel caricamento delle iscrizioni:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const downloadCSV = () => {
    const csvContent = [
      ['Email', 'Data Iscrizione', 'Sorgente', 'URL', 'User Agent'].join(','),
      ...subscriptions.map(sub => [
        sub.email,
        sub.date,
        sub.source,
        sub.url,
        `"${sub.userAgent}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearAll = () => {
    if (confirm('Sei sicuro di voler cancellare tutte le iscrizioni? Questa azione non può essere annullata.')) {
      localStorage.removeItem('dashboard-newsletter')
      setSubscriptions([])
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento iscrizioni...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestione Newsletter
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Visualizza e gestisci le iscrizioni alla newsletter degli aggiornamenti mensili
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Iscritti</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Iscrizioni attive
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
              {subscriptions.filter(sub => {
                const subDate = new Date(sub.timestamp)
                const lastMonth = new Date()
                lastMonth.setMonth(lastMonth.getMonth() - 1)
                return subDate >= lastMonth
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nuove iscrizioni
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sorgente Principale</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.length > 0 ? 'Popup' : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Popup newsletter
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
        <Button onClick={clearAll} variant="destructive" disabled={subscriptions.length === 0}>
          Cancella Tutto
        </Button>
      </div>

      {/* Tabella iscrizioni */}
      <Card>
        <CardHeader>
          <CardTitle>Iscrizioni Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nessuna iscrizione trovata</p>
              <p className="text-sm text-gray-400">Le iscrizioni appariranno qui quando gli utenti si registreranno</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Data Iscrizione</TableHead>
                    <TableHead>Sorgente</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Browser</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.email}</TableCell>
                      <TableCell>{subscription.date}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {subscription.source}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={subscription.url}>
                        {subscription.url}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={subscription.userAgent}>
                        {subscription.userAgent.split(' ')[0]}
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
          <p>• Le iscrizioni vengono salvate localmente nel browser</p>
          <p>• I dati includono email, data di iscrizione e informazioni tecniche</p>
          <p>• Puoi esportare tutti i dati in formato CSV</p>
          <p>• Per inviare email, copia gli indirizzi dal file CSV in un servizio email</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NewsletterPage() {
  return (
    <AuthGuard>
      <NewsletterContent />
    </AuthGuard>
  )
}
