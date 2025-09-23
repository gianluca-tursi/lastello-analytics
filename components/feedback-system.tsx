'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, MessageSquare, Star } from 'lucide-react';

export function FeedbackSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emojis = [
    { emoji: '😞', value: 1, label: 'Molto negativo' },
    { emoji: '😐', value: 2, label: 'Negativo' },
    { emoji: '🙂', value: 3, label: 'Neutro' },
    { emoji: '😊', value: 4, label: 'Positivo' },
    { emoji: '🤩', value: 5, label: 'Eccellente' }
  ];

  const handleSubmit = () => {
    if (!rating) {
      alert('Per favore, seleziona una valutazione');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedEmoji = emojis.find(e => e.value === rating);
      
      // Salva il feedback nel localStorage
      const feedback = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('it-IT'),
        rating,
        emoji: selectedEmoji?.emoji,
        label: selectedEmoji?.label,
        suggestion: suggestion.trim(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Recupera i feedback esistenti
      const existingFeedback = JSON.parse(localStorage.getItem('dashboard-feedback') || '[]');
      existingFeedback.push(feedback);
      
      // Salva nel localStorage
      localStorage.setItem('dashboard-feedback', JSON.stringify(existingFeedback));

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
        setRating(null);
        setSuggestion('');
      }, 3000);

    } catch (error) {
      console.error('Errore salvataggio feedback:', error);
      alert('Errore nel salvataggio del feedback. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip sempre visibile */}
        {isTooltipVisible && (
          <div className="mb-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-xs animate-in slide-in-from-bottom-2 duration-300 relative">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sono utili questi dati?
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTooltipVisible(false)}
                className="h-6 w-6 p-0 ml-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {/* Freccia che punta al pulsante */}
            <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700 transform translate-y-full"></div>
          </div>
        )}
        
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
      <Card className="shadow-2xl border-2 border-blue-200 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              Feedback Dashboard
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isSubmitted ? (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Trovi utili questi dati?
                </p>
                <div className="flex justify-center gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji.value}
                      onClick={() => setRating(emoji.value)}
                      className={`text-3xl p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                        rating === emoji.value
                          ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={emoji.label}
                    >
                      {emoji.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quali ulteriori dati vorresti vedere?
                </label>
                <Textarea
                  id="suggestion"
                  placeholder="Scrivi qui i tuoi suggerimenti..."
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!rating || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Invio in corso...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Invia Feedback
                  </div>
                )}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                ci aiuterai a migliorare questi dati
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Feedback inviato con successo!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Grazie per il tuo contributo
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
