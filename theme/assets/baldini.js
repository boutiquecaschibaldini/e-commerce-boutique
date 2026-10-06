/* Additive UX only: native Shopify cart/variant logic remains in theme.js. */
(() => {
  const root = document.body.dataset.baldiniRoot || '/';
  const storage = {
    read(key) { try { const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v.filter(x=>typeof x==='string'&&/^[a-z0-9][a-z0-9-]*$/i.test(x)).slice(0,24):[]; } catch { return []; } },
    write(key,value) { try { localStorage.setItem(key,JSON.stringify(value));return true; } catch { return false; } }
  };
  const announce = text => { const node=document.getElementById('BaldiniStatus');if(node)node.textContent=text; };
  const money = value => { try { return new Intl.NumberFormat(document.body.dataset.baldiniLocale||'it',{style:'currency',currency:document.body.dataset.baldiniCurrency||'EUR'}).format(value/100); } catch {return (value/100).toFixed(2);} };
  const productCache = new Map();
  async function getProduct(handle) {
    if(!/^[a-z0-9][a-z0-9-]*$/i.test(handle))throw Error('Invalid handle');
    if(!productCache.has(handle))productCache.set(handle,fetch(`${root}products/${encodeURIComponent(handle)}.js`).then(r=>{if(!r.ok)throw Error('Product unavailable');return r.json();}).catch(e=>{productCache.delete(handle);throw e;}));
    return productCache.get(handle);
  }
  function card(product, removable=false) {
    const article=document.createElement('article');article.className='b-saved-card';
    const a=document.createElement('a');a.href=`${root}products/${encodeURIComponent(product.handle)}`;
    if(product.featured_image){const url=new URL(product.featured_image,location.href);if(['https:','http:'].includes(url.protocol)){const img=document.createElement('img');url.searchParams.set('width','400');img.src=url.href;img.alt=product.title;img.width=400;img.height=400;img.loading='lazy';a.append(img);}}
    const info=document.createElement('div');info.className='b-saved-card__info';
    for(const [tag,text] of [['small',product.vendor],['strong',product.title],['span',money(product.price)]]){const el=document.createElement(tag);el.textContent=text;info.append(el);}
    a.append(info);article.append(a);
    if(removable){const button=document.createElement('button');button.type='button';button.dataset.wishlistHandle=product.handle;button.textContent='Rimuovi dai preferiti';button.setAttribute('aria-label',`Rimuovi ${product.title} dai preferiti`);article.append(button);}
    return article;
  }
  function syncWishlist(){const handles=storage.read('baldini:wishlist');document.querySelectorAll('[data-wishlist-count]').forEach(n=>n.textContent=handles.length);document.querySelectorAll('[data-wishlist-handle]').forEach(n=>n.setAttribute('aria-pressed',String(handles.includes(n.dataset.wishlistHandle))));}
  let wishlistRun=0;
  async function renderWishlist(){const run=++wishlistRun;const list=document.querySelector('[data-wishlist-list]');const status=document.querySelector('[data-wishlist-status]');if(!list||!status)return;const handles=storage.read('baldini:wishlist');list.replaceChildren();status.textContent=handles.length?'Caricamento…':'Non hai ancora salvato prodotti.';const results=await Promise.allSettled(handles.map(getProduct));if(run!==wishlistRun||!list.isConnected)return;for(const result of results){if(result.status==='fulfilled')list.append(card(result.value,true));}status.textContent=results.some(r=>r.status==='rejected')?'Alcuni prodotti non sono disponibili. Riprova più tardi.':handles.length?'':'Non hai ancora salvato prodotti.';}
  document.addEventListener('click',event=>{
    const saved=event.target.closest('[data-wishlist-handle]');if(saved){const handle=saved.dataset.wishlistHandle;const values=storage.read('baldini:wishlist');const exists=values.includes(handle);if(!storage.write('baldini:wishlist',exists?values.filter(v=>v!==handle):[handle,...values].slice(0,24))){announce('Il browser non permette il salvataggio dei preferiti.');return;}syncWishlist();announce(exists?'Prodotto rimosso dai preferiti.':'Prodotto salvato nei preferiti.');if(document.getElementById('BWishlist')?.open)renderWishlist();}
    if(event.target.closest('[data-mobile-wishlist]')){document.getElementById('BMobileMenu')?.close();const dialog=document.getElementById('BWishlist');if(dialog){dialog._opener=document.querySelector('[data-dialog-open=BMobileMenu]');dialog.showModal();document.body.classList.add('b-dialog-open');renderWishlist();}}
    const opener=event.target.closest('[data-dialog-open]');if(opener){const dialog=document.getElementById(opener.dataset.dialogOpen);if(!dialog)return;event.preventDefault();dialog._opener=opener;dialog.showModal();opener.setAttribute('aria-expanded','true');document.body.classList.add('b-dialog-open');if(dialog.id==='BWishlist')renderWishlist();}
    const closer=event.target.closest('[data-dialog-close]');if(closer)closer.closest('dialog')?.close();
    document.querySelectorAll('.b-mega[open]').forEach(details=>{if(!details.contains(event.target))details.open=false;});
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.b-mega[open]').forEach(d=>{d.open=false;d.querySelector('summary').focus();});});
  // Capture handles dialogs inserted by the Theme Editor too.
  document.addEventListener('close',event=>{if(event.target.matches('dialog.b-dialog')){event.target._opener?.setAttribute('aria-expanded','false');event.target._opener?.focus();if(!document.querySelector('dialog[open]'))document.body.classList.remove('b-dialog-open');}},true);
  document.addEventListener('click',event=>{if(event.target.matches('dialog.b-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
  document.addEventListener('shopify:section:load',syncWishlist);
  document.addEventListener('cart:change',syncWishlist);
  window.addEventListener('storage',event=>{if(event.key==='baldini:wishlist'){syncWishlist();if(document.getElementById('BWishlist')?.open)renderWishlist();}});
  const sizeInput = event => event.target.closest('input[data-option-position]') || event.target.closest('label[for]')?.control;
  document.addEventListener('click',event=>{const input=sizeInput(event);const form=input?.form;if(!form||input.dataset.optionPosition!==form.dataset.baldiniSizePosition)return;const picker=document.querySelector(`variant-picker[form-id="${form.getAttribute('id')}"]`);const label=input.labels?.[0]?.textContent.trim();if(picker?.selectedVariant?.options?.[Number(input.dataset.optionPosition)-1]===label){form.dataset.baldiniSizeChosen='true';form.dataset.baldiniSizePending='false';form.querySelector('[data-baldini-size-choice]')?.remove();}},true);
  document.addEventListener('change',event=>{const input=event.target.closest('[data-option-position]');if(input?.form&&input.dataset.optionPosition===input.form.dataset.baldiniSizePosition){input.form.dataset.baldiniSizePending='true';}},true);
  document.addEventListener('variant:change',event=>{const form=event.target;if(form.matches?.('form[data-baldini-size-position]')&&form.dataset.baldiniSizePending==='true'){form.dataset.baldiniSizeChosen='true';form.dataset.baldiniSizePending='false';form.querySelector('[data-baldini-size-choice]')?.remove();}});
  document.addEventListener('submit',event=>{const form=event.target;if(form.matches('form[data-baldini-size-position]')&&(form.dataset.baldiniSizePending==='true'||(form.querySelector('[data-baldini-size-choice]')&&form.dataset.baldiniSizeChosen!=='true'))){event.preventDefault();event.stopImmediatePropagation();announce(form.dataset.baldiniSizePending==='true'?'Attendi il caricamento della taglia selezionata.':'Seleziona la taglia prima di aggiungere il prodotto.');const radio=document.querySelector(`input[form="${form.getAttribute('id')}"][data-option-position="${form.dataset.baldiniSizePosition}"]`);radio?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});radio?.focus();}},true);
  syncWishlist();
  const current=document.body.dataset.baldiniProduct;
  if(current)storage.write('baldini:recent',[current,...storage.read('baldini:recent').filter(h=>h!==current)].slice(0,12));
  class BaldiniRecent extends HTMLElement {
    connectedCallback(){if(this.started)return;this.started=true;const handles=storage.read('baldini:recent').filter(h=>h!==this.dataset.current).slice(0,4);if(!handles.length)return;const load=async()=>{const results=await Promise.allSettled(handles.map(getProduct));if(!this.isConnected)return;const list=this.querySelector('[data-recent-list]');for(const r of results)if(r.status==='fulfilled')list.append(card(r.value));this.hidden=list.children.length===0;};this.observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){this.observer.disconnect();load();}},{rootMargin:'300px'});this.hidden=false;this.observer.observe(this);}
    disconnectedCallback(){this.observer?.disconnect();this.started=false;}
  }
  class BaldiniSearch extends HTMLElement {
    connectedCallback(){if(this.controller)return;this.controller=new AbortController();this.input=this.querySelector('input[type=search]');this.results=this.querySelector('[role=listbox]');this.status=this.querySelector('[data-search-status]');this.active=-1;const signal=this.controller.signal;
      this.input.addEventListener('input',()=>{clearTimeout(this.timer);this.request?.abort();this.active=-1;this.close();this.results.replaceChildren();if(this.input.value.trim().length<2){return;}this.timer=setTimeout(()=>this.search(),220);},{signal});
      this.input.addEventListener('keydown',e=>{const links=[...this.results.querySelectorAll('[role=option]')];if((e.key==='ArrowDown'||e.key==='ArrowUp')&&links.length){e.preventDefault();this.active=(this.active+(e.key==='ArrowDown'?1:-1)+links.length)%links.length;links.forEach((l,i)=>l.setAttribute('aria-selected',String(i===this.active)));this.input.setAttribute('aria-activedescendant',links[this.active].id);links[this.active].scrollIntoView({block:'nearest'});}else if(e.key==='Escape'){e.preventDefault();this.close();}else if(e.key==='Enter'&&this.active>=0&&links[this.active]){e.preventDefault();location.assign(links[this.active].href);}},{signal});
      this.addEventListener('focusout',()=>{setTimeout(()=>{if(!this.contains(document.activeElement))this.close();},0);},{signal});
      this.input.addEventListener('focus',()=>{if(this.results.children.length&&this.input.value.trim().length>=2){this.results.hidden=false;this.input.setAttribute('aria-expanded','true');}},{signal});
    }
    close(){this.request?.abort();this.results.hidden=true;this.input.setAttribute('aria-expanded','false');this.input.removeAttribute('aria-activedescendant');this.active=-1;}
    async search(){const query=this.input.value.trim();this.request?.abort();const request=this.request=new AbortController();const url=new URL(this.dataset.endpoint,location.origin);url.searchParams.set('q',query);url.searchParams.set('resources[type]','product,collection');url.searchParams.set('resources[limit]','6');url.searchParams.set('section_id',this.dataset.section);this.status.textContent='Ricerca in corso.';
      try{const response=await fetch(url,{signal:request.signal});if(!response.ok)throw Error('Search failed');const html=await response.text();if(this.input.value.trim()!==query||!this.isConnected)return;const content=new DOMParser().parseFromString(html,'text/html').querySelector('[data-baldini-search-results]');if(!content)throw Error('Invalid search response');this.results.replaceChildren(...content.childNodes);this.results.querySelectorAll('[role=option]').forEach((n,i)=>n.id=`${this.input.id}-option-${i}`);this.results.hidden=false;this.input.setAttribute('aria-expanded','true');this.status.textContent=`${this.results.querySelectorAll('[role=option]').length} suggerimenti disponibili.`;
      }catch(e){if(e.name==='AbortError')return;this.close();this.status.textContent='Suggerimenti non disponibili. Premi Invio per cercare.';}
    }
    disconnectedCallback(){clearTimeout(this.timer);this.controller?.abort();this.request?.abort();this.controller=null;}
  }
  class BaldiniFinder extends HTMLElement {
    connectedCallback(){if(this.controller)return;this.controller=new AbortController();const signal=this.controller.signal;this.config=JSON.parse(this.querySelector('[data-finder-config]').textContent);this.type=this.querySelector('[data-finder-type]');this.form=this.querySelector('form');this.type.addEventListener('change',()=>this.refresh(),{signal});this.form.addEventListener('submit',e=>{e.preventDefault();const url=new URL(this.selected.url,location.origin);const size=this.querySelector('[data-finder-size]');const brand=this.querySelector('[data-finder-brand]');const budget=this.querySelector('[data-finder-budget]');if(this.sizeFilter&&size.value)url.searchParams.set(this.sizeFilter.param,size.value);if(this.brandFilter&&brand.value)url.searchParams.set(this.brandFilter.param,brand.value);if(this.priceFilter&&budget.value){const [min,max]=budget.value.split(':');if(min)url.searchParams.set(this.priceFilter.min,min);if(max)url.searchParams.set(this.priceFilter.max,max);}location.assign(url.href);},{signal});this.refresh();}
    refresh(){this.selected=this.config[Number(this.type.value)]||this.config[0];this.form.action=this.selected.url;const filters=this.selected.filters||[];this.sizeFilter=filters.find(f=>f.type==='list'&&/taglia|size/i.test(f.label));this.brandFilter=filters.find(f=>f.param==='filter.p.vendor');this.priceFilter=filters.find(f=>f.type==='price_range');for(const [key,filter,placeholder] of [['size',this.sizeFilter,'Tutte le taglie'],['brand',this.brandFilter,'Tutti i brand']]){const select=this.querySelector(`[data-finder-${key}]`);select.replaceChildren(new Option(placeholder,''));if(filter)filter.values.forEach(v=>select.add(new Option(v.label,v.value)));this.querySelector(`[data-${key}-label]`).hidden=!filter;}this.querySelector('[data-budget-label]').hidden=!this.priceFilter;this.querySelector('[data-finder-budget]').value='';}
    disconnectedCallback(){this.controller?.abort();this.controller=null;}
  }
  class BaldiniCountdown extends HTMLElement {
    connectedCallback(){const end=Date.parse(this.dataset.end);if(!Number.isFinite(end)||end<=Date.now()||!/(Z|[+-]\d{2}:\d{2})$/.test(this.dataset.end))return;const update=()=>{const seconds=Math.floor((end-Date.now())/1000);if(seconds<=0){this.hidden=true;clearInterval(this.timer);return;}this.hidden=false;const days=Math.floor(seconds/86400);const hours=Math.floor(seconds%86400/3600);const minutes=Math.floor(seconds%3600/60);this.querySelector('[data-countdown-output]').textContent=`Termina tra ${days} giorni, ${hours} ore e ${minutes} minuti`;};update();this.timer=setInterval(update,60000);}
    disconnectedCallback(){clearInterval(this.timer);}
  }
  for(const [name,klass] of [['baldini-search',BaldiniSearch],['baldini-finder',BaldiniFinder],['baldini-recent',BaldiniRecent],['baldini-countdown',BaldiniCountdown]])if(!customElements.get(name))customElements.define(name,klass);
})();
