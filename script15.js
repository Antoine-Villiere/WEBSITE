;(function() {
  // ---- Inject Bento‑style CSS once ----
  const BENTO_CSS = `
    /* Bento container */
    .bento-card {
      display: grid;
      gap: 1rem;
      grid-template-areas:
        "header header"
        "stats stats"
        "meta feed";
      grid-template-columns: 1fr 1fr;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      padding: 1rem;
      max-width: 600px;
      margin: auto;
      font-family: 'Segoe UI', sans-serif;
      color: #333;
    }
    .bento-header {
      grid-area: header;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .bento-header img {
      width: 64px; height: 64px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .bento-header .name {
      font-size: 1.25rem;
      font-weight: 600;
    }
    .bento-header .username {
      font-size: 0.9rem;
      color: #666;
    }
    .bento-meta {
      grid-area: meta;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
      color: #555;
    }
    .bento-meta .bio {
      font-style: italic;
    }
    .bento-stats {
      grid-area: stats;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .bento-stats .stat {
      flex: 1 1 45%;
      background: #f9f9f9;
      border-radius: 8px;
      padding: 0.75rem;
      text-align: center;
    }
    .bento-stats .stat .value {
      display: block;
      font-size: 1.1rem;
      font-weight: 500;
    }
    .bento-stats .stat .label {
      font-size: 0.75rem;
      color: #888;
    }
    .bento-feed {
      grid-area: feed;
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 4px;
    }
    .bento-feed img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 6px;
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
  if (!document.getElementById('bento-style')) {
    const s = document.createElement('style');
    s.id = 'bento-style';
    s.textContent = BENTO_CSS;
    document.head.appendChild(s);
  }

  // ---- Main logic ----
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
    out.innerHTML = '<p class="loading">Chargement…</p>';

    try {
      const resp = await fetch(`${WORKER}?username=${encodeURIComponent(user)}`);
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Status ${resp.status}\n${errText}`);
      }
      const ct = resp.headers.get('Content-Type') || '';
      if (!ct.includes('application/json')) {
        const text = await resp.text();
        throw new Error(`Réponse non JSON : ${text.substr(0,200)}…`);
      }
      const d = await resp.json();

      // Build Bento‑style card
      out.innerHTML = `
        <div class="bento-card">
          <div class="bento-header">
            <img src="${d.profile_pic_url}" alt="${d.username}">
            <div>
              <div class="name">${d.full_name}</div>
              <div class="username">@${d.username}</div>
            </div>
          </div>
          <div class="bento-meta">
            <div class="bio">${d.biography || '—'}</div>
            <div>Catégorie : <strong>${d.category || '—'}</strong></div>
          </div>
          <div class="bento-stats">
            <div class="stat"><span class="value">${d.post_count.toLocaleString()}</span><span class="label">Posts</span></div>
            <div class="stat"><span class="value">${d.followers.toLocaleString()}</span><span class="label">Followers</span></div>
            <div class="stat"><span class="value">${d.following.toLocaleString()}</span><span class="label">Following</span></div>
            <div class="stat"><span class="value">${d.avg_likes}</span><span class="label">Likes</span></div>
            <div class="stat"><span class="value">${d.avg_comments}</span><span class="label">Comments</span></div>
            <div class="stat"><span class="value">${d.avg_views}</span><span class="label">Views</span></div>
            <div class="stat"><span class="value">${d.posts_per_week}</span><span class="label">Posts/Semaine</span></div>
            <div class="stat"><span class="value">${d.engagement_rate}%</span><span class="label">Engagement</span></div>
          </div>
          <div class="bento-feed">
            ${d.recent_posts?.slice(0,6).map(url => `<img src="${url}" alt="">`).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
    }
  });
})();