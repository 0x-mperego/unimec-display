# Project Requirements Document (PRD)
## Digital Signage Web App

### 📋 Executive Summary
Una webapp semplice e intuitiva per gestire contenuti su monitor/display digitali. Un amministratore può caricare immagini o creare messaggi testuali personalizzati che vengono mostrati in sequenza sui monitor collegati.

---

## 🎯 Obiettivi del Progetto

### Obiettivo Primario
Creare una webapp di digital signage che bilanci **semplicità d'uso** con **funzionalità utili**:
1. Interfaccia immediata che non intimorisce
2. Personalizzazioni disponibili ma non invasive
3. Sicurezza base con login semplice
4. Risultati immediati sui monitor

### Principi Guida
- **Progressive Disclosure**: Funzioni avanzate nascoste ma accessibili
- **Default intelligenti**: Preset pronti all'uso
- **Feedback immediato**: Ogni azione mostra subito il risultato
- **Mobile-first**: Ottimizzato per smartphone ma funzionale su desktop
- **Sicurezza semplice**: Login con password, niente di complesso

---

## 👤 User Personas

### Persona Primaria: Il Gestore
- **Chi è**: Proprietario/manager di negozio, ufficio, palestra, ristorante
- **Competenze tech**: Base (usa app comuni quotidianamente)
- **Tempo disponibile**: 5-10 minuti per setup, 2 minuti per aggiornamenti
- **Device**: Principalmente smartphone, occasionalmente PC
- **Obiettivo**: Comunicare efficacemente con clienti tramite display

---

## 🔄 User Flow Ottimizzato

### Flow Principale
```
1. LOGIN → Password semplice (salvata per 30 giorni)
2. DASHBOARD → Vista immediata contenuti attivi
3. AGGIUNGI → Scelta tipo (Immagine/Testo)
4. PERSONALIZZA → Opzionale per testi
5. PUBBLICA → Automatico, immediato sui monitor
```

### Dettaglio Azioni

#### A. Aggiungere Immagine
1. Click su "+" o "Aggiungi"
2. Seleziona "Immagine"
3. Upload file (JPG/PNG, max 10MB)
4. Imposta durata (default 10 sec)
5. ✅ Live sui monitor

#### B. Aggiungere Testo con Stile
1. Click su "+" o "Aggiungi"
2. Seleziona "Messaggio"
3. Scrivi testo
4. Scegli preset (Elegante/Vivace/Minimal)
5. (Opzionale) Click "Personalizza" per:
   - Font family
   - Dimensione testo
   - Colore testo
   - Sfondo (colore/gradient)
   - Posizione
6. Imposta durata (default 15 sec)
7. ✅ Live sui monitor

#### C. Gestione Contenuti
- **Elimina**: Click su icona cestino
- **Modifica durata**: Click su tempo, usa slider
- **Riordina**: Frecce su/giù
- **Duplica**: Per riusare contenuti simili

---

## 🚀 Funzionalità Core (MVP)

### 1. Dashboard Principale
- **Lista contenuti attivi** con preview chiare
- **Bottone aggiungi** sempre visibile ("+" o "Aggiungi Contenuto")
- **Gestione inline** per ogni contenuto:
  - Elimina (icona cestino)
  - Modifica durata (click sul tempo)
  - Riordina (frecce su/giù)
  - Duplica (per contenuti simili)
- **URL display** copiabile in header

### 2. Upload Immagini
- **Input file standard** (no camera)
- **Formati supportati**: JPG, PNG (max 10MB)
- **Preview immediata** dopo upload
- **Auto-ottimizzazione** per display
- **Durata personalizzabile** (slider 5-60 sec, default 10)

### 3. Editor Messaggi
- **Campo testo** con preview live
- **3 preset pronti** (stili predefiniti diversi)
- **Personalizzazioni complete** (nascoste di default):
  - Font family (Google Fonts)
  - Dimensione testo (slider 12-120px)
  - Colore testo (palette del tema)
  - Sfondo (colori tema o gradients)
  - Posizione (center, top, bottom, left, right)
- **Durata personalizzabile** (slider 5-60 sec, default 15)

### 4. Display Pubblico (/display)
- **URL singolo** per tutti i monitor
- **Fullscreen automatico** dopo primo click
- **Rotazione contenuti** con transizione fade
- **Durate personalizzate** per contenuto
- **Auto-reconnect** se perde connessione
- **Nessun controllo utente** (solo visualizzazione)

### 5. Autenticazione Semplice
- **Login con password** (una sola, da environment)
- **Session cookie** (30 giorni persistenza)
- **Auto-redirect** a login se non autenticato
- **Logout** disponibile ma non prominente

---

## ❌ Cosa NON Includiamo

