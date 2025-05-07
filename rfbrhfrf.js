/* engagement.js – Assistant IA : Taux d'engagement IG (v5 UX – Bento Design) */
(function () {
  const WORKER_URL = 'https://generator.hello-6ce.workers.dev';  // ← adapte
  const ROOT_ID    = 'engagement-ai';
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
  color:#fff;
  font-weight:600;
  cursor:pointer;
  box-shadow:0 4px 14px rgba(59,130,246,.35);
  transition:background .2s,transform .15s;
}
button:hover{background:#0a9396}
button:active{transform:translateY(1px)}
button:disabled{opacity:.6;cursor:default;box-shadow:none}
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

/* Bento Design pour les stats */
.stats-group {
  margin-top: 2rem;
}
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: min-content;
  gap: 1rem;
}
.cell-photo {
  grid-column: 1;
  background: #e0f7fa;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.cell-photo img {
  width:72px;
  height:72px;
  border-radius:50%;
  margin-bottom:0.5rem;
}
.cell-photo .username {
  display:block;
  font-size:1.1rem;
  font-weight:600;
  color:#1e293b;
}
.cell-followers {
  grid-column:2;
  background:#fff7e6;
  padding:1rem;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.03);
  text-align:center;
}
.cell-followers .label {
  font-size:0.9rem;
  font-weight:600;
  color:#334155;
}
.cell-followers .value {
  font-size:1.25rem;
  font-weight:700;
  color:#0f172a;
  margin-top:0.25rem;
}
.cell-likes {
  grid-column:1;
  background:#e6f7e6;
  padding:1rem;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.03);
  text-align:center;
}
.cell-likes .label {
  font-size:0.9rem;
  font-weight:600;
  color:#334155;
}
.cell-likes .value {
  font-size:1.25rem;
  font-weight:700;
  color:#0f172a;
  margin-top:0.25rem;
}
.cell-comments {
  grid-column:2;
  background:#f6e6fa;
  padding:1rem;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.03);
  text-align:center;
}
.cell-comments .label {
  font-size:0.9rem;
  font-weight:600;
  color:#334155;
}
.cell-comments .value {
  font-size:1.25rem;
  font-weight:700;
  color:#0f172a;
  margin-top:0.25rem;
}
.cell-engagement {
  grid-column:1 / -1;
  background:#e6eaf7;
  padding:1rem;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.03);
  text-align:center;
}
.cell-engagement .label {
  font-size:1rem;
  font-weight:600;
  color:#334155;
}
.cell-engagement .value {
  font-size:1.5rem;
  font-weight:700;
  color:#0f172a;
  margin-top:0.5rem;
}
`;
  injectCSS(CSS);

  /* ---------- UI ---------- */
  const root = document.getElementById(ROOT_ID);
  if (!root) { console.error(`#${ROOT_ID} introuvable`); return; }

  root.innerHTML = `
    <h1>Calculez votre taux d'engagement Instagram en moins de 10 secondes.</h1>
    <p class="subtitle">Analysez jusqu'à 50 de vos derniers posts pour obtenir vos stats.</p>
    <form id="${ROOT_ID}-form">
      <label class="required">Quel est le @username Instagram ?
        <input name="instagram" placeholder="@nom_du_compte" autocomplete="instagram" required>
      </label>
      <label class="required">Nombre de posts à analyser
        <input name="posts" type="number" min="10" max="50" placeholder="Ex. : 18" value="18" required>
      </label>
      <button id="${ROOT_ID}-btn" type="submit">🔍 Calculer l'engagement</button>
    </form>
    <div id="${ROOT_ID}-out"></div>
  `;

  const form = document.getElementById(`${ROOT_ID}-form`);
  const btn  = document.getElementById(`${ROOT_ID}-btn`);
  const out  = document.getElementById(`${ROOT_ID}-out`);
  form.querySelector('input[name="instagram"]').focus();

  form.addEventListener('submit', async evt => {
    evt.preventDefault();
    const payload = { choice: 'engagement' };
    new FormData(form).forEach((v, k) => {
      if (typeof v === 'string' && v.trim()) payload[k] = v.trim();
    });

    out.innerHTML = '<p class="loader">⏳ Calcul en cours…</p>';
    btn.disabled = true;

    try {
      const res = await fetch(`${WORKER_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const { result } = await res.json();
      const data = Array.isArray(result) ? JSON.parse(result[0]) : result;
      out.innerHTML = renderCard(data);
      btn.textContent = '🚀 Inscrivez-vous gratuitement sur Spottedge';
      btn.disabled    = false;
      btn.type        = 'button';
      btn.onclick     = () => window.open(SIGNUP_URL, '_blank');
    } catch (err) {
      out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
      btn.disabled = false;
    }
  });

  /* ---------- Helpers ---------- */
  function renderCard(data) {
    return `
      <div class="stats-group">
        <div class="stats-header">
          ⚠️ Attention : l’influenceur peut volontairement masquer certaines statistiques, ce qui peut fausser les chiffres ci-dessous.
        </div>
        <div class="bento-grid">
          <div class="cell-photo">
            <img src="${data.profilePic}" alt="Avatar de ${data.full_name}">
            <span class="username">${data.username}</span>
          </div>
          <div class="cell-followers">
            <span class="label">Followers</span>
            <span class="value">${Number(data.followers).toLocaleString()}</span>
          </div>
          <div class="cell-likes">
            <span class="label">Likes moyens</span>
            <span class="value">${Number(data.avg_likes).toFixed(1)}</span>
          </div>
          <div class="cell-comments">
            <span class="label">Commentaires moyens</span>
            <span class="value">${Number(data.avg_comments).toFixed(1)}</span>
          </div>
          <div class="cell-engagement">
            <span class="label">Taux d’engagement sur les ${data.posts_analyzed} derniers posts</span>
            <span class="value">${Number(data.engagement_rate_percent).toFixed(2)} %</span>
          </div>
        </div>
      </div>`;
  }

  function injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
})();