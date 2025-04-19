;(function() {
  console.log('✅ script.js chargé et exécuté');

  const btn    = document.getElementById('check'),
        inp    = document.getElementById('username'),
        out    = document.getElementById('results'),
        WORKER = 'https://test.jeanbienso.workers.dev';

  if (!btn || !inp || !out) {
    console.error('❌ Élément manquant', { btn, inp, out });
    return;
  }

  btn.addEventListener('click', function() {
    const user = inp.value.replace(/^@/, '').trim();
    console.log('🔘 Bouton cliqué, user =', user);

    if (!user) {
      out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
      return;
    }

    out.innerHTML = '<p>Chargement…</p>';

    // ↦ URL NinjaOutreach
    const ninjaUrl = `https://ninjaoutreach.com/${encodeURIComponent(user)}`,
          proxyUrl = `${WORKER}?url=${encodeURIComponent(ninjaUrl)}`;

    console.log('📡 Appel proxy à :', proxyUrl);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', proxyUrl, true);
    xhr.onload = function() {
      console.log('⏱️ XHR terminé, status =', xhr.status);
      if (xhr.status !== 200) {
        out.innerHTML = `<p class="error">Erreur HTTP : ${xhr.status}</p>`;
        return;
      }

      // Parse le HTML renvoyé
      const parser = new DOMParser(),
            doc    = parser.parseFromString(xhr.responseText, 'text/html');

      // 1) Boîtes stats (Avg likes, Avg replies…)
      const stats = {};
      doc.querySelectorAll('.profile_box').forEach(box => {
        const keyEl = box.querySelector('.box_title'),
              valEl = box.querySelector('.box_value');
        if (keyEl && valEl) {
          const key = keyEl.textContent.trim(),
                val = valEl.textContent.trim();
          stats[key] = val;
        }
      });

      // 2) Compteurs en haut (Posts / Followers / Following)
      const topMap = {
        'Posts':      '.profile_posts',
        'Followers':  '.profile_followers',
        'Following':  '.profile_following'
      };
      Object.entries(topMap).forEach(([label, sel]) => {
        const el = doc.querySelector(sel);
        if (el) stats[label] = el.textContent.trim();
      });

      // Génère le HTML de sortie
      let html = '';
      Object.entries(stats).forEach(([k, v]) => {
        html += `<p><strong>${k}</strong> : ${v}</p>`;
      });

      console.log('✅ Stats extraites', stats);
      out.innerHTML = html;
    };

    xhr.onerror = function() {
      console.error('❌ Erreur réseau XHR');
      out.innerHTML = '<p class="error">Erreur réseau</p>';
    };

    xhr.send();
  });
})();