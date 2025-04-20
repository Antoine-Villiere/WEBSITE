;(function() {
  // ---- Inject Bento‑style CSS once ----
  const BENTO_CSS = `
    /* Bento container */
    .bento-card {
      display: grid;
      gap: 1rem;
      grid-template-areas:
        "header"
        "stats"
        "feed";
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
      align-items: flex-start;
      gap: 1rem;
    }
    .bento-header img {
      width: 64px; height: 64px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      background: #eee;
    }
    .header-text {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
    }
    .name-block {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .name-block .name {
      font-size: 1.25rem;
      font-weight: 600;
    }
    .name-block .username {
      font-size: 0.9rem;
      color: #666;
    }
    .bio-header {
      font-size: 0.9rem;
      color: #555;
      font-style: italic;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
      flex-shrink: 0;
    }
    .bento-stats {
      grid-area: stats;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: space-between;
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
      background: #eee;
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
    const style = document.createElement('style');
    style.id = 'bento-style';
    style.textContent = BENTO_CSS;
    document.head.appendChild(style);
  }

  // ---- Main logic ----
  document.addEventListener('DOMContentLoaded', () => {
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
          const txt = await resp.text();
          throw new Error(`Status ${resp.status}\n${txt}`);
        }
        const ct = resp.headers.get('Content-Type') || '';
        if (!ct.includes('application/json')) {
          const txt = await resp.text();
          throw new Error(`Réponse non-JSON: ${txt.substr(0,200)}…`);
        }
        const d = await resp.json();

        // Build container
        const card = document.createElement('div');
        card.className = 'bento-card';

        // Header
        const header = document.createElement('div');
        header.className = 'bento-header';
        const imgEl = document.createElement('img');
        // fetch as blob to bypass CORS restrictions
        fetch(d.profile_pic_url)
          .then(r => r.blob())
          .then(blob => { imgEl.src = URL.createObjectURL(blob); })
          .catch(() => { imgEl.src = ''; });
        imgEl.alt = d.username;
        header.appendChild(imgEl);

        const headerText = document.createElement('div');
        headerText.className = 'header-text';
        const nameBlock = document.createElement('div');
        nameBlock.className = 'name-block';
        nameBlock.innerHTML = `<div class="name">${d.full_name}</div>
                               <div class="username">@${d.username}</div>`;
        const bioEl = document.createElement('div');
        bioEl.className = 'bio-header';
        bioEl.textContent = d.biography || '—';
        headerText.appendChild(nameBlock);
        headerText.appendChild(bioEl);
        header.appendChild(headerText);
        card.appendChild(header);

        // Stats
        const stats = document.createElement('div');
        stats.className = 'bento-stats';
        const metrics = [
          { label: 'Followers', value: d.followers.toLocaleString() },
          { label: 'Following', value: d.following.toLocaleString() },
          { label: 'Posts', value: d.post_count.toLocaleString() },
          { label: 'Posts / semaine', value: d.posts_per_week },
          { label: 'Moy. likes', value: d.avg_likes },
          { label: 'Moy. commentaires', value: d.avg_comments },
          { label: 'Engagement (%)', value: d.engagement_rate }
        ];
        metrics.forEach(m => {
          const stat = document.createElement('div');
          stat.className = 'stat';
          stat.innerHTML = `<span class="value">${m.value}</span>
                            <span class="label">${m.label}</span>`;
          stats.appendChild(stat);
        });
        card.appendChild(stats);

        // Feed images (6 derniers posts)
        const feed = document.createElement('div');
        feed.className = 'bento-feed';
        (d.recent_posts || []).slice(0, 6).forEach(url => {
          const img = document.createElement('img');
          // fetch blob
          fetch(url)
            .then(r => r.blob())
            .then(blob => { img.src = URL.createObjectURL(blob); })
            .catch(() => { img.src = ''; });
          img.alt = '';
          feed.appendChild(img);
        });
        card.appendChild(feed);

        // Render
        out.innerHTML = '';
        out.appendChild(card);
      } catch (err) {
        console.error(err);
        out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
      }
    });
  });
})();