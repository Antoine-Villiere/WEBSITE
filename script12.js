(async function() {
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

          out.innerHTML = `
            <div class="profile-header">
              <img src="${d.profile_pic_url}" alt="${d.username}" class="profile-pic">
              <div class="profile-info">
                <h2>${d.full_name} <span class="username">@${d.username}</span></h2>
                <p class="bio">${d.biography || ''}</p>
                <p class="category">Catégorie : <strong>${d.category || '–'}</strong></p>
              </div>
            </div>
            <div class="stats-grid">
              <div><span>${d.post_count.toLocaleString()}</span><small>Posts</small></div>
              <div><span>${d.followers.toLocaleString()}</span><small>Followers</small></div>
              <div><span>${d.following.toLocaleString()}</span><small>Following</small></div>
              <div><span>${d.avg_likes}</span><small>Likes/moy.</small></div>
              <div><span>${d.avg_comments}</span><small>Comments/moy.</small></div>
              <div><span>${d.avg_views}</span><small>Views/moy.</small></div>
              <div><span>${d.posts_per_week}</span><small>Posts/Semaine</small></div>
              <div><span>${d.engagement_rate}%</span><small>Engagement</small></div>
            </div>
          `;
        } catch (err) {
          console.error(err);
          out.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
        }
      });
    })();