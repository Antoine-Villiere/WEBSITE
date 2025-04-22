(function() {
  // Constants
  const WORKER_URL = 'https://test.jeanbienso.workers.dev';
  const STYLE_ID = 'bento-style';

  // CSS for Bento card, button, and warning
  const CSS = `
:root {
  --bento-bg: #fff;
  --bento-text: #333;
  --bento-shadow: 0 4px 16px rgba(0,0,0,0.1);
  --bento-radius: 16px;
  --bento-gap: 16px;
  --bento-accent: #007aff;
  --warning-bg: #fff3cd;
  --warning-text: #856404;
  --warning-border: #ffeeba;
}
.bento-card {
  display: grid;
  grid-template-areas:
    "header"
    "stats"
    "warning"
    "feed"
    "collab";
  gap: var(--bento-gap);
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--bento-bg);
  border-radius: var(--bento-radius);
  box-shadow: var(--bento-shadow);
  font-family: 'Segoe UI', sans-serif;
  color: var(--bento-text);
  transition: transform .3s ease;
}
.bento-stats .stat:last-child .value {
  color: var(--bento-accent);
  font-weight: 700;
}
.bento-card:hover { transform: translateY(-4px); }
.bento-header { grid-area: header; display: flex; gap:1rem; align-items:center; }
.bento-header img { width:72px; height:72px; border-radius:50%; object-fit:cover; box-shadow:0 2px 12px rgba(0,0,0,0.15); background:#f0f0f0; }
.header-text { flex:1; display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; }
.name-block { display:flex; flex-direction:column; }
.name { font-size:1.5rem; font-weight:600; }
.username { font-size:.9rem; color:#666; }
.bio-header { font-size:.9rem; color:#555; font-style:italic; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.bento-warning {
  grid-area: warning;
  background: var(--warning-bg);
  color: var(--warning-text);
  border-left: 4px solid var(--warning-border);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
}
.bento-stats { grid-area: stats; display:flex; flex-wrap:wrap; gap:.75rem; }
.bento-stats .stat { flex:1 1 45%; background:#fafafa; border-radius:8px; padding:1rem; text-align:center; }
.stat .value { font-size:1.2rem; font-weight:500; display:block; }
.stat .label { font-size:.75rem; color:#888; }
.bento-feed { grid-area: feed; display:grid; grid-template-columns:repeat(auto-fill,minmax(80px,1fr)); gap:4px; }
.bento-feed img { width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; transition:transform .2s ease; }
.bento-feed img:hover { transform:scale(1.05); }
.bento-collab-btn {
    border-radius: 27px;
    font-weight: 600;
    font-size: 18px;
    background-color: #005f73;
    color: #fff;
    width: 100%;
    outline: none;
    padding: 12px 0px;
    border: none;
    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease; /* Smooth transition for normal state */
    cursor: pointer;
}

/* Hover effect for better UX */
.bento-collab-btn:hover {
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #005f73;
    color: #fff;
    }

/* Active effect (immediate response) */
.bento-collab-btn:active {
    transform: scale(0.95);
    background-color: #005f73;
    color: #fff;
    transition: none;
}

/* Focus state for keyboard accessibility */
.bento-collab-btn:focus {
    box-shadow: 0 0 0 3px rgba(0, 95, 115, 0.5);
    outline: none;
    background-color: #005f73;
    color: #fff;
}
.loading, .error { text-align:center; font-size:1rem; color:#888; }
.error { color:#c00; }
`;

  // Inject CSS once
  if (!document.getElementById(STYLE_ID)) {
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('check');
    const input = document.getElementById('username');
    const container = document.getElementById('results');
    if (!btn || !input || !container) {
      console.error('Missing essential elements', { btn, input, container });
      return;
    }

    btn.addEventListener('click', async () => {
      const username = input.value.replace(/^@/, '').trim();
      if (!username) {
        return showError('Veuillez saisir un nom d’influenceur.', container);
      }
      showLoading(container);
      try {
        const res = await fetch(`${WORKER_URL}?username=${encodeURIComponent(username)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        renderCard(container, data);
      } catch {
        showError(`Oups, nous n'avons pas encore de données sur cet utilisateur, revenez très prochainement.`, container, username);
      }
    });
  });

  // Helpers
  const showLoading = el => { el.innerHTML = '<p class="loading">Chargement…</p>'; };

  const showError = (message, el, user) => {
    el.innerHTML = `
      <p class="error">${message}</p>
      <button class="bento-collab-btn" onclick="window.open('https://www.spottedge.app','_blank')">
        Commencer à collaborer${user ? ' avec @' + user : ''}
      </button>
    `;
  };

  const proxyUrl = src => `${WORKER_URL}/img?url=${encodeURIComponent(src)}`;

  function renderCard(el, d) {
    const escapeHtml = html =>
      (html || '').toString().replace(/[&<>'\"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);

    const stats = [
      ['Followers', d.followers.toLocaleString()],
      ['Following', d.following.toLocaleString()],
      ['Posts', d.post_count.toLocaleString()],
      ['Posts / semaine', d.posts_per_week],
      ['Moy. likes', d.avg_likes],
      ['Moy. commentaires', d.avg_comments],
      ['Engagement (%)', d.engagement_rate]
    ];

    el.innerHTML = `
      <div class="bento-card">
        <div class="bento-header">
          <img src="${escapeHtml(proxyUrl(d.profile_pic_url))}" alt="@${escapeHtml(d.username)}" loading="lazy" onerror="this.src='https://via.placeholder.com/72?text=User';">
          <div class="header-text">
            <div class="name-block">
              <div class="name">${escapeHtml(d.full_name)}</div>
              <div class="username">@${escapeHtml(d.username)}</div>
            </div>
            <div class="bio-header">${escapeHtml(d.biography||'—')}</div>
          </div>
        </div>
        <div class="bento-stats">
          ${stats.map(([label,value]) =>
            `<div class="stat"><span class="value">${escapeHtml(value)}</span><span class="label">${label}</span></div>`
          ).join('')}
        </div>
      <div class="bento-warning"><strong>Attention :</strong> @${escapeHtml(d.username)} peut volontairement cacher ses statistiques, ce qui peut impacter les données ci-dessous.</div>      <div class="bento-feed">
          ${(d.recent_posts||[]).slice(0,6).map(url=>
            `<img src="${escapeHtml(proxyUrl(url))}" loading="lazy" onerror="this.src='https://via.placeholder.com/80';" alt="">`
          ).join('')}
        </div>
        <button class="bento-collab-btn" onclick="window.open('https://www.spottedge.app','_blank')">
          Collaborez avec @${escapeHtml(d.username)}
        </button>
      </div>
    `;
  }
})();
