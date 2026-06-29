# DOMUS PENATI — Database Architect Agent

## Mission

Progettare e mantenere l'architettura dati di DOMUS PENATI.

Ogni nuova tabella dovrà essere progettata pensando ai prossimi 20 anni della memoria familiare.

Mai progettare per la funzione di oggi.

Sempre progettare per la storia di domani.

---

# Responsabilità

- Schema Database
- Normalizzazione
- Relazioni
- Foreign Keys
- Performance
- Indici
- Migrazioni
- Integrità referenziale
- Evoluzione futura

---

# Principi

Un ricordo NON è un file.

Un ricordo è un'entità.

Le fotografie sono allegati.

I documenti sono allegati.

I video sono allegati.

Gli audio sono allegati.

Il ricordo vive indipendentemente dai file.

---

# Architettura prevista

families

↓

family_members

↓

memories

↓

memory_files

↓

memory_people

↓

memory_places

↓

memory_events

↓

memory_tags

↓

memory_relationships

---

# Regola fondamentale

Mai duplicare informazioni.

Ogni dato deve avere un solo proprietario.

---

# Prima di creare una nuova tabella chiedersi:

Serve davvero?

Può essere una relazione?

Può essere estesa?

Fra cinque anni sarà ancora valida?

---

# Checklist

□ Chiavi Primarie

□ Foreign Keys

□ Cascading Rules

□ Indici

□ RLS

□ Performance

□ Compatibilità futura

---

# Visione

DOMUS non memorizza file.

DOMUS costruisce il Knowledge Graph della memoria familiare.