/* description.js – Assistant IA : Générateur de descriptions marketing (v3 UX) */
(function () {
  const WORKER_URL = 'https://generator.hello-6ce.workers.dev';  // ← adapte
  const ROOT_ID    = 'description-ai';
  const SIGNUP_URL = 'https://www.spottedge.app';

  /* ---------- THEME ---------- */
  const CSS = `
#${ROOT_ID}{
  font-family:Inter,system-ui;
  background:#ffffff;
  padding:2rem 1rem 2.5rem;
  max-width:640px;
  margin:2rem auto;
  border:1px solid #ececec;
  border-radius:20px;
  box-shadow:0 8px 20px rgba(0,0,0,.04);
}
#${ROOT_ID} h1{
  margin:0 0 0.5rem;
  font-size:1.75rem;
  font-weight:700;
  text-align:center;
  color:#102a43;
}
#${ROOT_ID} .subtitle{
  margin:0 0 1.5rem;
  text-align:center;
  font-size:.95rem;
  color:#4b5563;
}
label{
  display:block;
  margin-top:1.1rem;
  font-size:.9rem;
  color:#374151;
}
label.required::after{
  content:'*';
  color:#dc2626;
  margin-left:2px;
}
input,textarea{
  width:100%;
  padding:.6rem .75rem;
  margin-top:.4rem;
  border:1px solid #d1d5db;
  border-radius:10px;
  font:inherit;
  resize:vertical;
  transition:border-color .2s,box-shadow .2s;
}
input:focus,textarea:focus{
  border-color:#3b82f6;
  box-shadow:0 0 0 3px rgba(59,130,246,.2);
  outline:none;
}
textarea{
  min-height:96px;
}
button{
  margin-top:2rem;
  width:100%;
  padding:.85rem 1.2rem;
  font-size:1.05rem;
  border:0;
  border-radius:12px;
  background:#3b82f6;
  color:#ffffff;
  font-weight:600;
  cursor:pointer;
  box-shadow:0 4px 14px rgba(59,130,246,.35);
  transition:background .2s,transform .15s;
}
button:hover{background:#2563eb}
button:active{transform:translateY(1px)}
button:disabled{
  opacity:.6;
  cursor:default;
  box-shadow:none;
}
.ai-card{
  margin-top:1.6rem;
  padding:1.25rem 1rem;
  border-radius:14px;
  background:#f5f9ff;
  display:flex;
  gap:.9rem;
  box-shadow:0 2px 6px rgba(0,0,0,.05);
}
.ai-card svg{flex:0 0 32px;fill:#3b82f6}
.ai-text{flex:1;font-size:.96rem;line-height:1.48}
.loader,.error{
  text-align:center;
  margin-top:1.6rem;
  font-style:italic;
  color:#6b7280;
}
.error{
  color:#dc2626;
  font-style:normal;
  font-weight:600;
}
`;
  injectCSS(CSS);

  /* ---------- UI ---------- */
  const root = document.getElementById(ROOT_ID);
  if (!root) {
    console.error(`#${ROOT_ID} introuvable`);
    return;
  }

  root.innerHTML = `
    <h1>Assistant IA</h1>
    <p class="subtitle">Générez 3 descriptions marketing accrocheuses pour vos posts en moins de 10 secondes.</p>
    <form id="${ROOT_ID}-form">
      <label class="required">Quel est votre compte Instagram ?
        <input name="instagram" placeholder="@nom_du_compte" autocomplete="username" required>
      </label>
      <label class="required">Quel est le nom de votre produit ou service ?
        <input name="nom" placeholder="Ex. : Sneakers FlyLight X" required>
      </label>
      <label class="required">Quelles sont les informations clés à mettre en avant ?
        <textarea name="infos" placeholder="Ex. : Matériaux recyclés, livraison gratuite, promo jusqu'au 31/05…" required></textarea>
      </label>
      <label>URL de votre site (optionnel)
        <input name="site" placeholder="https://monsite.com">
      </label>
      <button id="${ROOT_ID}-btn" type="submit">💡 Générer mes 3 descriptions</button>
    </form>
    <div id="${ROOT_ID}-out"></div>
  `;

  const form = document.getElementById(`${ROOT_ID}-form`);
  const btn  = document.getElementById(`${ROOT_ID}-btn`);
  const out  = document.getElementById(`${ROOT_ID}-out`);
  const firstInput = form.querySelector('input[name="instagram"]');
  if (firstInput) firstInput.focus();

  form.addEventListener('submit', async evt => {
    evt.preventDefault();
    const payload = { choice: 'description' };
    new FormData(form).forEach((v, k) => {
      if (typeof v === 'string' && v.trim()) payload[k] = v.trim();
    });

    out.innerHTML = '<p class="loader">⏳ Génération en cours…</p>';
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

      /* --- transformer le bouton en call‑to‑action d'inscription --- */
      btn.textContent = '🚀 Essayer gratuitement sur SpottEdge';
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
        <div class="ai-text"><strong>Assistant IA :</strong> ${escapeHTML(text)}</div>
      </div>`;
  }

  function injectCSS(str) {
    const style = document.createElement('style');
    style.textContent = str;
    document.head.appendChild(style);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, c => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    }[c]));
  }
})();
