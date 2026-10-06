# Configurazione Shopify

1. Scaricare lo ZIP dal repository con **Download raw file**. Importarlo come nuovo tema, senza sovrascrivere il tema pubblicato. Aprire Personalizza e l’anteprima.
2. Controllare il logo ufficiale già selezionato e i colori in Impostazioni tema → Baldini. Il binario del logo non era incluso nell’export: il rosso #D71920 è indicativo e va confrontato con il logo effettivo.
3. Header: assegnare menu principale e menu brand reali. Supportati menu multilivello e blocchi mega menu con immagini, brand e “acquista per”. In assenza di menu principale sono configurate categorie con handle recuperati dal tema precedente: verificare che esistano. Non sono stati creati prodotti o collection.
4. In Search & Discovery attivare i filtri desiderati, inclusi Taglia, Brand/vendor, Prezzo, Disponibilità e Colore. Il finder mostra solo parametri realmente presenti nei filtri della collection selezionata. Verificare la navigazione sul catalogo reale.
5. Homepage: scegliere immagini autentiche per categorie/editoriali e collection reali; bestseller e premium sono disattivati finché non configurati. Creare eventualmente una collection ordinata per vendite e assegnarla alla sezione. Configurare loghi dei brand con file ufficiali. Recensioni/social sono sezioni @app opzionali, senza recensioni inventate.
6. Hero: configurare titolo, due CTA e destinazione del prodotto. La vista 360 utilizza il casco reale del video; la seconda vista GLB è illustrativa. È possibile sostituirla con un GLB fedele tramite URL. La sezione hero immagine alternativa è disattivata.
7. Verificare Globo su tutti i template: opzioni interfono, prezzi aggiuntivi, testo personalizzato, varianti e proprietà dell’articolo in carrello/checkout/ordine. Controllare Subscriptions, Notify Me, gift wrap, newsletter e tutti gli embeds già presenti. Il tema conserva i blocchi; regole e credenziali app non sono incluse nell’export.
8. Confermare la soglia della spedizione gratuita: FAQ precedente 699,99 €, impostazione carrello 800 €. Indicatore progressivo disattivato finché il commerciante conferma il valore corretto. Nessuna tariffa è stata modificata. Controllare anche testi di consegna, resi, Klarna e pagamenti nelle impostazioni Baldini. Il footer usa i metodi realmente abilitati da Shopify.
9. Verificare pagine policy, contatti, guida taglie e link dei menu. Nessuna modifica agli URL prodotto o canonical; non sono richiesti redirect dal tema.
10. Verificare sullo store reale desktop/mobile, Safari/iOS, checkout e app; eseguire Lighthouse mobile prima di pubblicare. L’obiettivo prestazionale non è stato certificato offline.

## Metafield facoltativi sui prodotti

- `custom.size_chart`: riferimento pagina, precede la guida globale.
- `custom.badges`: elenco di testo singola riga, per badge autentici.
- `custom.visor_benefit`: testo singola riga, solo beneficio reale.
- Le schede tecniche usano i metafield indicati nell’editor dei blocchi: configurare tipo e contenuto effettivi prima di abilitarli.
- `custom.quick_add_safe`: booleano. Impostare true soltanto sui prodotti verificati senza opzioni aggiuntive da compilare. Normalmente il pulsante delle card porta alla pagina prodotto per preservare taglia e opzioni.

Non sono richiesti metaobject. Wishlist e cronologia sono locali al browser: non sincronizzate con gli account e disattivabili. WhatsApp aggiuntivo è disattivato per evitare duplicati con Pushdaddy. Il countdown è facoltativo e richiede una scadenza ISO con fuso esplicito; nessuna urgenza fittizia è impostata.
