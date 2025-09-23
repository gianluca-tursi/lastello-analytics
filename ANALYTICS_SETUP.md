# 📊 Setup Analytics per Lastello Analytics

## 🎯 Opzioni per il Tracking

### 1. **Google Analytics 4** (Consigliato)
- ✅ Gratuito
- ✅ Integrazione facile
- ✅ Dashboard completa
- ✅ Tracking eventi personalizzati

**Setup:**
1. Vai su [Google Analytics](https://analytics.google.com/)
2. Crea una nuova proprietà GA4
3. Copia il Measurement ID (formato: G-XXXXXXXXXX)
4. Aggiungi nel file `.env.local`:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. **Plausible Analytics** (Privacy-friendly)
- ✅ GDPR compliant
- ✅ Nessun cookie
- ✅ Dashboard semplice
- ❌ A pagamento (€9/mese)

**Setup:**
1. Registrati su [Plausible.io](https://plausible.io)
2. Aggiungi il tuo dominio
3. Aggiungi nel file `.env.local`:
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

### 3. **PostHog** (Analytics avanzate)
- ✅ Open source
- ✅ Event tracking avanzato
- ✅ Session recording
- ✅ A/B testing

**Setup:**
1. Registrati su [PostHog](https://posthog.com)
2. Ottieni la chiave API
3. Aggiungi nel file `.env.local`:
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 4. **Hotjar** (Heatmaps e sessioni)
- ✅ Heatmaps
- ✅ Session recordings
- ✅ Feedback polls
- ❌ Limitato nel piano gratuito

**Setup:**
1. Registrati su [Hotjar](https://hotjar.com)
2. Ottieni l'ID del sito
3. Aggiungi nel file `.env.local`:
```bash
NEXT_PUBLIC_HOTJAR_ID=1234567
```

## 📈 Eventi Personalizzati

### Tracking automatico già implementato:
- ✅ Page views
- ✅ Session duration
- ✅ Bounce rate
- ✅ Geographic data

### Eventi aggiuntivi che puoi tracciare:
```typescript
// Esempio: tracking click su grafico
import { event } from '@/lib/analytics'

const handleChartClick = () => {
  event({
    action: 'chart_interaction',
    category: 'engagement',
    label: 'mortality_chart',
  })
}

// Esempio: tracking feedback
const handleFeedbackSubmit = (rating: number) => {
  event({
    action: 'feedback_submitted',
    category: 'user_feedback',
    label: rating.toString(),
    value: rating,
  })
}
```

## 🚀 Setup Veloce (Google Analytics)

1. **Crea account Google Analytics:**
   - Vai su https://analytics.google.com/
   - Crea nuova proprietà
   - Seleziona "Web"

2. **Ottieni Measurement ID:**
   - Copia l'ID (G-XXXXXXXXXX)

3. **Configura environment:**
   ```bash
   # Crea file .env.local
   echo "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX" > .env.local
   ```

4. **Riavvia il server:**
   ```bash
   npm run dev
   ```

5. **Verifica funzionamento:**
   - Apri DevTools → Network
   - Visita la pagina
   - Cerca richieste a "google-analytics.com"

## 📊 Dashboard Analytics

Una volta configurato, potrai vedere:
- **Real-time**: Visitatori attuali
- **Audience**: Demografia, geolocalizzazione
- **Acquisition**: Da dove arrivano i visitatori
- **Behavior**: Pagine più visitate, tempo di permanenza
- **Events**: Interazioni con grafici e componenti

## 🔒 Privacy e GDPR

- Google Analytics rispetta GDPR con IP anonymization
- Plausible è completamente privacy-friendly
- Considera di aggiungere cookie banner se necessario

## 🛠 Troubleshooting

**Analytics non funziona:**
1. Verifica che NEXT_PUBLIC_GA_ID sia nel file .env.local
2. Riavvia il server di sviluppo
3. Controlla la console per errori
4. Verifica che il dominio sia autorizzato in GA4

**Eventi personalizzati non appaiono:**
1. Gli eventi possono richiedere 24-48h per apparire
2. Usa Real-time reports per verificare immediatamente
3. Controlla che gli eventi siano chiamati correttamente
