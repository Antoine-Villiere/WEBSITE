// emailjs-insta-notifier.js
(function() {
  // 1) Charger dynamiquement le SDK EmailJS
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = initEmailJS;
  document.head.appendChild(script);

  function initEmailJS() {
    // 2) Initialiser avec votre Public Key (depuis EmailJS > Account)
    emailjs.init('DY6g5l4K0kxjAMeTf');

    // 3) Vos IDs (depuis EmailJS > Services et Templates)
    const SERVICE_ID  = 'service_6f3f6au';
    const TEMPLATE_ID = 'template_xz5edi7';

    // 4) Fonction d’envoi
    function sendInstagramEmail(instaHandle) {
      return emailjs
        .send(SERVICE_ID, TEMPLATE_ID, { instagram: instaHandle })
        .then(res => {
          console.log('✅ Email Instagram envoyé', res.status, res.text);
        })
        .catch(err => {
          console.error('❌ Échec EmailJS', err);
        });
    }

    // 5) Identifiants de vos 4 formulaires (à adapter si besoin)
    const FORM_IDS = [
      'idee-ugc-form',
      'idee-hook-form',
      'idee-description-form',
      'idee-contenu-form'
    ];

    // 6) On “écoute” chaque submit et on envoie le mail
    FORM_IDS.forEach(id => {
      const form = document.getElementById(id);
      if (!form) return;
      form.addEventListener('submit', evt => {
        // on ne preventDefault() pas pour laisser tourner la logique de génération existante
        const inp = form.querySelector('input[name="instagram"]');
        if (!inp) return;
        const handle = inp.value.trim();
        if (handle) sendInstagramEmail(handle);
      });
    });
  }
})();