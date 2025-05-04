/* notify-insta.js – traque les widgets & envoie un email via SMTPJS + SecureToken */
(function () {
  const ROOT_IDS     = ['hooks-ai', 'description-ai', 'ugc-ai', 'offer-ai'];
  const SECURE_TOKEN = 'fcbc75b4-8f20-4745-99cf-e9aa883e5f7d'; // ← votre token

  window.addEventListener('DOMContentLoaded', () => {
    ROOT_IDS.forEach(id => {
      const form = document.querySelector(`#${id} form`);
      if (!form) return;

      form.addEventListener('submit', () => {
        const handle = form.querySelector('input[name="instagram"]')?.value.trim();
        if (!handle) return;
        sendEmail(handle, id);
      });
    });
  });

  function sendEmail(handle, source) {
    const clean    = handle.replace(/\s+/g, '').replace(/^@/, '');
    const instaURL = `https://instagram.com/${clean}`;

    Email.send({
      SecureToken: SECURE_TOKEN,
      To         : 'antoine@spottedge.app',
      From       : 'antoine@spottedge.app',
      Subject    : `Nouveau compte insta: @${clean}`,
      Body       : `
        <p>👤 Compte Instagram : @${clean}</p>
        <p>🔗 URL : <a href="${instaURL}" target="_blank">${instaURL}</a></p>
        <p>🛠 Formulaire source : ${source}</p>
      `
    })
    .then(response => console.log('SMTPJS response:', response))
    .catch(err => console.error('Erreur SMTPJS:', err));
  }
})();