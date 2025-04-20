(async function() {
  // 1. Inject Bento‐style CSS
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bento-bg: #ffffff;
      --bento-accent1: #ff5858;
      --bento-accent2: #f09819;
      --bento-text: #333333;
      --bento-muted: #666666;
      --bento-radius: 12px;
      --bento-gap: 12px;
      --bento-shadow: 0 4px 16px rgba(0,0,0,0.1);
      --bento-transition: .2s ease-in-out;
    }
    .bento-card {
      max-width: 480px;
      margin: 2rem auto;
      padding: var(--bento-gap);
      background: var(--bento-bg);
      border-radius: var(--bento-radius);
      box-shadow: var(--bento-shadow);
      font-family: 'Segoe UI', sans-serif;
      color: var(--bento-text);
      display: grid;
      grid-template-rows: auto auto 1fr;
      row-gap: var(--bento-gap);
    }
    .bento-header {
      text-align: center;
      font-size: 1.75rem;
      background: linear-gradient(135deg, var(--bento-accent1), var(--bento-accent2));
      -webkit-background-clip: text;
      color: transparent;
      font-weight: bold;
    }
    .bento-input-group {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: var(--bento-gap);
    }
    .bento-input-group input {
      padding: .75rem 1rem;
      border: 1px solid #ddd;
      border-radius: var(--bento-radius);
      font-size: 1rem;
      transition: border-color var(--bento-transition);
    }
    .bento-input-group input:focus {
      outline: none;
      border-color: var(--bento-accent1);
    }
    .bento-input-group button {
      padding: .75rem 1.5rem;
      background: linear-gradient(135deg, var(--bento-accent1), var(--bento-accent2));
      border: none;
      border-radius: var(--bento-radius);
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      transition: transform var(--bento-transition);
    }
    .bento-input-group button:active {
      transform: scale(.97);
    }
    .bento-results {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--bento-gap);
    }
    .bento-loading,
    .bento-error {
      text-align: center;
      font-size: 1rem;
      color: var(--bento-muted);
    }
    .bento-error {
      color: #d9534f;
    }
    .bento-profile {
      display: flex;
      gap: var(--bento-gap);
      align-items: center;
    }
    .bento-profile img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: var(--bento-shadow);
    }
    .bento-profile .info {
      display: grid;
      row-gap: 4px;
    }
    .bento-profile .info h2 {
      margin: 0;
      font-size: 1.2rem;
    }
    .bento-profile .info .username {
      font-size: .9rem;
      color: var(--bento-muted);
    }
    .bento-stats-grid {
      display: grid;
      grid-template-columns: repeat(2,1fr);
      gap: var(--bento-gap);
    }
    .bento-stats-grid .stat {
      background: #f9f9f9;
      padding: var(--bento-gap);
      border-radius: var(--bento-radius);
      text-align: center;
    }
    .bento-stats-grid .stat span {
      display: block;
      font-size: 1.1rem;
      font-weight: bold;
    }
    .bento-stats-grid .stat small {
      display: block;
      color: var(--bento-muted);
      margin-top: 4px;
    }
  `;
  document.head.appendChild(style);

  // 2. Create Bento container
  const card = document.createElement('div');
  card.className = 'bento-card';
  document.body.appendChild(card);

  // 3. Header
  const header = document.createElement('div');
  header.className = 'bento-header';
  header.textContent = 'Vérifier l’engagement';
  card.appendChild(header);

  // 4. Input group
  const inputGroup = document.createElement('div');
  inputGroup.className = 'bento-input-group';
  const inp = document.createElement('input');
  inp.id = 'username';
  inp.placeholder = 'Entrez @username';
  const btn = document.createElement('button');
  btn.id = 'check';
  btn.textContent = 'Vérifier';
  inputGroup.appendChild(inp);
  inputGroup.appendChild(btn);
  card.appendChild(inputGroup);

  // 5. Results container
  const results = document.createElement('div');
  results.id = 'results';
  results.className = 'bento-results';
  card.appendChild(results);

  // 6. Click handler
  const WORKER = 'https://test.jeanbienso.workers.dev';
  btn.addEventListener('click', async () => {
    const user = inp.value.replace(/^@/, '').trim();
    results.innerHTML = '';
    if (!user) {
      results.innerHTML = '<p class="bento-error">Veuillez saisir un nom d’influenceur.</p>';
      return;
    }
    results.innerHTML = '<p class="bento-loading">Chargement…</p>';

    try {
      const resp = await fetch(`${WORKER}?username=${encodeURIComponent(user)}`);
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Status ${resp.status}: ${errText}`);
      }
      const ct = resp.headers.get('Content-Type') || '';
      if (!ct.includes('application/json')) {
        const text = await resp.text();
        throw new Error(`Réponse non JSON : ${text.substr(0,200)}`);
      }
      const d = await resp.json();

      // Build profile section
      results.innerHTML = '';
      const prof = document.createElement('div');
      prof.className = 'bento-profile';
      const img = document.createElement('img');
      img.src = d.profile_pic_url;
      img.alt = d.username;
      const info = document.createElement('div');
      info.className = 'info';
      info.innerHTML = `
        <h2>${d.full_name}</h2>
        <div class="username">@${d.username}</div>
        <div class="bio">${d.biography || ''}</div>
        <div class="category"><small>Catégorie : ${d.category || '–'}</small></div>
      `;
      prof.appendChild(img);
      prof.appendChild(info);
      results.appendChild(prof);

      // Build stats grid
      const grid = document.createElement('div');
      grid.className = 'bento-stats-grid';
      const stats = [
        { label: 'Posts',        value: d.post_count.toLocaleString() },
        { label: 'Followers',    value: d.followers.toLocaleString() },
        { label: 'Following',    value: d.following.toLocaleString() },
        { label: 'Likes/moy.',   value: d.avg_likes },
        { label: 'Comms/moy.',   value: d.avg_comments },
        { label: 'Views/moy.',   value: d.avg_views },
        { label: 'Posts/Semaine',value: d.posts_per_week },
        { label: 'Engagement %', value: `${d.engagement_rate}%` }
      ];
      stats.forEach(s => {
        const cell = document.createElement('div');
        cell.className = 'stat';
        cell.innerHTML = `<span>${s.value}</span><small>${s.label}</small>`;
        grid.appendChild(cell);
      });
      results.appendChild(grid);
    } catch (err) {
      results.innerHTML = `<p class="bento-error">Erreur : ${err.message}</p>`;
      console.error(err);
    }
  });
})();