# UX/UI Specifications
## Digital Signage Web App

---

## 🎨 Component Library

**IMPORTANTE**: L'intera interfaccia deve essere costruita utilizzando esclusivamente componenti **shadcn/ui** standard, senza personalizzazioni. Utilizzare il tema di default o uno dei temi ufficiali shadcn. Non creare componenti custom quando esiste già un componente shadcn che può svolgere quella funzione.

---

## 📱 App Structure Overview

### Struttura Generale
L'applicazione si compone di tre aree principali:

1. **Area Autenticazione** (`/login`)
   - Singola pagina con form di login
   - Un campo password e checkbox "ricordami"
   - Utilizzo di componenti shadcn standard (Card, Input, Button, Checkbox)

2. **Area Gestione** (`/admin` o `/dashboard`)
   - Vista principale con lista contenuti
   - Sistema di navigazione (da decidere tra: Navigation Menu, Sidebar, o Menubar di shadcn)
   - Azioni principali sempre accessibili

3. **Area Display** (`/display`)
   - Pagina pubblica fullscreen
   - Nessuna UI, solo visualizzazione contenuti
   - Rotazione automatica con fade tra contenuti

---

## 🏗️ Layout Components

### Layout Amministrazione
Utilizzare i componenti layout di shadcn standard:
- Container per centrare il contenuto
- Card per raggruppare elementi
- Separator per dividere sezioni
- ScrollArea per liste lunghe

La struttura dovrebbe includere:
- **Header/Navigation**: Logo e navigazione principale
- **Main Content Area**: Lista contenuti o editor
- **Action Area**: Bottoni per aggiungere contenuti

### Responsive Behavior
- Mobile: Layout verticale single column
- Tablet: Inizia ad espandere elementi
- Desktop: Layout multi-column dove appropriato

---

## 📋 Main Views

### 1. Dashboard/Home
**Componenti shadcn da usare:**
- Card per ogni contenuto
- Button per azioni
- Badge per tipo contenuto e durata
- Dialog o Sheet per aggiungere nuovi contenuti
- DropdownMenu per azioni aggiuntive

**Struttura:**
- Lista/griglia di card contenuti
- Ogni card mostra: preview, tipo, durata, azioni
- Stato vuoto con istruzioni se non ci sono contenuti

### 2. Add Content Flow
**Componenti shadcn da usare:**
- Dialog o Sheet per il modal
- Tabs per separare tipo immagine/testo
- Input e Textarea per campi
- Slider per durata
- Button per conferma/annulla

**Flusso:**
- Modal/Sheet con scelta tipo contenuto
- Form specifico per tipo selezionato
- Preview area (se possibile)

### 3. Text Editor
**Componenti shadcn da usare:**
- Textarea per il testo
- Select per font family
- Slider per font size e durata
- RadioGroup o ToggleGroup per preset stili
- Collapsible o Accordion per opzioni avanzate
- ColorPicker (se disponibile) o palette predefinita

**Struttura:**
- Area preview in alto
- Form controls sotto
- Opzioni base sempre visibili
- Opzioni avanzate in sezione collassabile

### 4. Image Upload
**Componenti shadcn da usare:**
- Input type="file" stilizzato
- Progress per upload
- Slider per durata
- Card per preview

---

## 🎛️ Common Patterns

### Forms
- Usare sempre Form component di shadcn con validation
- Label sopra ogni campo
- Error messages sotto i campi
- Loading states nei bottoni

### Modals & Sheets
- Dialog per desktop
- Sheet per mobile (slide from bottom)
- Sempre con header chiaro e X per chiudere

### Feedback
- Toast per notifiche successo/errore
- Alert per messaggi importanti inline
- Skeleton durante caricamenti
- AlertDialog per conferme distruttive

### Tables & Lists
- Per lista contenuti considerare Table o semplici Card
- DataTable se serve sorting/filtering
- Pagination se più di 20 elementi

---

## 🔄 State Management

### Loading States
- Skeleton loader di shadcn durante caricamenti
- Disabled state su bottoni durante operazioni
- Progress bar per upload

### Error Handling
- Toast per errori temporanei
- Alert inline per errori form
- AlertDialog per errori critici

### Empty States
- Messaggio chiaro con Card
- Call-to-action prominente
- Icona illustrativa (da lucide-react)

---

## 📱 Mobile Considerations

### Component Adaptation
- Sheet invece di Dialog su mobile
- DropdownMenu invece di azioni inline
- Tabs per organizzare contenuti
- Collapsible per nascondere opzioni avanzate

