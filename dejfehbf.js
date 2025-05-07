(function () {
  const WORKER_URL = 'https://generator.hello-6ce.workers.dev';  // ← adapte
  const ROOT_ID    = 'engagement-ai';
  const SIGNUP_URL = 'https://www.spottedge.app';

  /* ---------- THEME ---------- */
  const CSS = `
:root {
  --primary: #005f73;
  --accent: #0a9396;
  --text-dark: #1e293b;
  --text-muted: #4b5563;
  --bg-card: #ffffff;
  --bg-light: #f3f4f6;
  --bg-stat: #eef2ff;
  --border-radius: 16px;
  --shadow-soft: 0 6px 18px rgba(0,0,0,0.06);
}

#${ROOT_ID} {
  font-family: 'Inter', sans-serif;
  background: var(--bg-light);
  padding: 2rem 1rem;
  max-width: 640px;
  margin: 2rem auto;
}

#${ROOT_ID} h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  color: var(--primary);
}

#${ROOT_ID} .subtitle {
  margin: 0 0 1.5rem;
  text-align: center;
  font-size: 1rem;
  color: var(--text-muted);
}

label {
  display: block;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: var(--text-dark);
}

label.required::after {
  content: '*';
  color: #e63946;
  margin-left: 2px;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--border-radius);
  font: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(10,147,150,0.2);
  outline: none;
}

button {
  margin-top: 2rem;
  width: 100%;
  padding: 0.9rem;
  font-size: 1.1rem;
  border: none;
  border-radius: var(--border-radius);
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: background 0.2s, transform 0.1s;
}

button:hover { background: var(--accent); }
button:active { transform: translateY(1px); }
button:disabled { opacity: 0.6; cursor: default; box-shadow: none; }

.loader, .error {
  text-align: center;
  margin-top: 1.5rem;
  font-style: italic;
  color: var(--text-muted);
}
.error {
  color: #e63946;
  font-style: normal;
  font-weight: 600;
}

/* Improved Stats Card Design */
.stats-group {
  margin-top: 2rem;
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}
.stats-header {
  background: var(--primary);
  color: #fff;
  padding: 1rem;
  font-size: 0.95rem;
  text-align: center;
}
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}
.cell-photo {
  text-align: center;
}
.cell-photo img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--accent);
  object-fit: cover;
  margin-bottom: 0.5rem;
}
.cell-photo .username {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-dark);
}
.cell-photo .fullname {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.cell-stat {
  background: var(--bg-stat);
  padding: 1rem;
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.cell-stat .label {
  font-size: 0.95rem;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}
.cell-stat .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
}

.cell-engagement {
  grid-column: 1 / -1;
  background: var(--bg-stat);
  padding: 1.25rem;
  border-radius: var(--border-radius);
  text-align: center;
}
.cell-engagement .label {
  font-size: 1rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}
.cell-engagement .value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
}
`;  injectCSS(CSS);

  /* ---------- UI ---------- */
  const root = document.getElementById(ROOT_ID);
  if (!root) { console.error(`#${ROOT_ID} introuvable`); return; }

  root.innerHTML = `
    <h1>Calculez votre taux d'engagement Instagram en 10s</h1>
    <p class="subtitle">Analysez jusqu'à 50 de vos derniers posts pour obtenir vos meilleures stats.</p>
    <form id="${ROOT_ID}-form">
      <label class="required">@ Instagram
        <input name="instagram" placeholder="nom_du_compte" autocomplete="instagram" required>
      </label>
      <label class="required">Nombre de posts<br/><small>(10–50)</small>
        <input name="posts" type="number" min="10" max="50" value="18" required>
      </label>
      <button id="${ROOT_ID}-btn" type="submit">🔍 Calculer</button>
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
      btn.textContent = '🚀 Inscrivez-vous sur Spottedge';
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
        <div class="stats-header">⚠️ <em>${data.username}</em> peut masquer des stats, chiffres approximatifs.</div>
        <div class="bento-grid">
          <div class="cell-photo">
            <img src="${data.profilePic}" alt="Avatar de ${data.full_name}">
            <span class="username">${data.username}</span>
            <span class="fullname">${data.full_name || ''}</span>
          </div>
          <div class="cell-stat">
            <span class="label">Followers</span>
            <span class="value">${Number(data.followers).toLocaleString()}</span>
          </div>
          <div class="cell-stat">
            <span class="label">Likes moyens</span>
            <span class="value">${Number(data.avg_likes).toFixed(1)}</span>
          </div>
          <div class="cell-stat">
            <span class="label">Commentaires</span>
            <span class="value">${Number(data.avg_comments).toFixed(1)}</span>
          </div>
          <div class="cell-engagement">
            <span class="label">Engagement (sur ${data.posts_analyzed} posts)</span>
            <span class="value">${Number(data.engagement_rate_percent).toFixed(2)}%</span>
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
