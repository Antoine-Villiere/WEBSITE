;(function() {
  // Log de chargement
  console.log('✅ script.js chargé et exécuté');

  // Récupération des éléments
  var btn    = document.getElementById('check');
  var inp    = document.getElementById('username');
  var out    = document.getElementById('results');
  var worker = 'https://test.jeanbienso.workers.dev';

  if (!btn || !inp || !out) {
    console.error('❌ Un ou plusieurs éléments manquent :', { btn, inp, out });
    return;
  }

  // Gestion du clic sur “Vérifier”
  btn.addEventListener('click', function() {
    var user = inp.value.replace(/^@/, '').trim();
    console.log('🔘 Bouton cliqué, username :', user);

    if (!user) {
      out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
      return;
    }

    out.innerHTML = '<p>Chargement…</p>';

    // Construction de l’URL Modash + proxy
    var modashUrl = 
      'https://www.modash.io/engagement-rate-calculator?influencer=%40' 
      + encodeURIComponent(user);
    var proxyUrl = worker + '?url=' + encodeURIComponent(modashUrl);

    console.log('📡 Appel proxy vers :', proxyUrl);

    // XHR pour éviter le fetch bloqué
    var xhr = new XMLHttpRequest();
    xhr.open('GET', proxyUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;

      console.log('⏱️ XHR terminé, status :', xhr.status);
      if (xhr.status === 200) {
        // Parsing du HTML retourné
        var parser = new DOMParser();
        var doc    = parser.parseFromString(xhr.responseText, 'text/html');
        console.log('🔍 HTML brut reçu :', doc);

        // Clés à extraire
        var keys = [
          'Engagement rate', 
          'Average comments', 
          'Average likes', 
          'Average Reel plays'
        ];
        var html = '';
        var cards = doc.querySelectorAll("div[class*='_cardName']");
        console.log('📦 Nombre de cartes trouvées :', cards.length);

        // Extraction des valeurs
        for (var i = 0; i < keys.length; i++) {
          var key   = keys[i];
          var value = '–';
          for (var j = 0; j < cards.length; j++) {
            if (cards[j].textContent.trim() === key) {
              var valEl = cards[j]
                .parentNode
                .querySelector("div[class*='_cardValue']");
              if (valEl) value = valEl.textContent.trim();
              break;
            }
          }
          html += '<p>' + key + ' : ' + value + '</p>';
        }

        console.log('✅ Stats extraites :', html);
        out.innerHTML = html;

      } else {
        out.innerHTML = '<p class="error">Erreur lors du chargement (code : ' 
                        + xhr.status + ')</p>';
      }
    };

    xhr.onerror = function() {
      console.error('❌ Erreur réseau avec XHR');
      out.innerHTML = '<p class="error">Erreur réseau</p>';
    };

    xhr.send();
  });
})();
