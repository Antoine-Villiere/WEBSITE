/* ugc.js – Assistant IA : Idées UGC (v3 UX – cohérent description.js) */
(function () {
  const WORKER_URL = 'https://generator.hello-6ce.workers.dev';  // ← adapte
  const ROOT_ID    = 'ugc-ai';
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
  border-color:#005f73;
  box-shadow:0 0 0 3px rgba(59,130,246,.2);
  outline:none;
}
textarea{min-height:96px}
button{margin-top:2rem;width:100%;padding:.85rem 1.2rem;font-size:1.05rem;border:0;border-radius:12px;background:#005f73;color:#fff;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,.35);transition:background .2s,transform .15s}
button:hover{background:#0a9396}
button:active{transform:translateY(1px)}
button:disabled{opacity:.6;cursor:default;box-shadow:none}
.idea-card{
  margin-top:1.6rem;
  padding:1.25rem 1rem;
  border-radius:14px;
  background:#f5f9ff;
  display:flex;
  gap:.9rem;
  box-shadow:0 2px 6px rgba(0,0,0,.05);
}
.idea-card svg{flex:0 0 32px;fill:#3b82f6}
.idea-text{flex:1;font-size:.96rem;line-height:1.48}
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
    <h1>Générez 3 idées UGC prêtes à tourner en moins de 10 secondes.</h1>
    <form id="${ROOT_ID}-form">
    <label class="required">Quel est votre compte Instagram ?
        <input name="instagram" placeholder="@nom_du_compte" autocomplete="username" required>
      </label>
      <label class="required">Infos clé sur la marque ou le produit
        <textarea name="info_marque" placeholder="Ex. : Sneakers FlyLight X en matériaux recyclés" required></textarea>
      </label>
      <label class="required">Canal de diffusion
        <input name="canal" placeholder="Ex. : TikTok" required>
      </label>
      <label class="required">Objectif marketing
        <input name="objectif" placeholder="Ex. : Augmenter la notoriété / Générer des ventes" required>
      </label>
      <label>Brief créatif (optionnel)
        <textarea name="brief_creatif" placeholder="Ex. : Vidéo dynamique en intérieur, ton humoristique…"></textarea>
      </label>
      <label>URL de votre site (optionnel)
        <input name="site" placeholder="https://monsite.com">
      </label>
      <button id="${ROOT_ID}-btn" type="submit">🎬 Générer mes 3 idées</button>
    </form>
    <div id="${ROOT_ID}-out"></div>
  `;

  const form = document.getElementById(`${ROOT_ID}-form`);
  const btn  = document.getElementById(`${ROOT_ID}-btn`);
  const out  = document.getElementById(`${ROOT_ID}-out`);
  form.querySelector('textarea[name="info_marque"]').focus();

  form.addEventListener('submit', async evt => {
    evt.preventDefault();
    const payload = { choice: 'ugc' };
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
      out.innerHTML = result.map((v, i) => ideaCard(v, i + 1)).join('');

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
  function ideaCard(data, idx) {
    const visuels = data['visuels clés'] || data.visuels || [];
    return `
      <div class="idea-card">
        <svg width="32" height="32" viewBox="0 0 24 24"><path d="M22 6.5 12 2 2 6.5v11l10 4.5 10-4.5v-11Zm-2 .92v8.53L12 20.56 4 15.95V7.42L12 3.83l8 3.59ZM7.5 12a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1Z"/></svg>
        <div class="idea-text">
          <strong>Idée ${idx} – Hook :</strong> ${escapeHTML(data.hook ?? '‑')}<br>
          <strong>Scénario :</strong> ${escapeHTML(data.scénario ?? data.scenario ?? '‑')}<br>
          <strong>Visuels clés :</strong>
          <ul style="margin:0.3rem 0 0 1.1rem;padding:0;">
            ${visuels.map(v => `<li>${escapeHTML(v)}</li>`).join('')}
          </ul>
          <strong>CTA :</strong> ${escapeHTML(data.cta ?? '‑')}
        </div>
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