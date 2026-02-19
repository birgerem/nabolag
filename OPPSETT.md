# Nabolagshjelpen – Oppsettguide

## 1. Installer Node.js

Last ned og installer Node.js (versjon 18 eller nyere) fra:
https://nodejs.org/

Velg "LTS"-versjonen (den anbefalte).

## 2. Installer avhengigheter

Åpne en terminal (kommandolinje) i prosjektmappen og kjør:

```
cd D:\Nettside\nabolagshjelpen
npm install
```

## 3. Sett opp Supabase

1. Gå til https://supabase.com og lag en gratis konto
2. Opprett et nytt prosjekt (velg EU-region, f.eks. Frankfurt)
3. Gå til **SQL Editor** i menyen til venstre
4. Kopier og lim inn alt fra filen `supabase/schema.sql` og klikk **Run**
5. Gå til **Settings > API** og kopier:
   - Project URL
   - anon/public key
   - service_role key

## 4. Lag .env.local

Lag en fil som heter `.env.local` i prosjektmappen med dette innholdet:

```
NEXT_PUBLIC_SUPABASE_URL=https://din-prosjekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-nøkkel
SUPABASE_SERVICE_ROLE_KEY=din-service-role-nøkkel
```

Erstatt verdiene med de du kopierte fra Supabase.

## 5. Opprett admin-bruker

1. I Supabase, gå til **Authentication > Users**
2. Klikk **Add user** > **Create new user**
3. Skriv inn din e-post og et sterkt passord
4. Klikk **Create user**

Denne brukeren brukes for å logge inn på admin-panelet.

## 6. Kjør lokalt

```
npm run dev
```

Åpne nettleseren og gå til http://localhost:3000

Admin-panelet finner du på http://localhost:3000/admin

## 7. Deploy til Vercel

1. Last opp koden til GitHub (lag et repository)
2. Gå til https://vercel.com og logg inn med GitHub
3. Klikk **Import project** og velg repositoriet
4. Under **Environment Variables**, legg til de samme 3 variablene fra `.env.local`
5. Klikk **Deploy**

Ferdig! Nettsiden er nå live.

## Endre telefonnummer og pris

Du kan endre telefonnummer og timepris på to måter:

### Via admin-panelet (enklest):
1. Gå til /admin og logg inn
2. Klikk på "Innstillinger"-fanen
3. Endre telefonnummer og/eller timepris
4. Klikk "Lagre endringer"

### Via Supabase (alternativ):
1. Gå til Supabase > Table Editor > settings
2. Endre verdiene direkte i tabellen
