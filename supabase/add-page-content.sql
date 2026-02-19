-- ============================================================
-- Migrasjon: Legg til page_content JSONB-kolonne i settings
-- Kjør dette i Supabase SQL Editor
-- ============================================================

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS page_content JSONB DEFAULT '{
    "hero_heading": "Trygg og pålitelig hjelp",
    "hero_subheading": "Jeg hjelper deg med småjobber i hjem og hage – og praktisk hjelp i hverdagen. Pålitelig, rimelig og alltid med et smil.",
    "about_paragraph1": "Jeg er 13 år og bor på Brekka på Tromøya. Jeg går på Roligheden skole, og på fritiden spiller jeg håndball og fotball – og er veldig glad i snowboard!",
    "about_paragraph2": "Jeg har to yngre søsken og er vant til å hjelpe til hjemme. Jeg liker å være til nytte for andre, og det er derfor jeg har startet Nabolagshjelpen. Jeg tilbyr hjelp med alt fra gressklipping og snømåking til å bære handleposer og annet enkelt arbeid i hjemmet.",
    "about_paragraph3": "Foreldrene mine støtter meg i dette, og du kan alltid ta kontakt med dem hvis du har spørsmål. Det skal alltid være trygt å be om hjelp i nabolaget!"
  }';

-- Oppdater eksisterende rad (id=1) slik at kolonnen får standard-verdiene
UPDATE settings
SET page_content = '{
    "hero_heading": "Trygg og pålitelig hjelp",
    "hero_subheading": "Jeg hjelper deg med småjobber i hjem og hage – og praktisk hjelp i hverdagen. Pålitelig, rimelig og alltid med et smil.",
    "about_paragraph1": "Jeg er 13 år og bor på Brekka på Tromøya. Jeg går på Roligheden skole, og på fritiden spiller jeg håndball og fotball – og er veldig glad i snowboard!",
    "about_paragraph2": "Jeg har to yngre søsken og er vant til å hjelpe til hjemme. Jeg liker å være til nytte for andre, og det er derfor jeg har startet Nabolagshjelpen. Jeg tilbyr hjelp med alt fra gressklipping og snømåking til å bære handleposer og annet enkelt arbeid i hjemmet.",
    "about_paragraph3": "Foreldrene mine støtter meg i dette, og du kan alltid ta kontakt med dem hvis du har spørsmål. Det skal alltid være trygt å be om hjelp i nabolaget!"
  }'
WHERE id = 1 AND page_content IS NULL;
