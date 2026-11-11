# SICK LUKE — THE CASTLE

Sito editoriale per Sick Luke. Direzione visiva gotico-castello, tipografia Bodoni, animazioni cinematografiche, catalogo reale, pipistrelli animati e Spotify ufficiale.

## Stack

- Vite + React 19
- CSS custom (nessuna libreria UI o di animazione)
- Canvas + Web Audio per atmosfera, farfalle e particelle
- Stormo di pipistrelli SVG animati su tutto il sito (CSS puro, nessuna libreria)
- Font variabili self-hosted in `public/fonts`
- Immagini WebP ottimizzate in `public/img`

## Comandi

```bash
npm install
npm run dev      # sviluppo
npm run build    # build di produzione in dist/
npm run preview  # anteprima della build
```

## Struttura

```
index.html             shell italiana (lang="it", canonical, hreflang, JSON-LD)
en/index.html          shell inglese (lang="en", canonical, hreflang, JSON-LD)
vite.config.js         build multi-page: / e /en/
src/
  App.jsx              composizione della pagina e stato dell'intro
  data.js              catalogo neutro rispetto alla lingua: album, tracklist,
                       indice tracce, top tracks Spotify, video, gallery, link,
                       date del tour e contatti booking ufficiali
  videos.json          archivio completo del canale: 162 video con metadati
  videos.js            derivate dell'archivio (video, diario, anni), caricate
                       solo dai capitoli che le usano
  styles.css           design system, animazioni, responsive
  i18n/
    index.jsx           detection lingua, context, useI18n, hrefFor
    locales/it.js       dizionario italiano completo
    locales/en.js       dizionario inglese (US) completo
  components/
    Hero, Castle, CastleGate, CastleWall, Blimp, Manifesto, Latest,
    Discography, Listen, Court, Gallery, IGFeed, Necklace, Videos,
    Booking, Footer, Header, Preloader, Cursor, Atmosphere, CommandPalette,
    SoundToggle, LangSwitch, X2Mark, BatSwarm, SpotifyEmbed
  lib/hooks.js         reveal, sezioni attive, body lock, escape, tilt, magnete,
                       focus trap, reduced motion
public/
  img/                 ritratti, copertine WebP, poster video, frame BTS, og.jpg
  img/yt/              162 poster YouTube in WebP (960×540)
  img/feed/            16 frame dietro le quinte in WebP
  img/ig/              feed Instagram in WebP: 12 post, 12 cover reel, 8 post del
                       castello, avatar + castello argento ritagliato
  fonts/               Bodoni Moda, Archivo, JetBrains Mono (WOFF2)
```

## Sezioni