- ~~Multi-utente/ruoli~~
- ~~Scheduling/programmazione oraria~~
- ~~Video support~~
- ~~Analytics/statistiche~~
- ~~Notifiche push~~
- ~~Backup/export dati~~
- ~~API pubbliche~~
- ~~Widget esterni (meteo/news)~~
- ~~Camera per upload~~
- ~~Keyboard shortcuts~~
- ~~Magic link authentication~~
- ~~Drag & drop per riordino (solo frecce)~~

---

## 📱 Responsive Design

### Mobile First Approach
- Layout verticale con componenti shadcn responsive
- Navigation adattata (Sheet su mobile, Dialog su desktop)
- Touch targets appropriati

### Desktop Enhancement  
- Layout multi-column dove appropriato
- Più spazio per preview e controlli
- Utilizzo completo dei componenti shadcn desktop

---

## 🔐 Sicurezza

### Autenticazione
- **Password fissa** (in environment variables)
- **Session cookie** sicuro (httpOnly, 30 giorni)
- **Rate limiting** su tentativi login
- **HTTPS required** in produzione

### Privacy
- **No tracking** utenti
- **No dati personali** salvati
- **Upload locale** (no cloud esterni)

---

## 🎨 Design Principles

### Visual Design
- **Clean & Modern**: Layout pulito con card e spacing generoso
- **Component-based**: Utilizzo esclusivo di componenti shadcn/ui standard
- **Theme-agnostic**: Nessun colore custom, solo variabili del tema
- **Touch-friendly**: Target minimi 44x44px per mobile

### User Experience
- **Progressive Disclosure**: Complessità nascosta in accordion/collapsible
- **Immediate Feedback**: Toast e skeleton loader per feedback
- **Error Prevention**: AlertDialog per conferme azioni distruttive  
- **Smart Defaults**: Valori pre-impostati intelligenti

---

## 💾 Data Management

### Database Schema
```sql
-- Singola tabella per contenuti
CREATE TABLE contents (
  id UUID PRIMARY KEY,
  type VARCHAR(10), -- 'image' o 'text'
  data JSONB, -- tutti i dati del contenuto
  duration INTEGER, -- secondi
  order_index INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Storage
- **Immagini**: Supabase Storage con auto-cleanup dopo 30 giorni di non utilizzo
- **Limite**: 50 contenuti attivi max
- **Auto-cleanup**: Job schedulato rimuove immagini orfane e contenuti vecchi
- **Ottimizzazione**: Resize automatico immagini prima dell'upload

---

## 🚦 Development Roadmap

### Phase 1: Core MVP (Week 1)
- ✅ Setup progetto Next.js + Supabase
- ✅ Login con password
- ✅ Upload immagini base
- ✅ Editor testo con preset
- ✅ Display page funzionante

### Phase 2: Polish (Week 2)
- ✅ Personalizzazioni testo complete
- ✅ Durate personalizzate
- ✅ Mobile optimization
- ✅ Gestione errori user-friendly

### Phase 3: Refinement (Week 3)
- ✅ Performance optimization
- ✅ Testing cross-browser
- ✅ Deploy su Vercel
- ✅ Documentazione setup

---

## 🛠 Tech Stack Finale

### Frontend
- **Next.js 15** (App Router)
- **shadcn/ui** (TUTTI i componenti UI - usare solo componenti standard)
- **Tailwind CSS** (viene con shadcn/ui)
- **React Hook Form** (gestione form)

### Backend
- **Supabase** (Database + Storage con auto-cleanup)
- **JWT** (autenticazione custom semplice)
- **Server Actions** (Next.js)

### Display
- **SSE** per aggiornamenti real-time
- **Fullscreen API**
- **Page Visibility API** (ottimizzazione)

### Deployment
- **Vercel** (hosting)
- **GitHub** (version control)

---

## 📝 Note Implementative

### Priorità Sviluppo
1. **Funzionalità base** che funzionano perfettamente
2. **UI pulita** e intuitiva
3. **Performance** su mobile
4. **Stabilità** del display

### Best Practices
- **Mobile-first** development
- **Progressive enhancement**
- **Graceful degradation**
- **Defensive programming**

### Testing Focus
- Upload immagini di varie dimensioni
- Testi lunghi/corti
- Connessioni lente
- Display multipli simultanei

---

## 🎯 Conclusione

L'obiettivo è creare una webapp che sia:
- **Semplice da usare** senza essere limitata
- **Professionale** nell'aspetto e funzionamento
- **Affidabile** per uso quotidiano
- **Performante** su tutti i dispositivi

Il successo si misura in quanto velocemente un utente nuovo riesce a pubblicare il primo contenuto senza aiuto esterno.