### Touch Targets
- Usare size="lg" per bottoni su mobile
- Spacing adeguato tra elementi interattivi
- Evitare hover-only interactions

---

## 🎯 Progressive Disclosure Strategy

### Livelli di Complessità
1. **Livello Base** (sempre visibile):
   - Azioni principali (aggiungi, elimina)
   - Informazioni essenziali (tipo, durata)
   - Preset pronti all'uso

2. **Livello Intermedio** (un click di distanza):
   - Modifica durata
   - Duplica contenuto
   - Riordina elementi

3. **Livello Avanzato** (in accordion/collapsible):
   - Personalizzazione font
   - Colori custom
   - Posizionamento preciso

---

## 🔌 Integrations

### Supabase Storage
- Upload immagini con progress feedback
- Auto-cleanup policy configurata a 30 giorni
- Ottimizzazione immagini lato client prima upload
- Gestione errori quota/limiti

### Real-time Updates
- Server-Sent Events per display
- Aggiornamento automatico lista contenuti
- Indicatore connessione su display

---

## 🚫 What NOT to Do

### Da Evitare
- NON creare componenti custom se esiste shadcn equivalente
- NON modificare stili base dei componenti shadcn
- NON usare colori hardcoded (usare variabili CSS del tema)
- NON complicare con animazioni elaborate
- NON aggiungere features non richieste

### Componenti shadcn da Preferire
- Usare Card invece di div custom
- Usare Button invece di styled anchors
- Usare Form invece di form nativi
- Usare Dialog/Sheet invece di modal custom
- Usare Select invece di dropdown custom

---

## 📐 Implementation Guidelines

### Component Selection
Per ogni elemento UI, verificare prima se esiste un componente shadcn appropriato. L'ordine di preferenza è:
1. Componente shadcn esatto per quel use case
2. Componente shadcn adattabile
3. Combinazione di componenti shadcn
4. Solo se nessuna opzione sopra funziona, considerare alternative

### Theme Consistency
- Utilizzare sempre le variabili CSS del tema shadcn
- Non specificare colori RGB/HEX diretti
- Utilizzare le classi di utility Tailwind compatibili con il tema
- Mantenere consistency usando gli stessi size variant

### Form Patterns
- Ogni form deve usare il sistema di Form di shadcn
- Validation con react-hook-form + zod
- Error handling consistente
- Loading states su submit

---

## 🎬 Page Flow

### Navigation Flow
```
/login → /dashboard → /editor (modal/sheet)
                    ↓
                /display (nuova tab)
```

### User Journey
1. **Login** → Form semplice con password
2. **Dashboard** → Vista immediata contenuti
3. **Add Content** → Modal/Sheet con opzioni
4. **Edit/Manage** → Inline o modal editing
5. **Preview** → Link a display page

---

## 📦 Required shadcn Components

Lista minima di componenti shadcn necessari:
- **Layout**: Card, Separator, ScrollArea
- **Forms**: Form, Input, Textarea, Select, Checkbox, Slider
- **Buttons**: Button, Toggle, ToggleGroup
- **Feedback**: Toast, Alert, AlertDialog, Progress
- **Overlay**: Dialog, Sheet, Dropdown Menu
- **Display**: Badge, Skeleton, Avatar (per preview)
- **Navigation**: Tabs, Navigation Menu (o Menubar o Sidebar)
- **Data**: Table (opzionale), Pagination (se necessario)

---

## 🔧 Technical Notes

### Performance
- Lazy loading per componenti pesanti
- Virtualization per liste lunghe
- Optimistic UI per azioni veloci
- Debounce su input real-time

### Accessibility
- Tutti i componenti shadcn sono già accessibili
- Aggiungere aria-labels dove necessario
- Mantenere focus management corretto
- Keyboard navigation funzionante

### Browser Support
- Componenti shadcn supportano browser moderni
- Fallback per fullscreen API se non supportata
- Progressive enhancement per features avanzate

---

## 📝 Final Notes for Claude Code

1. **Start Simple**: Implementa prima le funzionalità base con componenti shadcn standard
2. **No Customization**: Usa i componenti così come sono, senza modifiche
3. **Theme Agnostic**: Non assumere colori specifici, usa le variabili del tema
4. **Component First**: Per ogni UI element, cerca prima tra i componenti shadcn
5. **Mobile Responsive**: I componenti shadcn sono già responsive, assicurati di usare i breakpoint corretti

L'obiettivo è un'app funzionale e professionale usando esclusivamente il toolkit shadcn/ui standard, permettendo facili cambi di tema in futuro.
