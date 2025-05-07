(function() {
  const WORKER_URL = 'https://generator.hello-6ce.workers.dev';
  const ROOT_ID    = 'engagement-ai';
  const SIGNUP_URL = 'https://www.spottedge.app';

  // --- CSS minimal pour le widget ---
  const CSS = `
    #${ROOT_ID} { font-family: Arial, sans-serif; max-width: 500px; margin:2rem auto; }
    #${ROOT_ID} input { width: calc(100% - 110px); padding: .5rem; font-size:1rem; }
    #${ROOT_ID} button { width: 100px; padding: .5rem; font-size:1rem; margin-left:.5rem; }
    .loader, .error { text-align:center; margin-top:1rem; color:#666; }
    .card { border:1px solid #ececec; border-radius:10px; padding:1rem; box-shadow:0 2px 6px rgba(0,0,0,.1); }
    .card-header { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
    .card-header img { width:64px; height:64px; border-radius:50%; object-fit:cover; }
    .card-header .info { line-height:1.2; }
    .card-header .info .full { font-weight:600; font-size:1.1rem; }
    .card-header .info .user { color:#666; }
    .stats { list-style:none; padding:0; margin:0; display:grid; grid-template-columns:1fr 1fr; gap:.5rem; }
    .stats li { background:#f9f9f9; padding:.5rem; border-radius:6px; display:flex; justify-content:space-between; }
    .stats li span:first-child { color:#888; }
    .stats li span:last-child { font-weight:500; }
    .stats li:nth-child(2n) { background:#fff; }
    button.collab { margin-top:1rem; width:100%; padding:.7rem; background:#005f73; color:#fff; border:none; border-radius:6px; cursor:pointer; }
    button.collab:hover { background:#0a9396; }
  `;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // --- Construire l'UI de base ---
  const root = document.getElementById(ROOT_ID);
  root.innerHTML = `
    <div>
      <input id="username" placeholder="@username Instagram">
      <button id="check">Analyser</button>
      <div id="results"></div>
    </div>
  `;

  const btn     = root.querySelector('#check');
  const input   = root.querySelector('#username');
  const results = root.querySelector('#results');

  btn.addEventListener('click', async () => {
    const user = input.value.replace(/^@/, '').trim();
    if (!user) {
      return showError('Veuillez saisir un nom d’utilisateur.', results);
    }
    showLoading(results);
    try {
      const res = await fetch(`${WORKER_URL}?username=${encodeURIComponent(user)}&posts=18`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      renderCard(results, d);
    } catch {
      showError(`Impossible de récupérer les données pour @${user}.`, results);
    }
  });

  function showLoading(el) {
    el.innerHTML = '<p class="loader">Chargement…</p>';
  }

  function showError(msg, el) {
    el.innerHTML = `
      <p class="error">${msg}</p>
      <button class="collab" onclick="window.open('${SIGNUP_URL}','_blank')">
        Commencer à collaborer
      </button>
    `;
  }

  function renderCard(el, d) {
    el.innerHTML = `
      <div class="card">
        <div class="card-header">
          <img src="${d.profile_pic_url}" alt="@${d.username}" onerror="this.src='https://via.placeholder.com/64'">
          <div class="info">
            <div class="full">${d.full_name}</div>
            <div class="user">@${d.username}</div>
          </div>
        </div>
        <ul class="stats">
          <li><span>Posts analysés</span><span>${d.posts_analyzed}</span></li>
          <li><span>Taux d’engagement</span><span>${d.engagement_rate_percent}%</span></li>
          <li><span>Followers</span><span>${d.followers.toLocaleString()}</span></li>
          <li><span>Likes moyens</span><span>${d.average_likes}</span></li>
          <li><span>Commentaires moyens</span><span>${d.average_comments}</span></li>
        </ul>
        <button class="collab" onclick="window.open('${SIGNUP_URL}','_blank')">
          Collaborez avec @${d.username}
        </button>
      </div>
    `;
  }
})();