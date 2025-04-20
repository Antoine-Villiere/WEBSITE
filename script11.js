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
  const btn = document.getElementById('check'),
        inp = document.getElementById('username'),
        out = document.getElementById('results'),
        WORKER = 'https://test.jeanbienso.workers.dev'

  btn.addEventListener('click', async () => {
    const user = inp.value.replace(/^@/, '').trim()
    if (!user) {
      out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>'
      return
    }
    out.innerHTML = '<p class="loading">Chargement…</p>'

    try {
      const resp = await fetch(`${WORKER}?username=${encodeURIComponent(user)}`)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const d = await resp.json()

      out.innerHTML = `
        <div class="profile-header">
          <img src="${d.profile_pic}" alt="${d.username}" class="profile-pic">
          <div class="profile-info">
            <h2>${d.full_name} <span class="username">@${d.username}</span></h2>
            <p class="bio">${d.biography}</p>
            <p class="category">Catégorie : <strong>${d.category || '–'}</strong></p>
          </div>
        </div>
        <div class="stats-grid">
          <div><span>${d.post_count.toLocaleString()}</span><small>Posts</small></div>
          <div><span>${d.followers.toLocaleString()}</span><small>Followers</small></div>
          <div><span>${d.following.toLocaleString()}</span><small>Following</small></div>
          <div><span>${d.avg_likes}</span><small>Likes/moy.</small></div>
          <div><span>${d.avg_comments}</span><small>Comments/moy.</small></div>
          <div><span>${d.posts_per_week}</span><small>Posts/Semaine</small></div>
          <div><span>${d.engagement_rate}%</span><small>Taux d’engagement</small></div>
        </div>
      `
    } catch (err) {
      out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`
    }
  })
})()
</script>

<style>
:root {
  --bg: #f2f4f7;
  --card: #ffffff;
  --accent-grad: linear-gradient(135deg,#ff5858,#f09819);
  --text: #333;
  --muted: #666;
  --shadow: rgba(0,0,0,0.08);
  --radius: 16px;
  --spacing: 1rem;
}

body {
  font-family: 'Roboto', sans-serif;
  background: var(--bg);
  padding: 2rem;
}

.proxy-card {
  max-width: 500px; margin: auto;
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px var(--shadow);
  padding: var(--spacing);
}

.proxy-card__title {
  font-size: 2rem;
  background: var(--accent-grad);
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: var(--spacing);
  text-align: center;
}

.proxy-card__input-group {
  display: flex;
  gap: .5rem;
  margin-bottom: var(--spacing);
}

.proxy-card__input {
  flex: 1;
  padding: .75rem 1rem;
  border: none;
  border-radius: 999px;
  box-shadow: inset 0 2px 6px var(--shadow);
  font-size: 1rem;
}

.proxy-card__button {
  padding: .75rem 1.5rem;
  border: none;
  border-radius: 999px;
  background: var(--accent-grad);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--shadow);
  transition: transform .1s;
}
.proxy-card__button:active {
  transform: scale(.97);
}

.proxy-card__results .loading {
  text-align: center;
  color: var(--muted);
}

.error {
  color: #d9534f;
  text-align: center;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing);
  margin-bottom: var(--spacing);
}

.profile-pic {
  width: 72px; height: 72px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px var(--shadow);
}

.profile-info h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text);
}
.profile-info .username {
  font-size: .9rem;
  color: var(--muted);
}
.profile-info .bio,
.profile-info .category {
  margin: .25rem 0;
  color: var(--muted);
  font-size: .9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: var(--spacing);
  text-align: center;
}
.stats-grid div {
  background: var(--bg);
  padding: .75rem;
  border-radius: var(--radius);
}
.stats-grid span {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text);
}
.stats-grid small {
  color: var(--muted);
  font-size: .8rem;
}
</style>