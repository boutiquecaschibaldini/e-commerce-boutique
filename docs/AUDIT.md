# Audit prima dell’implementazione

## Existing functionality
Tema Shopify Impact: catalogo dinamico, ricerca predittiva, filtri collection, varianti con bottoni, media immagini/video/modelli, quick-buy drawer, carrello AJAX e line item properties. Template product, product.airflow e product.pre-order. Globo gestisce le opzioni aggiuntive; regole app e dati non sono inclusi nello ZIP.

## Current Shopify architecture
Online Store 2.0: template JSON e gruppi header/footer/overlay; app embeds in settings_data.json; Product JSON-LD tramite structured_data di Shopify; canonical e meta descrizioni da Shopify. Menu header attuale: brand, layout drawer. Logo ufficiale: shopify://shop_images/baldini-boutique-caschi-1_1.png. Il file binario del logo non è incluso; il campionamento del rosso non è possibile offline. Rosso indicativo del brief #D71920.

## Apps/integrations found
Globo Product Options, Shopify Subscriptions, Pushdaddy WhatsApp, AdPerfect, Hulk Forms, LDT Gift Wrap, Notify Me, Omnisend. Template cart.salemaximize.liquid conservato. Non risulta un’app wishlist nel tema: nuova wishlist solo locale, disattivabile.

## Functionality that must be preserved
Blocchi/embeds app senza cambio ID, impostazioni e line item properties; product-form e varianti Impact; dati, URL, inventory e prezzi in Shopify; media, checkout, gift card, contatti/policy reali, script content_for_header e SEO Shopify. Non sostituire Globo con un nuovo sistema di interfono o personalizzazione.

## Proposed architecture
Componenti Baldini originali per header, finder, categorie, promo e trust; sezioni Shopify dinamiche; adattamento visuale dei componenti Impact di acquisto per mantenere integrazioni. Tema completo in theme/. Nessun frontend headless. Hero 360 reale e modello 3D indicativo conservati come sezione facoltativa.

## Risks
Accesso HTTPS ai siti Baldini e ActionMoto bloccato dal proxy con 403; nessun audit live completato. Non è possibile ricostruire da screenshot inventati l’esperienza di ActionMoto. Menu e dati collection/brand non sono esportati: utilizzare menu Shopify e handle già presenti nel tema. Globo e metodi di pagamento devono essere validati in una preview Shopify autenticata. Soglia spedizione gratuita FAQ 699,99 € contro cart setting 800 €: conferma manuale necessaria; non cambiare automaticamente le tariffe. Impossibile verificare Lighthouse del nuovo tema su Shopify prima dell’importazione.
