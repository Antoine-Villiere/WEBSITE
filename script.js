// --- Burger menu ---
var burger   = document.getElementById('burger');
var navLinks = document.getElementById('nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });
}

// --- Chargement des frames au clic ---
var frameItems = document.querySelectorAll('.frame-item');
for (var i = 0; i < frameItems.length; i++) {
  (function(item) {
    item.addEventListener('click', function() {
      var url = item.getAttribute('data-url');
      if (!url) return;
      var container = item.querySelector('.inside-border');
      if (container) {
        container.innerHTML =
          '<iframe src="' + url +
          '" width="100%" height="100%" frameborder="0" allowfullscreen style="display:block;"></iframe>';
      }
    });
  })(frameItems[i]);
}

// --- Proxy Modash & extraction des stats ---
window.addEventListener('load', function() {
  var btn    = document.getElementById('check');
  var inp    = document.getElementById('username');
  var out    = document.getElementById('results');
  var worker = 'https://test.jeanbienso.workers.dev';

  if (!btn || !inp || !out) return;

  btn.addEventListener('click', function() {
    var user = inp.value.replace(/^@/, '').trim();
    if (!user) {
      out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
      return;
    }
    out.innerHTML = '<p>Chargement…</p>';

    // Construire l’URL Modash + proxy
    var modashUrl =
      'https://www.modash.io/engagement-rate-calculator?influencer=%40'
      + encodeURIComponent(user);
    var proxyUrl = worker + '?url=' + encodeURIComponent(modashUrl);

    // Requête XHR simple
    var xhr = new XMLHttpRequest();
    xhr.open('GET', proxyUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        // Parse HTML renvoyé
        var parser = new DOMParser();
        var doc    = parser.parseFromString(xhr.responseText, 'text/html');

        // Clés à extraire
        var keys = [
          'Engagement rate',
          'Average comments',
          'Average likes',
          'Average Reel plays'
        ];
        var html = '';
        // Récupération des cartes
        var cards = doc.querySelectorAll("div[class*='_cardName']");
        for (var k = 0; k < keys.length; k++) {
          var key   = keys[k];
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
        out.innerHTML = html;
      } else {
        out.innerHTML = '<p class="error">Erreur : ' + xhr.status + '</p>';
      }
    };
    xhr.send();
  });
});
