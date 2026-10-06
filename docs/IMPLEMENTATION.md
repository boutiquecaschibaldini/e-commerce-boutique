# Implementazione e verifica

## File creati e modificati
L’elenco completo è in [FILES.json](FILES.json), rispetto al precedente tema 3D. Il tema installabile è in `theme/`; documentazione e test non sono inclusi nello ZIP. Header, footer, announcement e homepage rinnovati; adattamenti a product card, informazioni prodotto, varianti, buy buttons, ricerca, collection e carrello. Nuovi CSS e JavaScript Baldini separati dal motore nativo Impact.

## Integrazioni preservate
Globo Product Options, Shopify Subscriptions, Pushdaddy WhatsApp, AdPerfect, Hulk Forms, LDT Gift Wrap, Notify Me, Omnisend; template cart SaleMaximize. ID, configurazione e ordine dei blocchi app preservati. `theme.js`, vendor e PhotoSwipe originali invariati. App e checkout reali non eseguibili nel test locale: preservazione del codice non equivale a collaudo live.

## Sezioni disponibili
Hero 360/GLB e hero immagine alternativa; trust; finder; categorie; promo; collection native; premium; brand; supporto; prodotti visti; sezioni @app per recensioni/social. Header desktop con ricerca centrale e mega menu, menu mobile con focus/Escape; footer con newsletter, contatti, categorie e pagamenti reali.

## Impostazioni
Identità/logo/colori, tipografia Inter, CTA, menu, immagini, collection, testi commerciali centralizzati, guida taglie, wishlist, protezione opzioni e WhatsApp facoltativo. I blocchi di prodotto conservano galleria, zoom e media nativi. Nessun brand o recensione inventato.

## Metafield e metaobject
Metafield facoltativi e procedura in [SHOPIFY_SETUP.md](SHOPIFY_SETUP.md). Nessun metaobject obbligatorio.

## Configurazione manuale
Importazione in nuovo tema, selezione menu/immagini/collection, attivazione filtri Search & Discovery, verifica dei testi commerciali e delle app. Nessuna pubblicazione Shopify eseguita e nessun catalogo modificato.

## Test
18 controlli Chromium superati sul rendering delle sezioni Liquid effettive con contratti Shopify simulati: ricerca e fallback, finder, menu, mobile, wishlist, modello WebGL, galleria, scelta taglia obbligatoria, aggiornamento variante e URL, invio nativo al carrello con line item properties, quantità/rimozione e cronologia. Nessun errore JavaScript. Sette viewport: 1920, 1440, 1280, 768, 430, 390 e 375 px, senza overflow; hero entro 480–650 px. Vedi [browser-tests.json](browser-tests.json).

Axe WCAG A/AA non rileva violazioni nelle cinque pagine provate (home/prodotto/collection/ricerca/carrello), su fixture locali; non è una certificazione WCAG. Vedi [accessibility.json](accessibility.json). Shopify Theme Check: zero errori, 15 warning conservati/documentati nel [report](theme-check.json), principalmente componenti e impostazioni ereditati. JSON, riferimenti delle sezioni e preservazione delle app verificati.

## Tre cicli visivi
Screenshot in `docs/screenshots/`. Ciclo 1: individuati hero mobile troppo alto e overflow tablet. Ciclo 2: corretti altezza e card categorie. Ciclo 3: contrasto, tipografia, gerarchia, sticky prodotto e footer; riesaminati homepage e pagine interne. Il logo di test è un segnaposto esplicito: quello ufficiale viene caricato da Shopify. Prodotti, prezzi e disponibilità dei test sono fixture e non vengono spediti nel tema.

## Limiti
I siti Baldini e ActionMoto hanno restituito 403 dal proxy: audit live e confronto visivo diretto non completati. Interventi originali sul tema Impact esistente, senza copiare asset del concorrente. Inventario/catalogo, configurazioni server delle app e binario logo non esportati. Non sono stati verificati pagamento reale, ordine, interfono o personalizzazione dentro Globo su Shopify. Il GLB è indicativo; la vista 360 deriva dal prodotto reale.

## Performance
Assets Baldini separati; immagini responsive/lazy quando appropriate; GLB caricato quando selezionato; nessuna libreria UI aggiunta. Motore Impact conservato. Nessun punteggio Lighthouse 90 dichiarato: misurazione necessaria nell’anteprima del negozio con le sue app.

## Prossimi passi
Seguire SHOPIFY_SETUP, verificare il tema nell’anteprima con prodotti e app reali, misurare prestazioni e pubblicare da Shopify quando approvato dal commerciante.

## Ripetere i test
In `tests/`: `npm ci`; installare Chromium e aggiornare `executablePath` se necessario. Avviare `npm run serve` in un terminale; eseguire `npm test`, `npm run accessibility`, `npm run theme-check`, `npm run screenshots` in un altro. Il server è una fixture locale su porta 8877, non un’anteprima Shopify. Le API simulano solo i contratti necessari a testare il tema.
