/* engagement.js – Assistant IA : Taux d'engagement IG (v3 UX – cohérent description.js) */
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
button{margin-top:2rem;width:100%;padding:.85rem 1.2rem;font-size:1.05rem;border:0;border-radius:12px;background:#005f73;color:#fff;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,.35);transition:background .2s,transform .15s}
button:hover{background:#0a9396}
button:active{transform:translateY(1px)}
button:disabled{opacity:.6;cursor:default;box-shadow:none}
.engagement-card{
  margin-top:1.6rem;
  padding:1.25rem 1rem;
  border-radius:14px;
  background:#f5f9ff;
  display:flex;
  gap:1rem;
  align-items:center;
  box-shadow:0 2px 6px rgba(0,0,0,.05);
}
.engagement-card img{
  flex:0 0 64px;
  width:64px;
  height:64px;
  border-radius:50%;
  object-fit:cover;
}
.engagement-text{
  flex:1;
  font-size:.96rem;
  line-height:1.5;
}
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
    <h1>Calculez votre taux d'engagement Instagram en moins de 10 secondes.</h1>
    <p class="subtitle">Analysez jusqu'à 50 de vos derniers posts pour obtenir vos stats.</p>
    <form id="${ROOT_ID}-form">
      <label class="required">Quel est le @username Instagram ?
        <input name="instagram" placeholder="@nom_du_compte" autocomplete="instagram" required>
      </label>
      <label class="required">Nombre de posts à analyser
        <input name="posts" type="number" min="10" max="50" placeholder="Ex. : 18" value="18" required>
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
      // Le worker renvoie un array à un seul élément contenant l'objet JSON
      const data = JSON.parse(result[0]);
      out.innerHTML = renderCard(data);

      /* --- transformer le bouton en call‑to‑action d'inscription --- */
      btn.textContent = '🚀 Inscrivez-vous gratuitement sur Spottedge';
      btn.disabled    = false;
      btn.type        = 'button';
      btn.onclick     = () => window.open(SIGNUP_URL, '_blank');
    } catch (err) {
      out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
      btn.disabled = false;
    }
  });

  /* ---------- Helpers ---------- */
  function renderCard(data) {
    return `
      <div class="engagement-card">
        <img src="${data.profile_pic_url}" alt="Avatar de ${data.full_name}">
        <div class="engagement-text">
          <strong>${data.full_name}</strong> <span>(${data.username})</span><br/>
          <strong>Followers :</strong> ${Number(data.followers).toLocaleString()}<br/>
          <strong>Posts analysés :</strong> ${data.posts_analyzed}<br/>
          <strong>Likes moyens :</strong> ${Number(data.average_likes).toFixed(1)}<br/>
          <strong>Commentaires moyens :</strong> ${Number(data.average_comments).toFixed(1)}<br/>
          <strong>Taux d'engagement :</strong> ${Number(data.engagement_rate_percent).toFixed(2)} %
        </div>
      </div>`;
  }

  function injectCSS(str) {
    const style = document.createElement('style');
    style.textContent = str;
    document.head.appendChild(style);
  }
})();
