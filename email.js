/* notify-insta.js – traque les widgets & envoie un email via SMTPJS */
(function () {
  /* ---------- CONFIG ---------- */
  const ROOT_IDS = ['hooks-ai', 'description-ai', 'ugc-ai', 'offer-ai'];

  /* Paramètres SMTP de Spottedge – à adapter si besoin */
  const SMTP_CONF = {
    Host    : 'smtp.spottedge.com',    // ou smtp.office365.com, smtp.gmail.com, etc.
    Username: 'antoine@spottedge.com',
    Password: 'Antoine1+',             // ← mot de passe en clair (risqué en prod)
    From    : 'antoine@spottedge.com',
    To      : 'antoine@spottedge.com'
  };

  /* ---------- INSTALL LISTENERS ---------- */
  window.addEventListener('DOMContentLoaded', () => {
    ROOT_IDS.forEach(rootId => {
      const form = document.querySelector(`#${rootId} form`);
      if (!form) return;                          // widget pas présent sur la page

      form.addEventListener('submit', () => {
        /* Le widget annule déjà le submit ; on se contente de récupérer la valeur */
        const handle = form.querySelector('input[name="instagram"]')?.value.trim();
        if (!handle) return;

        sendEmail(handle, rootId);
      });
    });
  });

  /* ---------- ENVOI EMAIL ---------- */
  function sendEmail(handle, source) {
    const cleanHandle = handle.replace(/\s+/g, '');
    const instaURL    = cleanHandle.startsWith('@')
        ? `https://instagram.com/${cleanHandle.slice(1)}`
        : `https://instagram.com/${cleanHandle}`;

    Email.send({
      ...SMTP_CONF,
      Subject : `Nouveau compte insta: ${cleanHandle}`,
      Body    : `${instaURL}<br><br>Source formulaire : ${source}`,
    })
    .then(() => console.log('Email Insta envoyé :', cleanHandle))
    .catch(err => console.error('Erreur envoi email :', err));
  }
})();