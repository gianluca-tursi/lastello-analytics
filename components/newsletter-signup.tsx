'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Mail, Bell, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react'

export function NewsletterSignup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Mostra il popup quando l'utente scrolla oltre la metà della pagina
  useEffect(() => {
    const hasBeenDismissed = localStorage.getItem('newsletter-dismissed')
    console.log('Newsletter: hasBeenDismissed =', hasBeenDismissed)
    
    if (!hasBeenDismissed) {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const scrollPercent = (scrollTop + windowHeight) / documentHeight
        
        console.log('Newsletter: Scroll percent =', Math.round(scrollPercent * 100) + '%')
        
        if (scrollPercent > 0.5 && !isVisible) {
          console.log('Newsletter: User scrolled past 50%, showing popup')
          setIsVisible(true)
          // Rimuovi il listener dopo aver mostrato il popup
          window.removeEventListener('scroll', handleScroll)
        }
      }

      // Aggiungi il listener per lo scroll
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      // Verifica subito se è già oltre la metà (per casi in cui la pagina è già scrollata)
      handleScroll()
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    } else {
      console.log('Newsletter: Popup was dismissed, not showing')
    }
  }, [isVisible])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      alert('Inserisci un indirizzo email valido')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepara i dati per il salvataggio
      const subscriptionData = {
        email: email.trim().toLowerCase(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        source: 'newsletter_popup'
      }

      // Controlla se l'email esiste già nel localStorage
      const existingSubscriptions = JSON.parse(
        localStorage.getItem('dashboard-newsletter') || '[]'
      )
      
      const emailExists = existingSubscriptions.some(
        (sub: any) => sub.email === subscriptionData.email
      )
      
      if (emailExists) {
        alert('Questo indirizzo email è già iscritto agli aggiornamenti')
        setIsSubmitting(false)
        return
      }

      // Salva nel localStorage (backup locale)
      const localStorageSubscription = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('it-IT'),
        ...subscriptionData
      }

      existingSubscriptions.push(localStorageSubscription)
      localStorage.setItem('dashboard-newsletter', JSON.stringify(existingSubscriptions))

      // Salva sul server
      try {
        const response = await fetch('/api/save-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'newsletter',
            data: subscriptionData
          }),
        })

        if (!response.ok) {
          throw new Error('Errore nel salvataggio sul server')
        }

        console.log('Iscrizione newsletter salvata sul server')
      } catch (serverError) {
        console.warn('Errore salvataggio server, ma localStorage funziona:', serverError)
      }

      setIsSubmitted(true)
      
      // Chiudi il popup dopo 3 secondi
      setTimeout(() => {
        setIsVisible(false)
        setIsSubmitted(false)
        setEmail('')
      }, 3000)

    } catch (error) {
      console.error('Errore salvataggio iscrizione:', error)
      alert('Errore nel salvataggio dell\'iscrizione. Riprova più tardi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    console.log('Newsletter: Popup minimized')
  }

  const handleMaximize = () => {
    setIsMinimized(false)
    console.log('Newsletter: Popup maximized')
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Salva che è stato chiuso definitivamente per non mostrarlo più
    localStorage.setItem('newsletter-dismissed', 'true')
    console.log('Newsletter: Popup dismissed permanently')
  }


  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-80 max-w-[calc(100vw-3rem)] animate-slide-in">
      <Card className="shadow-2xl border-2 border-blue-200 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Aggiornamenti Mensili
            </CardTitle>
            <div className="flex gap-1">
              {isMinimized ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMaximize}
                  className="h-8 w-8 p-0"
                  title="Espandi"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className="h-8 w-8 p-0"
                  title="Minimizza"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
                title="Chiudi definitivamente"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent>
            {!isSubmitted ? (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Ricevi ogni mese gli ultimi dati e insights del settore funebre direttamente nella tua casella di posta.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="La tua email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Iscriviti'
                      )}
                    </Button>
                  </div>
                </form>

              </>
            ) : (
              <div className="text-center py-2">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Iscritto con successo!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Riceverai il primo aggiornamento il prossimo mese
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
