<script>
/* --- dropdown Outils gratuits --- */
(function(){
  const btn   = document.getElementById('tools-btn');
  const item  = btn?.parentElement;           // <li class="dropdown">
  if(!btn || !item) return;

  btn.addEventListener('click', e=>{
    e.stopPropagation();
    item.classList.toggle('open');
    item.querySelector('.dropdown-menu').style.display =
      item.classList.contains('open') ? 'block' : 'none';
  });

  /* ferme si clic à l'extérieur */
  document.addEventListener('click', e=>{
    if(!item.contains(e.target)){
      item.classList.remove('open');
      const menu=item.querySelector('.dropdown-menu');
      if(menu) menu.style.display='none';
    }
  });
})();
</script>
<script>
var burger   = document.getElementById('burger');
var navLinks = document.getElementById('nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });
}
</script>
<script>
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
</script>
<script src="https://cdn.jsdelivr.net/gh/Antoine-Villiere/WEBSITE@main/taux_engagement.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/Antoine-Villiere/WEBSITE@main/idee-description.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/Antoine-Villiere/WEBSITE@main/idee-hook.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/Antoine-Villiere/WEBSITE@main/idee-ugc.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/Antoine-Villiere/WEBSITE@main/contenuV2.js" defer></script>
<script>
  (function() {
    const btn       = document.getElementById('sticky-button');
    const panel     = document.getElementById('video-panel');
    const closeIcon = document.getElementById('video-close');
    const video     = panel.querySelector('video');

    // Fonction de pause
    function pauseVideo() {
      if (!video.paused) {
        video.pause();
      }
    }

    // Ouvre/ferme le panneau
    btn.addEventListener('click', () => {
      const isVisible = panel.style.display === 'block';
      panel.style.display = isVisible ? 'none' : 'block';
      if (isVisible) pauseVideo();
    });

    // Ferme + pause
    closeIcon.addEventListener('click', () => {
      panel.style.display = 'none';
      pauseVideo();
    });

    // Ferme si clic à l'extérieur
    document.addEventListener('click', e => {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.style.display = 'none';
        pauseVideo();
      }
    });

    // Pause quand on quitte l'onglet ou la fenêtre
    window.addEventListener('blur', pauseVideo);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseVideo();
    });
  })();
</script>