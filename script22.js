(function(){
  // ---- Inject ultra‑modern Bento‑style CSS once ----
  const BENTO_STYLE_ID = 'bento-style';
  const css = `
:root {
  --bento-bg: #ffffff;
  --bento-text: #333333;
  --bento-shadow: 0 4px 16px rgba(0,0,0,0.1);
  --bento-radius: 16px;
  --bento-gap: 16px;
  --bento-accent: #007aff;
}
.bento-card {
  display: grid;
  gap: var(--bento-gap);
  grid-template-areas: "header" "stats" "feed";
  max-width: 600px;
  margin: 2rem auto;
  background: var(--bento-bg);
  border-radius: var(--bento-radius);
  box-shadow: var(--bento-shadow);
  padding: 1.5rem;
  font-family: 'Segoe UI', sans-serif;
  color: var(--bento-text);
  transition: transform .3s ease;
}
.bento-card:hover {
  transform: translateY(-4px);
}
.bento-header {
  grid-area: header;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.bento-header img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  background: #f0f0f0;
}
.header-text {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}
.name-block {
  display: flex;
  flex-direction: column;
}
.name {
  font-size: 1.5rem;
  font-weight: 600;
}
.username {
  font-size: 0.9rem;
  color: #666;
}
.bio-header {
  font-size: 0.9rem;
  color: #555;
  font-style: italic;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bento-stats {
  grid-area: stats;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.bento-stats .stat {
  flex: 1 1 45%;
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}
.stat .value {
  display: block;
  font-size: 1.2rem;
  font-weight: 500;
}
.stat .label {
  font-size: 0.75rem;
  color: #888;
}
.bento-feed {
  grid-area: feed;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 4px;
}
.bento-feed img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 6px;
  transition: transform .2s ease;
}
.bento-feed img:hover {
  transform: scale(1.05);
}
.loading, .error {
  text-align: center;
  font-size: 1rem;
  color: #888;
}
.error {
  color: #c00;
}
  `;
  if (!document.getElementById(BENTO_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = BENTO_STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---- Main logic ----
  document.addEventListener('DOMContentLoaded', () => {
    const WORKER = 'https://test.jeanbienso.workers.dev';
    const btn = document.getElementById('check');
    const inp = document.getElementById('username');
    const out = document.getElementById('results');

    if (!btn || !inp || !out) {
      console.error('Élément manquant :', { btn, inp, out });
      return;
    }

    btn.addEventListener('click', async () => {
      const user = inp.value.replace(/^@/, '').trim();
      if (!user) {
        out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
        return;
      }
      out.innerHTML = '<p class="loading">Chargement…</p>';

      try {
        const url = new URL(WORKER);
        url.searchParams.set('username', user);
        const resp = await fetch(url);
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`Status ${resp.status}\n${txt}`);
        }
        const d = await resp.json();

        // Render card en passant par le proxy d’images
        out.innerHTML = '';
        out.appendChild(renderCard(d, WORKER));
      } catch (err) {
        console.error(err);
        out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
      }
    });
  });

  // ---- Render helper ----
  function renderCard(d, workerUrl) {
    const esc = html =>
      (html || '').toString().replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[m]);

    // proxy pour contourner CORP
    const proxy = src => `${workerUrl}/img?url=${encodeURIComponent(src)}`;

    const card = document.createElement('div');
    card.className = 'bento-card';
    card.innerHTML = `
      <div class="bento-header">
        <img
          src="${esc(proxy(d.profile_pic_url))}"
          alt="@${esc(d.username)}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/72?text=User';"
        >
        <div class="header-text">
          <div class="name-block">
            <div class="name">${esc(d.full_name)}</div>
            <div class="username">@${esc(d.username)}</div>
          </div>
          <div class="bio-header">${esc(d.biography || '—')}</div>
        </div>
      </div>
      <div class="bento-stats">
        ${[
          { label: 'Followers',         value: d.followers.toLocaleString() },
          { label: 'Following',         value: d.following.toLocaleString() },
          { label: 'Posts',             value: d.post_count.toLocaleString() },
          { label: 'Posts / semaine',   value: d.posts_per_week },
          { label: 'Moy. likes',        value: d.avg_likes },
          { label: 'Moy. commentaires', value: d.avg_comments },
          { label: 'Engagement (%)',    value: d.engagement_rate }
        ].map(m =>
          `<div class="stat">
             <span class="value">${esc(m.value)}</span>
             <span class="label">${m.label}</span>
           </div>`
        ).join('')}
      </div>
      <div class="bento-feed">
        ${(d.recent_posts || []).slice(0, 6).map(url =>
          `<img
             src="${esc(proxy(url))}"
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/80';"
             alt=""
           >`
        ).join('')}
      </div>
    `;
    return card;
  }
})();