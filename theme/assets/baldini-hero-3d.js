(() => {
  if (customElements.get('baldini-hero')) return;
  let viewerPromise;
  class BaldiniHero extends HTMLElement {
    connectedCallback() {
      if (this.cleanup) return;
      const controller = new AbortController();
      this.cleanup = () => controller.abort();
      const on = (target, event, fn) => target.addEventListener(event, fn, { signal: controller.signal });
      const frames = JSON.parse(this.querySelector('[data-frames]').textContent);
      const stage = this.querySelector('[data-spin]');
      const image = stage.querySelector('img');
      const model = this.querySelector('[data-model]');
      const hint = this.querySelector('[data-hint]');
      let index = 0, pointer = null, lastX = 0, loaded = false;
      const preload = () => {
        if (loaded) return;
        loaded = true;
        // Load the remaining views only when the visitor interacts.
        frames.forEach(url => { const img = new Image(); img.src = url; });
      };
      const rotate = delta => {
        preload();
        index = ((index + delta) % frames.length + frames.length) % frames.length;
        image.src = frames[index];
      };
      on(stage, 'pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        preload(); pointer = e.pointerId; lastX = e.clientX;
        stage.setPointerCapture(e.pointerId);
      });
      on(stage, 'pointermove', e => {
        if (e.pointerId !== pointer) return;
        const steps = Math.trunc((e.clientX - lastX) / 8);
        if (steps) { rotate(-steps); lastX = e.clientX; }
      });
      ['pointerup','pointercancel','lostpointercapture'].forEach(event => on(stage,event,()=>{pointer=null;}));
      on(stage, 'keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault(); rotate(e.key === 'ArrowLeft' ? -1 : 1);
        }
      });
      on(this.querySelector('[data-prev]'), 'click', () => rotate(-1));
      on(this.querySelector('[data-next]'), 'click', () => rotate(1));
      on(this.querySelector('[data-reset]'), 'click', () => { index=0; image.src=frames[0]; });
      on(image,'error',()=>{hint.textContent='Vista non disponibile. Riprova con le frecce.';});
      this.querySelectorAll('[data-mode]').forEach(button => on(button, 'click', async () => {
        const isModel = button.dataset.mode === 'model';
        this.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        stage.hidden = isModel; model.hidden = !isModel;
        this.querySelector('[data-controls]').hidden = isModel;
        this.querySelector('[data-note]').hidden = !isModel;
        hint.textContent = isModel ? 'Trascina per ruotare · pizzica per lo zoom' : 'Trascina per ruotare · oppure usa le frecce';
        if (isModel) {
          try {
            viewerPromise ||= import(this.dataset.viewer).catch(error => { viewerPromise=null; throw error; });
            await viewerPromise;
          } catch (_) { hint.textContent='Il modello 3D non è disponibile. Usa la vista Prodotto 360°.'; }
        }
      }));
      on(this.querySelector('model-viewer'),'error',()=>{hint.textContent='Modello non disponibile. Usa la vista Prodotto 360°.';});
    }
    disconnectedCallback() { if (this.cleanup) this.cleanup(); this.cleanup=null; }
  }
  customElements.define('baldini-hero', BaldiniHero);
})();
