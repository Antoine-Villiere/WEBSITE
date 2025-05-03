/* ugc.js – AI‑Assistant : Idées UGC
   © 2025 – libre de droits
------------------------------------------------------------------ */
(function () {
  const WORKER_URL      = 'https://generator.hello-6ce.workers.dev';       // ← à adapter

  const CSS = `
#generator{font-family:Inter,system-ui;background:#fff;padding:2rem 1rem;max-width:680px;margin:2rem auto;border:1px solid #ececec;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.05)}
#generator h1{margin:0 0 1.4rem;font-size:1.65rem;text-align:center;color:#4a356f}
label{display:block;margin-top:1rem;font-size:.9rem;color:#333}
input,textarea{width:100%;padding:.55rem .7rem;margin-top:.35rem;border:1px solid #d0d0d0;border-radius:8px;font:inherit;resize:vertical}
button{margin-top:1.7rem;width:100%;padding:.75rem 1.2rem;font-size:1rem;border:0;border-radius:10px;background:#8b5cf6;color:#fff;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(139,92,246,.35);transition:.2s}
button:hover{background:#7042d2}
.idea{margin-top:1.2rem;padding:1.1rem;border-left:4px solid #8b5cf6;background:#f7f3ff;border-radius:10px}
.idea h3{margin:.2rem 0;font-size:1.05rem;color:#4a356f}
.idea ul{margin:.3rem 0 0 1rem;padding:0}
.loader,.error{text-align:center;margin-top:1.2rem;font-style:italic;color:#666}
.error{color:#c00;font-style:normal;font-weight:600}
`;
  injectCSS(CSS);

  const root = document.getElementById('generator');
  if (!root) { console.error('#generator missing'); return; }

  root.innerHTML = `
    <h1>AI Assistant – Idées UGC</h1>
    <form id="ugc-form">
      <label>Infos marque / produit
        <textarea name="info_marque" required></textarea>
      </label>
      <label>Canal
        <input name="canal" required>
      </label>
      <label>Objectif
        <input name="objectif" required>
      </label>
      <label>Brief créatif (optionnel)
        <textarea name="brief_creatif"></textarea>
      </label>
      <label>URL site (optionnel)
        <input name="site">
      </label>
      <button type="submit">Générer 3 idées UGC</button>
    </form>
    <div id="ugc-out"></div>
  `;

  const form = document.getElementById('ugc-form');
  const out  = document.getElementById('ugc-out');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = { choice: 'ugc' };
    new FormData(form).forEach((v, k) => { if (v.trim()) payload[k] = v.trim(); });

    out.innerHTML = '<p class="loader">⏳ Génération…</p>';
    try {
      const res = await fetch(`${WORKER_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const { result } = await res.json();
      out.innerHTML = result.map((v, i) => ideaCard(v, i + 1)).join('');
    } catch (err) {
      out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
    }
  });

  function ideaCard(v, idx) {
    const visuels = v['visuels clés'] || v.visuels || [];
    return `
    <div class="idea">
      <h3>🎬 Idée ${idx}</h3>
      <p><strong>Hook :</strong> ${escapeHTML(v.hook || '–')}</p>
      <p><strong>Scénario :</strong> ${escapeHTML(v.scénario || v.scenario || '–')}</p>
      <p><strong>Visuels clés :</strong></p>
      <ul>${visuels.map(it => `<li>${escapeHTML(it)}</li>`).join('')}</ul>
      <p><strong>CTA :</strong> ${escapeHTML(v.cta || '–')}</p>
    </div>`;
  }

  function injectCSS(c) { const s = document.createElement('style'); s.textContent = c; document.head.appendChild(s); }
  function escapeHTML(str) { return str.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();