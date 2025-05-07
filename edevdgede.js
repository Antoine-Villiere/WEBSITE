/* engagement.js – Assistant IA : Taux d'engagement IG (v7 UX – Bento Design) */
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
  font-size:0.95rem;
  color:#4b5563;
}
label{
  display:block;
  margin-top:1.1rem;
  font-size:0.9rem;
  color:#374151;
}
label.required::after{
  content:'*';
  color:#dc2626;
  margin-left:2px;
}
input{
  width:100%;
  padding:0.6rem 0.75rem;
  margin-top:0.4rem;
  border:1px solid #d1d5db;
  border-radius:10px;
  font:inherit;
  transition:border-color 0.2s,box-shadow 0.2s;
}
input:focus{
  border-color:#005f73;
  box-shadow:0 0 0 3px rgba(59,130,246,0.2);
  outline:none;
}
button{
  margin-top:2rem;
  width:100%;
  padding:0.85rem 1.2rem;
  font-size:1.05rem;
  border:0;
  border-radius:12px;
  background:#005f73;
  color:#fff;
  font-weight:600;
  cursor:pointer;
  box-shadow:0 4px 14px rgba(59,130,246,0.35);
  transition:background 0.2s,transform 0.15s;
}
button:hover{background:#0a9396}
button:active{transform:translateY(1px)}
button:disabled{opacity:0.6;cursor:default;box-shadow:none}
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
.cell-photo,
.cell-followers,
.cell-likes,
.cell-comments {
  background: #fefae0; /* bleu pastel */
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
}
.cell-photo {
  grid-column: 1;
  align-items: center;
  text-align: center;
}
.cell-photo img {
  width:72px;
  height:72px;
  border-radius:50%;
  margin-bottom:0.5rem;
}
.cell-photo .username {
  font-size:16px;
  font-weight:600;
  color:#1e293b;
}
.cell-followers {
  grid-column: 2;
  justify-content: space-between;
}
.cell-followers .label,
.cell-likes .label,
.cell-comments .label {
  font-size:16px;
  font-weight:normal;
  color:#334155;
}
.cell-followers .value,
.cell-likes .value,
.cell-comments .value {
  font-size:22px;
  font-weight:700;
  color:#0f172a;
  margin: auto 0;
}
.cell-likes {
  grid-column: 1;
  justify-content: space-between;
}
.cell-comments {
  grid-column: 2;
  justify-content: space-between;
}
.cell-engagement {
  grid-column: 1 / -1;
  background: #f3f4f6; /* gris pastel */
  padding: 1rem;
  border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.03);
  text-align:center;
}
.cell-engagement .label {
  font-size:16px;
  font-weight:normal;
  color:#334155;
  margin-bottom:0.5rem;
}
.cell-engagement .value {
  font-size:22px;
  font-weight:700;
  color:#0f172a;
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
    new FormData(form).forEach((v, k) => { if (typeof v === 'string' && v.trim()) payload[k] = v.trim(); });

    out.innerHTML = '<p class="loader">⏳ Calcul en cours…</p>';
    btn.disabled = true;

    try {
      const res = await fetch(`${WORKER_URL}/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
          ⚠️ Attention : <em>${data.username}</em> peut volontairement masquer certaines statistiques, ce qui peut fausser les chiffres ci-dessous.
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
