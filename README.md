# DOMUS PENATI – MVP Frontend

## Struttura del progetto

```
domus-penati/
├── app/
│   ├── globals.css              # Base styles + font imports
│   ├── public/
│   │   ├── page.tsx             # 1. Homepage – "Bentornato a casa."
│   │   ├── register/page.tsx    # 2. Crea la tua Domus
│   │   └── login/page.tsx       # 3. Login
│   └── auth/
│       └── domus/
│           ├── page.tsx         # 4. Welcome Domus
│           ├── primo-ricordo/
│           │   └── page.tsx     # 5. Primo Ricordo
│           ├── ricordi/
│           │   └── page.tsx     # 6. I vostri ricordi
│           └── invita/
│               └── page.tsx     # 7. Invita un familiare
├── components/
│   └── ui/
│       └── index.tsx            # Button, Input, Select, FormField, Logo...
├── lib/
│   ├── copy.ts                  # Tutto il microcopy in italiano
│   └── supabase/
│       ├── client.ts            # Browser client
│       └── server.ts            # Server client (SSR)
├── types/
│   └── supabase.ts              # Tipi database TypeScript
├── middleware.ts                 # Protezione rotte auth
└── tailwind.config.ts           # Design tokens Domus Penati
```

---

## Installazione

```bash
# Crea progetto Next.js
npx create-next-app@latest domus-penati --typescript --tailwind --app --no-src-dir

# Installa dipendenze
npm install @supabase/supabase-js @supabase/ssr

# (Opzionale – per la funzione cn())
npm install clsx tailwind-merge
```

---

## Variabili d'ambiente

Crea un file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-chiave-anonima
```

---

## Schema Supabase (SQL)

Esegui questo SQL nel SQL Editor di Supabase:

```sql
-- Famiglie
create table public.families (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_id    uuid references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Membri
create table public.family_members (
  id           uuid primary key default gen_random_uuid(),
  family_id    uuid references public.families(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete cascade,
  role         text default 'family',
  display_name text,
  joined_at    timestamptz default now(),
  unique(family_id, user_id)
);

-- Ricordi
create table public.memories (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid references public.families(id) on delete cascade,
  title         text not null,
  type          text check (type in ('video','audio','photo','document','text')),
  storage_path  text,
  description   text,
  year          integer,
  location      text,
  created_by    uuid references auth.users(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Inviti
create table public.invitations (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid references public.families(id) on delete cascade,
  email       text not null,
  role        text default 'family',
  invited_by  uuid references auth.users(id),
  status      text default 'pending',
  expires_at  timestamptz,
  accepted_at timestamptz,
  created_at  timestamptz default now()
);

-- Storage bucket per i ricordi
insert into storage.buckets (id, name, public)
values ('memories', 'memories', false);

-- RLS: le famiglie sono visibili solo ai loro membri
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.memories enable row level security;
alter table public.invitations enable row level security;

create policy "Membri possono vedere la propria famiglia"
  on public.families for select
  using (id in (
    select family_id from public.family_members
    where user_id = auth.uid()
  ));

create policy "Membri possono vedere i ricordi della famiglia"
  on public.memories for all
  using (family_id in (
    select family_id from public.family_members
    where user_id = auth.uid()
  ));
```

---

## Principi di design

- **Nonna test**: ogni schermata deve essere comprensibile a una persona anziana
- **Una azione per schermata**: niente distrazioni, niente menu
- **Silenzio**: il respiro fa parte dell'interfaccia
- **Playfair Display** per emozione, **Lora** per il corpo
- **Nessun bottom nav** – il flusso è lineare, come aprire le pagine di un album
- **Testi in italiano** – tutto in `lib/copy.ts`

---

## Palette colori (tailwind.config.ts)

| Token | Valore | Uso |
|-------|--------|-----|
| `casa-cream` | `#F5F0E6` | Sfondo principale |
| `casa-dark` | `#241C0E` | Testo principale |
| `casa-mid` | `#7A6848` | Testo secondario |
| `casa-gold` | `#A88030` | Azioni primarie |
| `casa-border` | `#C8BD9A` | Bordi campi form |
| `casa-night` | `#170F06` | Sfondo homepage |

---

*"La tecnologia più avanzata non è quella che ci porta più lontano.*
*È quella che ci riporta a casa."*
