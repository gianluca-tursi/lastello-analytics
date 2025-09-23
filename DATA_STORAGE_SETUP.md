# Sistema di Salvataggio Dati - Feedback e Newsletter

## 📁 Come Funziona

Il sistema ora salva i dati in **due modalità**:

### 1. **Salvataggio Locale (localStorage)**
- **Backup immediato** nel browser dell'utente
- **Funziona offline** e anche se il server non risponde
- **Accesso rapido** per l'utente

### 2. **Salvataggio Server (File JSON)**
- **Persistente** sul server del sito
- **Accessibile da qualsiasi dispositivo**
- **Recuperabile sempre**, anche se cambi browser

## 🗂️ Struttura File

```
/data/
├── feedback.json    # Tutti i feedback ricevuti
└── newsletter.json  # Tutte le iscrizioni newsletter
```

## 📊 Formato Dati

### Feedback (`feedback.json`)
```json
[
  {
    "id": 1703123456789,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "date": "01/01/2024",
    "rating": 5,
    "emoji": "🤩",
    "label": "Eccellente",
    "suggestion": "Ottimo lavoro!",
    "userAgent": "Mozilla/5.0...",
    "url": "https://lastello.it/"
  }
]
```

### Newsletter (`newsletter.json`)
```json
[
  {
    "id": 1703123456789,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "date": "01/01/2024",
    "email": "utente@email.com",
    "userAgent": "Mozilla/5.0...",
    "url": "https://lastello.it/",
    "source": "newsletter_popup"
  }
]
```

## 🔧 API Endpoints

### Salva Dati
```bash
POST /api/save-data
Content-Type: application/json

{
  "type": "feedback", // o "newsletter"
  "data": {
    "rating": 5,
    "emoji": "🤩",
    // ... altri campi
  }
}
```

### Carica Dati
```bash
GET /api/save-data?type=feedback
GET /api/save-data?type=newsletter
```

## 🛡️ Sicurezza

- **Directory `/data/` esclusa da Git** (non viene committata)
- **Dati sensibili protetti** da accesso pubblico
- **Backup automatico** in localStorage come fallback

## 📱 Pagine di Gestione

### Feedback
- **URL**: `/feedback`
- **Password**: `pastello2020`
- **Funzioni**: Visualizza, esporta CSV, statistiche

### Newsletter
- **URL**: `/newsletter`
- **Password**: `pastello2020`
- **Funzioni**: Visualizza, esporta CSV, statistiche

## 🔄 Flusso di Salvataggio

1. **Utente invia feedback/newsletter**
2. **Salvataggio immediato in localStorage** (backup)
3. **Tentativo di salvataggio sul server**
4. **Se server non risponde**: localStorage funziona comunque
5. **Se server risponde**: dati salvati in file JSON

## 📈 Vantaggi

- ✅ **Dati sempre accessibili** (server + localStorage)
- ✅ **Funziona offline** (localStorage backup)
- ✅ **Recuperabile da qualsiasi dispositivo** (file server)
- ✅ **Nessuna perdita di dati** (doppio salvataggio)
- ✅ **Facile gestione** (file JSON leggibili)

## 🚀 Come Recuperare i Dati

### Metodo 1: Pagine di Gestione
1. Vai su `/feedback` o `/newsletter`
2. Inserisci password `pastello2020`
3. Visualizza ed esporta i dati

### Metodo 2: Accesso Diretto ai File
1. Accedi al server
2. Leggi i file in `/data/feedback.json` e `/data/newsletter.json`
3. I dati sono in formato JSON leggibile

### Metodo 3: API
```bash
# Carica tutti i feedback
curl https://lastello.it/api/save-data?type=feedback

# Carica tutte le newsletter
curl https://lastello.it/api/save-data?type=newsletter
```

## 🔧 Manutenzione

- **File JSON crescono nel tempo** - considera backup periodici
- **Dati sensibili** - mantieni i file protetti
- **Performance** - per grandi volumi, considera database
- **Backup** - esegui backup regolari della directory `/data/`
