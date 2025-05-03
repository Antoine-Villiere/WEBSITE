/* description.js – AI‑Assistant : Descriptions marketing (v2) */
(function () {
  const WORKER_URL   = 'https://generator.hello-6ce.workers.dev';  // ← adapte
  const ROOT_ID      = 'description-ai';
  const SIGNUP_URL   = 'https://www.spottedge.app';

  /* ---------- CSS ---------- */
  const CSS = `
#${ROOT_ID}{font-family:Inter,system-ui;background:#fff;padding:2rem 1rem;max-width:620px;margin:2rem auto;border:1px solid #ececec;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.05)}
#${ROOT_ID} h1{margin:0 0 1.4rem;font-size:1.65rem;text-align:center;color:#133354}
label{display:block;margin-top:1rem;font-size:.9rem;color:#333}
input,textarea{width:100%;padding:.55rem .7rem;margin-top:.35rem;border:1px solid #d0d0d0;border-radius:8px;font:inherit;resize:vertical}
button{margin-top:1.7rem;width:100%;padding:.75rem 1.2rem;font-size:1rem;border:0;border-radius:10px;background:#0077ff;color:#fff;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(0,119,255,.3);transition:.2s}
button:hover{background:#0061d1}
.ai-card{margin-top:1.5rem;padding:1.2rem;border-radius:12px;background:#f7faff;display:flex;gap:.8rem;box-shadow:0 2px 6px rgba(0,0,0,.05)}
.ai-card svg{flex:0 0 32px;fill:#0077ff}
.ai-text{flex:1;font-size:.95rem;line-height:1.45}
.loader,.error{text-align:center;margin-top:1.5rem;font-style:italic;color:#666}
.error{color:#c00;font-style:normal;font-weight:600}
`;
  injectCSS(CSS);

  /* ---------- UI ---------- */
  const root = document.getElementById(ROOT_ID);
  if (!root) { console.error(`#${ROOT_ID} manquant`); return; }

  root.innerHTML = `
    <h1>AI Assistant – Descriptions</h1>
    <form id="${ROOT_ID}-form">
      <label>Compte Instagram (obligatoire)
        <input name="instagram" placeholder="@votre_compte" required>
      </label>
      <label>Nom du produit / service
        <input name="nom" required>
      </label>
      <label>Infos clés
        <textarea name="infos" required></textarea>
      </label>
      <label>URL site (optionnel)
        <input name="site">
      </label>
      <button id="${ROOT_ID}-btn" type="submit">Générer mes 3 descriptions</button>
    </form>
    <div id="${ROOT_ID}-out"></div>
  `;

  const form = document.getElementById(`${ROOT_ID}-form`);
  const btn  = document.getElementById(`${ROOT_ID}-btn`);
  const out  = document.getElementById(`${ROOT_ID}-out`);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = { choice: 'description' };
    new FormData(form).forEach((v, k) => { if (v.trim()) payload[k] = v.trim(); });

    out.innerHTML = '<p class="loader">⏳ Génération…</p>';
    btn.disabled  = true;

    try {
      const res = await fetch(`${WORKER_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const { result } = await res.json();
      out.innerHTML = result.map(txt => aiCard(txt)).join('');

      /* --- transformation du bouton --- */
      btn.textContent = 'S’inscrire gratuitement';
      btn.disabled    = false;
      btn.type        = 'button';
      btn.onclick     = () => window.open(SIGNUP_URL, '_blank');

    } catch (err) {
      out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
      btn.disabled  = false;
    }
  });

  /* ---------- Helpers ---------- */
  function aiCard(text) {
    return `
    <div class="ai-card">
      <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 7.09 17.09l2.41 2.41 1.5-1.5-2.41-2.41A10 10 0 0 0 12 2Zm-1 15h2v2h-2Zm2.07-4.25-.9.92A1.49 1.49 0 0 0 12 16h-1v-2h1l1.15-1.17a1.49 1.49 0 0 0 0-2.11A1.5 1.5 0 1 0 11 8h2a3.5 3.5 0 0 1 0 7Z"/></svg>
      <div class="ai-text"><strong>AI Assistant :</strong> ${escapeHTML(text)}</div>
    </div>`;
  }
  function injectCSS(c){ const s=document.createElement('style'); s.textContent=c; document.head.appendChild(s); }
  function escapeHTML(str){ return str.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();