1. **Sick Luke** — storia, timeline, numeri.
2. **Le opere** — otto progetti (2013–2026), 122 tracce e 105 titoli unici. Filtri per tipo, indice ricercabile di tutto il catalogo, modale con tracklist linkata a Spotify e navigazione disco precedente/successivo.
3. **L'ascolto** — top 10 Spotify con anteprime reali da 30 secondi, mini-player e **player ufficiale dell'artista** (embed Spotify montato solo quando si avvicina alla viewport).
4. **La corte** — collaboratori.
5. **I farfastrelli** — muro masonry di 16 frame BTS con lightbox e navigazione da tastiera, più il modulo **Instagram completo**. Il muro raccoglie i dietro le quinte YouTube; subito sotto, `IGFeed.jsx` porta sul sito tutto il profilo `@sicklukex2`: scheda profilo con follower, post e avatar; i **12 post più recenti** con didascalie originali, like, visualizzazioni e data; la **rail dei 12 reel** con cover reali, plays e frecce di scorrimento; e un pannello dedicato a **`@castellogrigioscuro`** con 8 post (Londra, studio, night drive) e link al profilo. Nessun embed di terze parti: ogni card apre Instagram in una nuova scheda. Appesa sopra il muro, la **colana farfastrello**: un ciondolo gioiello in SVG (catena a corda d'argento, ala di farfalla in diamanti bianchi, ala di pipistrello in diamanti neri, rubino e oro) che oscilla dal perno, segue il puntatore e accende lustrini, riflessi e pulviscolo dorato. Puramente decorativa (`aria-hidden`, `pointer-events: none`) e disattivata con `prefers-reduced-motion`.
6. **Le visioni** — capitolo **Vlog** dedicato (`#vlog`) con tutti i **34 episodi Day in the Life** (2024–2026): ultimo episodio in evidenza, episodi raggruppati per anno, contatore e accesso diretto all'archivio. Sotto, l'archivio completo dei **162 video** del canale (2011–2026) con filtri per tipo, ricerca, filtro per anno, caricamento progressivo e modale embed.
7. **L'invito** — booking ufficiale e **archivio tour interattivo**. In alto la CTA **«Entra nel castello»** con il modulo booking (`mailto:booking@sickluke.com`, oggetto e corpo già compilati, copia email con feedback, DM Instagram come seconda via); sotto il capitolo **Tour & Booking** (`#tour`) con **21 date documentate in 6 stagioni** (2018 → 2026), statistiche animate (21 date / 06 stagioni / 16 città), filtri per formato e per anno con contatori live, ricerca per città/venue/evento, rail delle città e **dossier della notte** apribile su ogni riga. Chiude il manifesto del booking.

## Contenuti

I dati neutri (titoli, tracklist, URL, date, copertine, ID video, didascalie delle immagini) stanno in `src/data.js`. Tutti i testi visibili — hero, biografia, note degli album, titoli e descrizioni dei video, didascalie della gallery, timeline, statistiche, ticker, servizi, label di navigazione — stanno nei dizionari `src/i18n/locales/it.js` e `src/i18n/locales/en.js`. Le immagini si sostituiscono in `public/img` mantenendo i nomi file oppure aggiornando i percorsi in `data.js`.

## Multilingua

- Italiano su `/`, inglese (US) su `/en/`. Ogni lingua ha il proprio HTML shell con `lang`, canonical, Open Graph e JSON-LD dedicati.
- `hreflang`: `it` → `/`, `en` → `/en/`, `x-default` → `/` (italiano come lingua di default).
- La lingua si ricava dal pathname (`src/i18n/index.jsx`), quindi non serve uno store globale né un redirect client-side.
- I componenti leggono le stringhe con `useI18n()`; `Rich` interpreta `*testo*` come corsivo editoriale.
- `LangSwitch` è presente nell'header desktop, nel menu mobile e nel footer, con `hrefLang`, `lang`, `aria-current` e label accessibili. Sotto i 360 px resta nel menu.
- Il cambio lingua conserva l'hash: da `/en/#visioni` si arriva a `/#visioni` (e viceversa) con lo scroll ripristinato sulla sezione giusta.

## Dettagli tecnici

- Ingresso cinematografico “al cancello”: `Preloader.jsx` + `CastleGate.jsx` compongono un castello gotico in SVG su strati (cielo, luna, raggi, nuvole, nebbia, braci, torce, stendardi, pipistrelli). Il contatore sale a 100, le porte si aprono in prospettiva CSS 3D, la camera spinge sul varco e un flash caldo rivela il sito. Pulsante **Entra nel castello** per saltare subito; `sessionStorage['sl-entered']` evita l'intro nella stessa sessione. Con `prefers-reduced-motion` resta una dissolvenza breve, senza zoom né porte rotanti.
- Hero “dentro il castello”: `CastleWall.jsx` aggiunge il muro di cinta in primo piano con merli, torri e torce, mentre `Hero.jsx` dispone raggi di luna, mare di nuvole basse, castello più grande, parallasse per strato e dolly legato allo scroll. Sopra il mare di nuvole galleggia il **castello d'argento** ritagliato dallo scatto `@castellogrigioscuro` (`public/img/ig/castle-glow.webp`, alpha ricavato dal cielo), e un **dirigibile** nero con insegna LED “IL MONDO È TUO / THE WORLD IS YOURS” (`Blimp.jsx`) attraversa il cielo. Una placca cromata “CASTELLO GRIGIO SCURO / NUMERO 06” è inchiodata al ritratto. Tutte le animazioni si spengono con reduced motion.
- Player Spotify custom: anteprime MP3 ufficiali, progress bar, brano successivo, mini-player fisso, gestione errori e link al catalogo.
- Modali album, video e gallery con focus trap, chiusura con Escape e blocco dello scroll.
- Discografia completa: filtri Tutti / Album / EP / Collab / OST, contatori, statistiche del catalogo (122 tracce, 105 uniche) e indice delle tracce con ricerca live, feat e versioni condivise.
- Modale album: tracklist con ricerca Spotify per ogni traccia, badge per gli inediti deluxe, certificazioni, navigazione tra i dischi e player embed.
- Archivio video: 162 video classificati (Musicali / Day in the Life / Beat & Studio / Altro), ricerca testuale, filtro per anno, contatori e caricamento a blocchi da 9.
- Capitolo Vlog (`#vlog`): `VLOGS` e `VLOG_YEARS` derivano da `videos.json` (`kind === 'day'`), quindi i 34 episodi restano sincronizzati con l'archivio. Layout editoriale con ultimo episodio cinematografico, gruppi per anno (2026 / 2025 / 2024), 3 colonne desktop → 2 tablet → 1 mobile, immagini lazy con fallback YouTube e modale condivisa con l'archivio. L'archivio completo resta sotto, ancorato a `#video-archive`, senza paginazione nel capitolo Vlog.
- Tour & Booking (`#tour`, dentro `#invito`): `TOURS` in `src/data.js` raccoglie **21 date documentate** (sito ufficiale, stampa, programmazione dei club e copertura Instagram) e `TOUR_YEARS` le raggruppa in 6 stagioni (2026, 2025, 2024, 2022, 2019, 2018). Il capitolo apre con il conteggio animato (21 date / 06 stagioni / 16 città) e prosegue con un **console di archivio**: chip per formato e per anno con contatori che si aggiornano incrociando gli altri filtri, ricerca live su città/venue/evento, rail orizzontale delle città con maschera di scorrimento, contatore risultati e reset. Le date sono raggruppate per anno con era (Sottosopra, X2, Da Tony, Dopamina, Dopamina Experience), badge “Ultima notte” solo a filtro pulito e data localizzata con `Intl.DateTimeFormat`. Ogni riga è un bottone con freccia sempre leggibile (piena su hover/focus, nascosta su mobile), nudge del padding e filo rosso al passaggio. Apre un **dossier della notte** in portal: poster con giorno/mese/città, indice `NN / NN`, venue, evento ed era, richiesta via `mailto` precompilata, Google Maps, chiusura con Escape, focus trap, blocco dello scroll e navigazione cronologica tra le notti (`Notte precedente` / `Notte successiva`, frecce ← →) senza wrap ai bordi dell'archivio. Chiude un manifesto con CTA e copia email (stato `copied`/`failed` con fallback `execCommand`). Layout 2 colonne desktop → 1 colonna, righe tour 4 → 3 colonne, chip che vanno a capo su mobile, zero overflow e transizioni spente con reduced motion.
- Poster video locali in WebP con fallback automatico a YouTube; embed lazy e `youtube-nocookie`.
- Menu mobile accessibile con focus trap e ripristino del focus.
- Pulsanti gotici: taglio a ottagono, angoli dorati, sheen al passaggio e focus visibile.
- Moodboard “dark castle”: luna in eclissi gunmetal, castello d'argento flottante, dirigibile con LED, calore di braci sul fondo della hero, ticker trasformato in nastro cromato con hairline rosse, placca editoriale cromata e credit verticali sul muro della gallery.
- Modulo Instagram editoriale in `src/components/IGFeed.jsx`: griglia 3 colonne con primo post 2×2, tile con overlay metriche/didascalia, rail orizzontale con snap e frecce per i reel, pannello castello a 4 colonne, hover con didascalie e zoom lento. Su mobile la griglia passa a 2 colonne (primo post a tutta larghezza) e le didascalie del castello restano sempre visibili.
- Pass **TRAP COUTURE** (lusso editoriale, zero dipendenze): ticket Instagram cromato nell'header (`@sicklukex2` + follower, sopra i 1300 px) che porta al muro; label di sezione con barcode e targhetta seriale `SL—NN`; riga di identificazione nella hero (`TRAP COUTURE / EST. 2013 / BSNM` + `SL—001 · MMXXVI`); cartellino cream “NEW DROP” appeso al ritratto (desktop); nastro lookbook sopra il muro con numeri `NN / LOOK` sempre leggibili; watermark serif “FEED” dietro il titolo Instagram; sheen gioiello su gallery e card IG; wordmark `SICK` cromato nel footer con timbro `WORLDWIDE — MMXXVI`; nastro finale prima del footer; cursore a diamante. Tutto in CSS puro, con varianti reduced-motion.
- Pass **3D / DEPTH** (CSS 3D puro, zero librerie): la hero è un palco prospettico (`perspective` su cielo e main) con luna, castello ritagliato, dirigibile e castello SVG su piani `translateZ` diversi che seguono il puntatore con rotazioni millimetriche; il ritratto si inclina in `rotateX/rotateY` e lastre, timbro e cartellino `NEW DROP` fluttuano su `translateZ`; lo stormo `BatSwarm.jsx` attraversa la scena su piani di profondità con ali che battono in `rotateY/rotateZ`, silhouette nere e filo rosso/oro; un secondo stormo abita il muro dei farfastrelli. Le card (album, gallery, post IG, reel, castello, scheda profilo) si inclinano con un unico listener globale (`useTiltDeck` su `[data-tilt]`, rAF-throttled, solo pointer fine) e un riflesso radiale segue il puntatore; le reveal arrivano da `translateZ`/`rotateX`. Tutto spento con `prefers-reduced-motion`, stormo congelato ma visibile.
- Pass **LIGHT / FLUID** (Core Web Vitals): hero alleggerita — stormo globale leggero (6 esemplari fissi, solo transform/opacity), un solo strato di nebbia, canvas `Atmosphere` con DPR max 1.5, niente `shadowBlur`/gradienti per frame, conteggi ridotti e avvio solo a intro conclusa. Il canvas disegna solo pipistrelli e braci: le farfalle ambientali sono state rimosse insieme agli ornamenti del marchio. Filtri blur ridotti su raggi, nebbia, brace, dirigibile e castello; niente più `drop-shadow` sul castello SVG. L'intro è un'unica animazione di trasformazione: scenery congelato durante l'apertura, braci spente, nessun filtro animato, stage con `contain`. Le sezioni sotto la piega arrivano in chunk separati (`React.lazy` + `Suspense`) e montano mentre il body è ancora bloccato. L'archivio video (34 kB di JSON) e la palette di ricerca vivono in chunk propri e non toccano il first paint: main JS a ~84 kB gzip. Il ritratto dell'eroe viene dipinto dal primo frame sotto la porta — che è comunque opaca — così la porta non ritarda l'LCP: **LCP ~0,5–1,0 s desktop a cache fredda, ~0,7 s mobile con CPU rallentata 4×**, FCP ~0,6 s, CLS 0,0001–0,0002. Porta calibrata su ~2,5 s totali, più lenta e fluida nell'apertura, con taglio rapido (~0,4 s) su Esc, Invio, Spazio o clic sullo scenario. I grid lunghi (`.albums`, `.gallery-wall`, `.video-mosaic`) restano in `content-visibility: auto` con `contain-intrinsic-size` calibrato per breakpoint; i deep link forzano il rendering dei grid prima dello scroll, così l'hash non produce layout shift. Numeri animati con `font-variant-numeric: tabular-nums`, immagini con `decoding="async"`, `color-scheme: dark` e `aria-current` sulla nav attiva.
- Pass **COMMAND / UX** (`CommandPalette.jsx`, zero dipendenze): palette globale con **⌘K / Ctrl+K** (o `/` quando non si sta scrivendo) e trigger dedicato nell'header, più una riga di ricerca nel menu mobile. Il modulo è lazy e si carica all'apertura della porta, così l'indice non pesa sul first paint. Cerca in tempo reale tra 8 sezioni (più i capitoli Vlog e Tour & Booking), 8 dischi, 105 tracce uniche, 162 video e le azioni rapide (atmosfera sonora, lingua, copia link, torna su, Spotify, Instagram, email al booking). Ranking diretto + fuzzy solo sul titolo, miniature per copertine e poster, gruppi con contatori, navigazione da tastiera con `↑ ↓ Home End ↵ Esc`, focus trap, `role="combobox"`/`listbox` con `aria-activedescendant`, ripristino del focus e conferma `aria-live` per la copia. Su mobile diventa un bottom sheet con maniglia e safe-area; con `prefers-reduced-motion` non c'è alcuna animazione. Le azioni riusano gli eventi interni `sl:open-album`, `sl:open-video`, `sl:toggle-sound`; l'atmosfera sonora ora risponde subito senza attendere il resume dell'AudioContext.
- Performance immagini: varianti WebP responsive (`-480` per i frame BTS, `-400` per i post IG, `-360` per il castello) servite con `srcset`/`sizes`, `loading="lazy"`, `decoding="async"`, dimensioni esplicite e preload di Bodoni, Archivo e JetBrains Mono. Nessun embed Instagram: zero iframe e zero cookie di terze parti.
- Ciondolo farfastrello in `src/components/Necklace.jsx`: SVG con pattern pavé, catena a corda, perno d'oro, oscillazione a pendolo con ritardo del ciondolo, inclinazione guidata dal puntatore, lustrini, riflesso sulla pietra e pulviscolo. Costo zero di rete (nessuna immagine) e `prefers-reduced-motion` rispettato.
- Marchio **X2** in `src/components/X2Mark.jsx`: monogramma SVG con X e 2 tracciati a penna, cornice opzionale, `currentColor` e nessuna richiesta di rete. Sostituisce la vecchia farfalla inventata in favicon, header, footer, porta del castello e hero. Il favicon `public/favicon.svg` riusa gli stessi tracciati su fondo notte con cornice oro. La farfalla resta solo dove è contenuto editoriale: il capitolo **I farfastrelli** e il ciondolo.
- Pulizia del marchio: rimossi `Chimera.jsx`, `EmberButterfly.jsx`, `Butterfly`, `WingPair`, `Crest`, le tre creature decorative della gallery, il canvas delle farfalle e i relativi CSS/animazioni. La copy non parla più di ali o chimere.
- Metadata Open Graph/Twitter, canonical, `hreflang` e JSON-LD per entrambe le lingue, con immagine social dedicata (`public/img/og.jpg`).
- Build multi-page: `dist/index.html` e `dist/en/index.html`.
- Layout verificato in italiano e inglese da 320 px a 1920 px, senza overflow orizzontale.

## Nota

I contenuti musicali e le immagini appartengono ai rispettivi titolari. Il muro "farfastrelli" combina frame dietro le quinte tratti dai video ufficiali YouTube e scatti pubblici dei profili Instagram `@sicklukex2` e `@castellogrigioscuro`, etichettati in didascalia. Le anteprime audio arrivano dal player embed pubblico di Spotify.

---

## Publish (GitHub Pages)

The public preview lives at:

- IT — https://ernesto-pro.github.io/sick-luke-castle/
- EN — https://ernesto-pro.github.io/sick-luke-castle/en/

It is a project page, so the build runs with `BASE_PATH=/sick-luke-castle/`
and `VITE_SITE_URL=https://ernesto-pro.github.io/sick-luke-castle`.
The production build in `dist/` is published to the `gh-pages` branch
(root), which GitHub Pages serves.

To publish an update:

```bash
./scripts/deploy-pages.sh
```

The official domain (`https://www.sickluke.com`) stays the default for
local builds: `npm run build` without `BASE_PATH` produces a root-hosted
build, and `VITE_SITE_URL` can override the canonical origin.
