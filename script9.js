// script.js
(async function() {
  console.log('✅ script.js chargé et exécuté');

  const btn = document.getElementById('check'),
        inp = document.getElementById('username'),
        out = document.getElementById('results');

  if (!btn || !inp || !out) {
    console.error('❌ Élément manquant', { btn, inp, out });
    return;
  }

  btn.addEventListener('click', async () => {
    const user = inp.value.replace(/^@/, '').trim();
    if (!user) {
      out.innerHTML = `<p class="error">Veuillez saisir un nom d’influenceur.</p>`;
      return;
    }
    out.innerHTML = `<p>Chargement…</p>`;

    try {
      // 1) On récupère le JSON public du profil
      const profileResp = await fetch(
        `https://www.instagram.com/${user}/?__a=1&__d=dis`
      );
      if (!profileResp.ok) throw new Error(`Profil introuvable (${profileResp.status})`);
      const profileJson = await profileResp.json();
      const u = profileJson.graphql.user;

      // Extraire les infos principales
      const followers      = u.edge_followed_by.count;
      const profilePic     = u.profile_pic_url_hd || u.profile_pic_url;
      const description    = u.biography || '–';
      // Instagram ne fournit pas de champ « location » dédié, on l’indique si présent dans la bio
      const location       = u.business_address_json
                              ? JSON.parse(u.business_address_json).city + ', ' +
                                JSON.parse(u.business_address_json).country_code
                              : '–';

      // 2) Récupérer les 6 derniers posts et calculer le taux d’engagement moyen
      //    On utilise la même page JSON qui embed les posts
      const posts = profileJson.graphql.user
                    .edge_owner_to_timeline_media.edges
                    .slice(0, 6)
                    .map(e => e.node);
      const engagementRate = (
        posts.reduce((sum, p) => sum + p.edge_liked_by.count + p.edge_media_to_comment.count, 0)
        / posts.length
        / followers
        * 100
      ).toFixed(2);

      // 3) Construction du HTML de sortie (hyper‑design « Bento »)
      out.innerHTML = `
        <div style="
          display: grid;
          grid-template-columns: 80px auto;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          border-radius: .5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,.1);
        ">
          <img src="${profilePic}" alt="Photo de ${user}"
               style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;">
          <div>
            <p><strong>${user}</strong></p>
            <p style="margin: .25rem 0; color: #555;">${description}</p>
            <p style="font-size: .9rem; color: #777;">📍 ${location}</p>
          </div>
        </div>
        <div style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          text-align: center;
          margin-top: 1rem;
          gap: .5rem;
        ">
          <div style="padding: .5rem; background: #fafafa; border-radius: .5rem;">
            <p style="margin:0; font-size: .8rem; color:#777">Followers</p>
            <p style="margin:.25rem 0; font-weight:bold;">${followers.toLocaleString()}</p>
          </div>
          <div style="padding: .5rem; background: #fafafa; border-radius: .5rem;">
            <p style="margin:0; font-size: .8rem; color:#777">Engagement</p>
            <p style="margin:.25rem 0; font-weight:bold;">${engagementRate}%</p>
          </div>
          <div style="padding: .5rem; background: #fafafa; border-radius: .5rem;">
            <p style="margin:0; font-size: .8rem; color:#777">Derniers posts</p>
            <p style="margin:.25rem 0; font-weight:bold;">${posts.length}</p>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      out.innerHTML = `<p class="error">Oups, les données de cet influenceur ne sont pas (encore) disponibles, revenez prochainement.</p>`;
    }
  });
})();