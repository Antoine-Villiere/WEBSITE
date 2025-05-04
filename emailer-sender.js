// emailjs-insta-forwarder.js
(function() {
  // 1) Injection dynamique du SDK EmailJS v4
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = initEmailJS;
  document.head.appendChild(s);

  function initEmailJS() {
    // 2) Initialisation avec votre Public Key (EmailJS → Account)
    emailjs.init('DY6g5l4K0kxjAMeTf');

    // 3) Vos identifiants Service & Template (EmailJS → Services, Templates)
    const SERVICE_ID  = 'service_6f3f6au';
    const TEMPLATE_ID = 'template_xz5edi7';

    // 4) Fonction d’envoi
    function sendInstagramEmail(instaHandle) {
      return emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          instagram: instaHandle,
          to_email: 'antoine@spottedge.app'
        }
      )
      .then(res => console.log('✅ Email envoyé', res.status, res.text))
      .catch(err => console.error('❌ Échec envoi EmailJS', err));
    }

    // 5) Liste des 4 formulaires à « hooker »
    const FORM_IDS = [
      'ugc-ai-form',         // Idées UGC idee-ugc.js](file-service://file-J2UBgbGpquUNyxu6CsbGnq)
      'hooks-ai-form',       // Hooks marketing idee-hook.js](file-service://file-ANeKBeZou3quFov3N7VSxy)
      'description-ai-form', // Descriptions idee-description.js](file-service://file-Vi4gTL4gf7JHD4gaARGSZc)
      'offer-ai-form'        // Contenu à demander dee-contenu.js](file-service://file-X8LPm8f4RS2fejh9tjsZtZ)
    ];

    // 6) On attache un listener « submit » à chacun
    FORM_IDS.forEach(formId => {
      const form = document.getElementById(formId);
      if (!form) return;
      form.addEventListener('submit', evt => {
        // Ne pas preventDefault() : on laisse tourner la logique existante
        const inp = form.querySelector('input[name="instagram"]');
        if (inp) {
          const handle = inp.value.trim();
          if (handle) sendInstagramEmail(handle);
        }
      });
    });
  }
})();