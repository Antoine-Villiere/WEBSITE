// Remplacez les valeurs par les vôtres
const params = {
  Host    : 's1.maildns.net',
  Username: 'AKIAU72LF7JNEZR56T6V',       // votre SMTP Username SES
  Password: 'BFR0JVdh0uiXnvubrmmzcRRpqZN4uv6ijWngHP0QrL0O',     // votre Password SES
  Secure  : 'true',                   // STARTTLS
  Port    : '587',                    // ou 465
  From    : 'antoine@spottedge.com',  // adresse vérifiée
  To      : 'antoine@spottedge.com'   // même destination
};

fetch('https://smtpjs.com/v3/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(params)
})
  .then(res => res.text())
  .then(token => {
    console.log('Votre SecureToken généré :', token);
    // Copiez ce token dans votre notify-insta.js
  })
  .catch(console.error);