(function () {
  const WORKER_URL = 'https://generator.hello-6ce.workers.dev';  // ← adapte
  const ROOT_ID    = 'engagement-ai';
  const SIGNUP_URL = 'https://www.spottedge.app';

  /* ---------- THEME ---------- */
  const CSS = `
#${ROOT_ID} {
  font-family: 'Inter', system-ui;
  background: #f8fafc;
  padding: 2rem 1rem 2.5rem;
  max-width: 680px;
  margin: 2rem auto;
  border-radius: 24px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
}

#${ROOT_ID} h1 {
  margin-bottom: 0.75rem;
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  color: #ff7e5f;
}

#${ROOT_ID} .subtitle {
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1rem;
  color: #6b7280;
}

label {
  display: block;
  margin-top: 1.2rem;
  font-size: 0.95rem;
  color: #2b2d42;
}

label.required::after {
  content: '*';
  color: #e63946;
  margin-left: 4px;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 12px;
  font: inherit;
  background: #ffffff;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;
}

input:focus {
  box-shadow: 0 0 0 3px rgba(255, 126, 95, 0.3);
  outline: none;
}

button {
  margin-top: 2.5rem;
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(255, 126, 95, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 126, 95, 0.5);
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
}

.loader, .error {
  text-align: center;
  margin-top: 1.8rem;
  color: #6b7280;
}

.error {
  color: #e63946;
  font-weight: 600;
}

/* ---------- Modern Stats Group ---------- */
.stats-group {
  margin-top: 2.5rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    "photo followers likes"
    "comments engagement engagement";
  gap: 1.5rem;
}

.bento-grid .cell {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
}

.bento-grid .cell:hover {
  transform: translateY(-5px);
}

.cell-photo {
  grid-area: photo;
  align-items: center;
  text-align: center;
}

.cell-photo img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 0.75rem;
  border: 2px solid #ffffff;
}

.cell-photo .username {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2b2d42;
}

.cell-followers {
  grid-area: followers;
  justify-content: space-between;
}

.cell-likes {
  grid-area: likes;
  justify-content: space-between;
}

.cell-comments {
  grid-area: comments;
  justify-content: space-between;
}

.cell-followers .label,
.cell-likes .label,
.cell-comments .label {
  font-size: 1rem;
  color: #6b7280;
}

.cell-followers .value,
.cell-likes .value,
.cell-comments .value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2b2d42;
}

.cell-engagement {
  grid-area: engagement;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.cell-engagement .label {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #6b7280;
}

.cell-engagement .value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ff7e5f;
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
          <div class="cell cell-photo">
            <img src="${data.profilePic}" alt="Avatar de ${data.full_name}">
            <span class="username">${data.username}</span>
          </div>
          <div class="cell cell-followers">
            <span class="label">Followers</span>
            <span class="value">${Number(data.followers).toLocaleString()}</span>
          </div>
          <div class="cell cell-likes">
            <span class="label">Likes moyens</span>
            <span class="value">${Number(data.avg_likes).toFixed(1)}</span>
          </div>
          <div class="cell cell-comments">
            <span class="label">Commentaires moyens</span>
            <span class="value">${Number(data.avg_comments).toFixed(1)}</span>
          </div>
          <div class="cell cell-engagement">
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
