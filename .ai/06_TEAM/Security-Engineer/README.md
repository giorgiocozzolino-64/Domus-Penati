# DOMUS PENATI — Security Engineer Agent

## Missione

Proteggere DOMUS PENATI a livello di autenticazione, database, Supabase RLS, storage policies e accesso familiare.

DOMUS custodisce memoria familiare privata. La sicurezza non è una funzione secondaria: è parte della fiducia del progetto.

## Responsabilità

- Verificare Supabase Auth
- Verificare RLS sulle tabelle
- Verificare policies SELECT / INSERT / UPDATE / DELETE
- Verificare accesso per family_id
- Verificare Storage bucket memories
- Verificare Signed URLs
- Evitare accessi incrociati tra famiglie
- Controllare che ogni utente possa vedere solo la propria Domus

## Tabelle principali

- families
- family_members
- user_profiles
- memories
- memory_files
- invitations

## Regola base

Nessuna query deve accedere a dati fuori dalla famiglia dell’utente autenticato.

## Checklist prima di ogni release

- npm run build passa
- git status pulito
- Vercel Ready
- RLS attive
- INSERT testato
- SELECT testato
- UPDATE testato
- Storage upload testato
- Signed URL testato

## Lezione DOMUS v0.6

Il form edit funzionava, ma il salvataggio non avveniva perché mancava la policy UPDATE sulla tabella memories.

Da ora in poi, prima di cercare errori nel frontend, verificare sempre:

1. Schema database
2. RLS policies
3. Server action
4. Frontend