;(function() {
  console.log('✅ script.js chargé et exécuté');

  var btn = document.getElementById('check'),
      inp = document.getElementById('username'),
      out = document.getElementById('results'),
      worker = 'https://test.jeanbienso.workers.dev';

  if (!btn || !inp || !out) {
    console.error('❌ Élément manquant', { btn, inp, out });
    return;
  }

  btn.addEventListener('click', function() {
    var user = inp.value.replace(/^@/, '').trim();
    console.log('🔘 Clic Vérifier, user :', user);

    if (!user) {
      out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
      return;
    }

    out.innerHTML = '<p>Chargement…</p>';

    var modashUrl =
      'https://www.modash.io/engagement-rate-calculator?influencer=%40'
      + encodeURIComponent(user);
    var proxyUrl = worker + '?url=' + encodeURIComponent(modashUrl);

    console.log('📡 Appel proxy à :', proxyUrl);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', proxyUrl, true);

    xhr.onload = function() {
      console.log('⏱️ XHR terminé, status :', xhr.status);
      if (xhr.status === 200) {
        // Affiche le HTML complet renvoyé
        console.log('📄 HTML brut :', xhr.responseText);                  :contentReference[oaicite:0]{index=0}
        // Utilisez textContent pour éviter que le navigateur ne tente d'exécuter du HTML
        out.textContent = xhr.responseText;                             :contentReference[oaicite:1]{index=1}
      } else {
        out.innerHTML = '<p class="error">Erreur HTTP : ' + xhr.status + '</p>';
      }
    };

    xhr.onerror = function() {
      console.error('❌ Erreur réseau XHR');
      out.innerHTML = '<p class="error">Erreur réseau</p>';
    };

    xhr.send();
  });
})();
