/* hooks.js – Assistant IA : Hooks marketing (v3 UX – cohérent description.js) */
(function () {
  const WORKER_URL = 'https://generator.hello-6ce.workers.dev';  // ← adapte
  const ROOT_ID    = 'hooks-ai';
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
  color:#ca6702;
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
input{
  width:100%;
  padding:.6rem .75rem;
  margin-top:.4rem;
  border:1px solid #d1d5db;
  border-radius:10px;
  font:inherit;
  transition:border-color .2s,box-shadow .2s;
}
input:focus{
  border-color:#005f73;
  box-shadow:0 0 0 3px rgba(59,130,246,.2);
  outline:none;
}
button{
  margin-top:2rem;
  width:100%;
  padding:.85rem 1.2rem;
  font-size:1.05rem;
  border:0;
  border-radius:12px;
  background:#005f73;
  color:#ffffff;
  font-weight:600;
  cursor:pointer;
  box-shadow:0 4px 14px rgba(59,130,246,.35);
  transition:background .2s,transform .15s;
}
button:hover{background:#0a9396}
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
  if (!root) { console.error(`#${ROOT_ID} introuvable`); return; }

  root.innerHTML = `
    <h1>Générez 3 hooks marketing irrésistibles en moins de 10 secondes.</h1>
    <form id="${ROOT_ID}-form">
    <label class="required">Quel est votre compte Instagram ?
        <input name="instagram" placeholder="@nom_du_compte" autocomplete="username" required>
      </label>
      <label class="required">Type de produit
        <input name="type_prod" placeholder="Ex. : App de fitness" required>
      </label>
      <label class="required">Nom du produit
        <input name="nom" placeholder="Ex. : FitTrack Coach" required>
      </label>
      <label class="required">Audience cible
        <input name="audience" placeholder="Ex. : Femmes 25‑35 actives" required>
      </label>
      <label class="required">Problème principal à résoudre
        <input name="probleme" placeholder="Ex. : Manque de motivation pour faire du sport" required>
      </label>
      <label class="required">Tonalité souhaitée
        <input name="tonalite" placeholder="Ex. : Inspirante et énergique" required>
      </label>
      <label>URL de votre site (optionnel)
        <input name="site" placeholder="https://monsite.com">
      </label>
      <button id="${ROOT_ID}-btn" type="submit">💡 Générer mes 3 hooks</button>
    </form>
    <div id="${ROOT_ID}-out"></div>
  `;

  const form = document.getElementById(`${ROOT_ID}-form`);
  const btn  = document.getElementById(`${ROOT_ID}-btn`);
  const out  = document.getElementById(`${ROOT_ID}-out`);
  form.querySelector('input[name="type_prod"]').focus();

  form.addEventListener('submit', async evt => {
    evt.preventDefault();
    const payload = { choice: 'hooks' };
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
      btn.textContent = '🚀 Inscrivez-vous gratuitement sur Spottedge';
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
        <svg width="32" height="32" viewBox="0 0 24 24"><path d="m12 2 9 4v8l-9 4-9-4V6l9-4Zm0 2.18L5 7.06v6.88l7 3.12 7-3.12V7.06l-7-2.88ZM11 8h2v5h-2V8Zm0 6h2v2h-2v-2Z"/></svg>
        <div class="ai-text"><strong>Hook :</strong> ${escapeHTML(text)}</div>
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