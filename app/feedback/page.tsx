'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Eye } from 'lucide-react';

interface Feedback {
  id: string;
  timestamp: string;
  date: string;
  rating: number;
  emoji: string;
  label: string;
  suggestion: string;
  userAgent: string;
  ip: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/read-feedback');
      const data = await response.json();
      
      if (data.success) {
        setFeedback(data.feedback.reverse()); // Mostra i più recenti prima
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Errore nel caricamento dei feedback');
    } finally {
      setLoading(false);
    }
  };

  const downloadFeedback = () => {
    const dataStr = JSON.stringify(feedback, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Caricamento feedback...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {feedback.length} feedback ricevuti
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchFeedback} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
          <Button onClick={downloadFeedback} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Scarica JSON
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {feedback.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nessun feedback ricevuto ancora</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <CardTitle className="text-lg">
                        {item.label} ({item.rating}/5)
                      </CardTitle>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">ID: {item.id}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Suggerimento:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                      {item.suggestion}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <strong>IP:</strong> {item.ip}
                    </div>
                    <div>
                      <strong>Browser:</strong> {item.userAgent.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
