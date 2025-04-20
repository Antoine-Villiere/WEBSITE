<div class="proxy-card">
  <h1 class="proxy-card__title">Vérifier l’engagement</h1>
  <div class="proxy-card__input-group">
    <input id="username" class="proxy-card__input" placeholder="Entrez @username">
    <button id="check" class="proxy-card__button">Vérifier</button>
  </div>
  <div id="results" class="proxy-card__results"></div>
</div>

<script>
;(function() {
  console.log('✅ script.js chargé et exécuté');
  const btn = document.getElementById('check'),
        inp = document.getElementById('username'),
        out = document.getElementById('results'),
        WORKER = 'https://test.jeanbienso.workers.dev';

  btn.addEventListener('click', async () => {
    const user = inp.value.replace(/^@/, '').trim();
    if (!user) {
      out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
      return;
    }
    out.innerHTML = '<p>Chargement…</p>';

    try {
      // 1) Récupérer le JSON complet via le Worker
      const resp = await fetch(`${WORKER}?username=${encodeURIComponent(user)}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();

      // 2) Extraire les champs souhaités
      const userInfo = json.graphql.user;
      const edges    = json.data.user.edge_owner_to_timeline_media.edges;

      // 3) Build du HTML
      let html = `
        <div class="profile-header">
          <img src="${userInfo.profile_pic_url}" alt="Photo de ${userInfo.username}" class="profile-pic">
          <div>
            <h2>@${userInfo.username}</h2>
            <p>Followers : <strong>${userInfo.edge_followed_by.count.toLocaleString()}</strong></p>
            <p>Engagement Rate estimé : <strong>${(/* calculer si besoin */) || '–'}%</strong></p>
            <p>${userInfo.biography || ''}</p>
          </div>
        </div>
        <div class="posts-grid">
          ${edges.map(e => {
            const node = e.node;
            return `<a href="https://instagram.com/p/${node.shortcode}" target="_blank">
                      <img src="${node.thumbnail_src}" alt="">
                    </a>`;
          }).join('')}
        </div>
      `;

      out.innerHTML = html;
    } catch (err) {
      console.error(err);
      out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
    }
  });
})();
</script>

<style>
.proxy-card { max-width: 480px; margin:auto; padding:1rem; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
.proxy-card__input-group { display:flex; gap:.5rem; }
.proxy-card__input    { flex:1; padding:.5rem; border:1px solid #ccc; border-radius:4px; }
.proxy-card__button   { padding:.5rem 1rem; background:#3897f0; color:#fff; border:none; border-radius:4px; cursor:pointer; }
.profile-header      { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
.profile-pic         { width:64px; height:64px; border-radius:50%; object-fit:cover; }
.posts-grid          { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; }
.posts-grid img      { width:100%; display:block; border-radius:4px; }
.error               { color:#d00; }
</style>