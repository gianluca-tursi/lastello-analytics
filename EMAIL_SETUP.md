# Sistema di Feedback - Salvataggio in File

## 🚀 Sistema Semplificato

Il sistema ora salva i feedback in un file JSON locale! Molto più semplice e pratico.

### 1. Come Funziona

- I feedback vengono salvati in `data/feedback.json`
- Ogni feedback ha un ID univoco e timestamp
- Include rating, suggerimento, IP e browser info
- File JSON facilmente leggibile

### 2. Visualizza i Feedback

**Opzione 1 - Pagina Web:**
1. Vai su `http://localhost:3000/feedback`
2. Vedi tutti i feedback in formato leggibile
3. Scarica il file JSON

**Opzione 2 - File Diretto:**
1. Apri `data/feedback.json` nel progetto
2. Leggi direttamente il file JSON

### 3. Testa il Sistema

1. Avvia il server: `npm run dev`
2. Vai su `http://localhost:3000`
3. Clicca sul pulsante di feedback
4. Invia un test
5. Vai su `http://localhost:3000/feedback` per vedere il risultato

## 🔧 Funzionalità

- ✅ **Salvataggio automatico** in file JSON
- ✅ **Pagina di visualizzazione** dedicata
- ✅ **Download del file** JSON
- ✅ **Gestione errori** completa
- ✅ **Feedback visivo** all'utente
- ✅ **Nessuna configurazione** richiesta

## 📄 Formato Dati

Ogni feedback include:
- **ID univoco** e timestamp
- **Valutazione** con emoji e label
- **Suggerimento** dell'utente
- **IP e User Agent** per debugging
- **Data formattata** in italiano

## 📁 Struttura File

```
data/
└── feedback.json
```

## 🛠️ Troubleshooting

### File non creato
- Verifica che la directory `data/` sia scrivibile
- Controlla i permessi del progetto

### Pagina feedback non carica
- Verifica che il server sia in esecuzione
- Controlla la console per errori

### Feedback non salvati
- Controlla i log del server
- Verifica che l'API `/api/send-feedback` funzioni
