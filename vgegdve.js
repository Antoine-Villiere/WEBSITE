/* description-ai-v4.js — Assistant IA : Générateur de descriptions marketing (UX améliorée) */
(function () {
  /* ---------------------------- CONFIGURATION ---------------------------- */
  const WORKER_URL = "https://generator.hello-6ce.workers.dev"; // ⇠ adapte si besoin
  const ROOT_ID    = "description-ai";
  const SIGNUP_URL = "https://www.spottedge.app";

  /* ------------------------------ THEME CSS ------------------------------ */
  const CSS = `
:root{
  --bg:#ffffff;          --card:#f5f9ff;       --text:#102a43;
  --sub:#4b5563;         --border:#ececec;      --accent:#3b82f6;
  --error:#dc2626;       --shadow:0 8px 20px rgba(0,0,0,.04);
}
:root[data-theme="dark"]{
  --bg:#0d1117;          --card:#161b22;       --text:#e6edf3;
  --sub:#8b949e;         --border:#30363d;      --accent:#3b82f6;
  --error:#f87171;       --shadow:0 8px 20px rgba(0,0,0,.5);
}
#${ROOT_ID}{
  font-family:Inter,system-ui;
  background:var(--bg);
  color:var(--text);
  padding:clamp(1.5rem,4vw,2.5rem) 1rem;
  max-width:640px;
  margin:2rem auto;
  border:1px solid var(--border);
  border-radius:20px;
  box-shadow:var(--shadow);
  position:relative;
}
/* theme toggle */
#${ROOT_ID} .theme-toggle{
  position:absolute;top:14px;right:14px;
  background:none;border:0;font-size:1.25rem;cursor:pointer;
}
/* titles */
#${ROOT_ID} h1{
  margin:0 0 .6rem;
  font-size:clamp(1.6rem,2.3vw,2.1rem);
  font-weight:700;
  text-align:center;
}
#${ROOT_ID} .subtitle{
  margin:0 0 1.5rem;text-align:center;font-size:.95rem;color:var(--sub);
}
/* form */
label{display:block;margin-top:1.1rem;font-size:.9rem;color:var(--sub);}
label.required::after{content:"*";color:var(--error);margin-left:2px;}
input,textarea{
  width:100%;padding:.6rem .75rem;margin-top:.35rem;
  border:1px solid var(--border);border-radius:10px;font:inherit;resize:vertical;
  transition:border-color .2s,box-shadow .2s;
  background:var(--bg);color:var(--text);
}
input:focus,textarea:focus{
  border-color:var(--accent);
  box-shadow:0 0 0 3px rgba(59,130,246,.2);
  outline:none;
}
textarea{min-height:96px;}
/* main CTA */
button.cta{
  margin-top:2rem;width:100%;padding:.85rem 1.2rem;font-size:1.05rem;
  border:0;border-radius:12px;background:var(--accent);color:#fff;font-weight:600;cursor:pointer;
  box-shadow:0 4px 14px rgba(59,130,246,.35);
  position:relative;overflow:hidden;transition:background .15s,transform .15s;
}
button.cta::after{content:"";position:absolute;inset:0;background:rgba(255,255,255,.15);opacity:0;transition:opacity .3s;}
button.cta:hover{background:#2563eb;}
button.cta:hover::after{opacity:1;}
button.cta:active{transform:translateY(1px) scale(.98);}
button.cta:disabled{opacity:.6;cursor:default;box-shadow:none;}
/* ai card */
.ai-card{
  margin-top:1.6rem;padding:1.25rem 1rem;border-radius:14px;background:var(--card);
  display:flex;gap:.9rem;align-items:flex-start;box-shadow:0 2px 6px rgba(0,0,0,.05);
  opacity:0;transform:translateY(10px);animation:fadeUp .5s forwards;
}
@keyframes fadeUp{to{opacity:1;transform:none;}}
.ai-card svg{flex:0 0 32px;fill:var(--accent);margin-top:2px;}
.ai-text{flex:1;font-size:.96rem;line-height:1.48;word-break:break-word;}
button.copy{
  flex:0 0 auto;margin-left:.4rem;border:0;background:none;font-size:1.2rem;cursor:pointer;color:var(--accent);
  transition:transform .2s;
}
button.copy:hover{transform:scale(1.15);}
/* feedback */
.loader,.error{text-align:center;margin-top:1.6rem;font-style:italic;color:var(--sub);}
.error{color:var(--error);font-style:normal;font-weight:600;}
/* spinner */
@keyframes spin{to{transform:rotate(360deg);}}
.loader svg{width:20px;height:20px;vertical-align:middle;animation:spin 1s linear infinite;}
`;
  injectCSS(CSS);

  /* ------------------------------ UI BUILD ------------------------------- */
  const root = document.getElementById(ROOT_ID);
  if (!root) {console.error(`#${ROOT_ID} introuvable`);return;}

  root.innerHTML = `
    <button class="theme-toggle" title="Basculer thème clair/sombre">🌓</button>
    <h1>Générez 3 descriptions marketing accrocheuses pour vos posts en moins de 10 secondes.</h1>
    <form id="${ROOT_ID}-form" novalidate>
      <label class="required" for="instagram">Quel est votre compte Instagram ?
        <input id="instagram" name="instagram" placeholder="@nom_du_compte" autocomplete="username" required>
      </label>
      <label class="required" for="nom">Quel est le nom de votre produit ou service ?
        <input id="nom" name="nom" placeholder="Ex. : Sneakers FlyLight X" required>
      </label>
      <label class="required" for="infos">Quelles sont les informations clés à mettre en avant ?
        <textarea id="infos" name="infos" placeholder="Ex. : Matériaux recyclés, livraison gratuite, promo jusqu'au 31/05…" required></textarea>
      </label>
      <label for="site">URL de votre site (optionnel)
        <input id="site" name="site" placeholder="https://monsite.com">
      </label>
      <button class="cta" id="${ROOT_ID}-btn" type="submit">💡 Générer mes 3 descriptions</button>
    </form>
    <div id="${ROOT_ID}-out" aria-live="polite"></div>
  `;

  /* ----------------------------- ELEMENTS ------------------------------- */
  const form = document.getElementById(`${ROOT_ID}-form`);
  const btn  = document.getElementById(`${ROOT_ID}-btn`);
  const out  = document.getElementById(`${ROOT_ID}-out`);
  const themeBtn = root.querySelector('.theme-toggle');

  /* FOCUS 1st input */
  const firstInput = form.querySelector('input[name="instagram"]');
  firstInput && firstInput.focus();

  /* ------------------------- THEME TOGGLE ------------------------------- */
  themeBtn.addEventListener('click', () => {
    document.documentElement.toggleAttribute('data-theme', 'dark');
  });

  /* ------------------------- FORM HANDLER ------------------------------- */
  form.addEventListener('submit', async evt => {
    evt.preventDefault();

    /* Validate quickly (native validation will show too) */
    if (!form.reportValidity()) return;

    const payload = { choice: 'description' };
    new FormData(form).forEach((v, k) => {
      if (typeof v === 'string' && v.trim()) payload[k] = v.trim();
    });

    out.innerHTML = `<p class="loader"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="60 40"/></svg> Génération en cours…</p>`;
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

      /* transformer le bouton en call‑to‑action d'inscription */
      btn.textContent = '🚀 Inscrivez-vous gratuitement sur Spottedge';
      btn.disabled    = false;
      btn.type        = 'button';
      btn.onclick     = () => window.open(SIGNUP_URL, '_blank');
    } catch (err) {
      out.innerHTML = `<p class="error">Erreur : ${escapeHTML(err.message)}</p>`;
      btn.disabled  = false;
    }
  });

  /* ----------------------------- HELPERS -------------------------------- */
  function aiCard(text) {
    const id = crypto.randomUUID();
    return `
      <div class="ai-card" id="card-${id}">
        <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 7.09 17.09l2.41 2.41 1.5-1.5-2.41-2.41A10 10 0 0 0 12 2Zm-1 15h2v2h-2Zm2.07-4.25-.9.92A1.49 1.49 0 0 0 12 16h-1v-2h1l1.15-1.17a1.49 1.49 0 0 0 0-2.11A1.5 1.5 0 1 0 11 8h2a3.5 3.5 0 0 1 0 7Z"/></svg>
        <div class="ai-text"><strong>Description :</strong> ${escapeHTML(text)}</div>
        <button class="copy" aria-label="Copier la description" onclick="(function(txt,btn){navigator.clipboard.writeText(txt);btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1300);} )('${escapeHTML(text)}', this)">📋</button>
      </div>`;
  }

  function injectCSS(str) {
    const style = document.createElement('style');
    style.textContent = str;
    document.head.appendChild(style);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>\'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  /* ------------------------- PREFILL VIA QUERY -------------------------- */
  const params = new URLSearchParams(location.search);
  ['instagram','nom','infos','site'].forEach(field => {
    if (params.has(field)) {
      const el = form.elements[field];
      if (el) el.value = params.get(field);
    }
  });
})();