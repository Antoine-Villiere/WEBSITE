/* offer_request.js – Assistant IA : Contenu à demander (v1.4) */
(function () {
  /* ---------- CONFIG ---------- */
  const ROOT_ID          = 'offer-ai';
  const DEFAULT_CURRENCY = 'CHF';
  const SIGNUP_URL       = 'https://www.spottedge.app';

  const OFFER_REQUEST_MATRIX ={
    offer: [
      { min_value: 0,   max_value: 50,
        proposed: '1 Story sur Instagram ou 1 vidéo sur TikTok',
        options:  ['1 Story sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 51,  max_value: 120,
        proposed: '2 Stories sur Instagram ou 1 vidéo sur TikTok',
        options:  ['2 Stories sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 121, max_value: 250,
        proposed: '3 Stories ou 1 Carousel sur Instagram ou 1 vidéo sur TikTok',
        options:  ['3 Stories', '1 Carousel sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 251, max_value: 400,
        proposed: '1 Reel + 1 Story sur Instagram ou 1 vidéo sur TikTok',
        options:  ['1 Reel + 1 Story sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 401, max_value: 600,
        proposed: '1 Reel + 2 Stories sur Instagram ou 1 vidéo sur TikTok',
        options:  ['1 Reel + 2 Stories sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 601, max_value: Infinity,
        proposed: '1 Reel + 3 Stories sur Instagram ou 1 vidéo sur TikTok',
        options:  ['1 Reel + 3 Stories sur Instagram ou 1 vidéo sur TikTok'] }
    ]
  };

  /* ---------- THEME ---------- */
  const CSS = `
#${ROOT_ID}{font-family:Inter,system-ui;background:#fff;padding:2rem 1rem 2.5rem;max-width:640px;margin:2rem auto;border:1px solid #ececec;border-radius:20px;box-shadow:0 8px 20px rgba(0,0,0,.04)}
#${ROOT_ID} h1{margin:0 0 .5rem;font-size:1.75rem;font-weight:700;text-align:center;color:#102a43}
#${ROOT_ID} .subtitle{margin:0 0 1.5rem;text-align:center;font-size:.95rem;color:#4b5563}
label{display:block;margin-top:1.1rem;font-size:.9rem;color:#374151}
label.required::after{content:'*';color:#dc2626;margin-left:2px}
input{width:100%;padding:.6rem .75rem;margin-top:.4rem;border:1px solid #d1d5db;border-radius:10px;font:inherit;transition:border-color .2s,box-shadow .2s}
input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.2);outline:none}
button{margin-top:2rem;width:100%;padding:.85rem 1.2rem;font-size:1.05rem;border:0;border-radius:12px;background:#3b82f6;color:#fff;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,.35);transition:background .2s,transform .15s}
button:hover{background:#2563eb}
button:active{transform:translateY(1px)}
button:disabled{opacity:.6;cursor:default;box-shadow:none}
.idea-card{margin-top:1.6rem;padding:1.25rem 1rem;border-radius:14px;background:#f5f9ff;display:flex;gap:.9rem;box-shadow:0 2px 6px rgba(0,0,0,.05)}
.idea-card svg{flex:0 0 32px;fill:#3b82f6}
.idea-text{flex:1;font-size:.96rem;line-height:1.48}
.loader,.error{text-align:center;margin-top:1.6rem;font-style:italic;color:#6b7280}
.error{color:#dc2626;font-style:normal;font-weight:600}
`; injectCSS(CSS);

  /* ---------- UI ---------- */
  const root = document.getElementById(ROOT_ID);
  if (!root) { console.error(`#${ROOT_ID} introuvable`); return; }

  root.innerHTML = `
    <h1>Quel contenu demander à votre influenceur ?</h1>
    <p class="subtitle">Renseignez quelques infos pour obtenir une recommandation instantanée.</p>
    <form id="${ROOT_ID}-form">
    <label class="required">Quel est votre compte Instagram ?
        <input name="instagram" placeholder="@nom_du_compte" autocomplete="username" required>
      </label>
      <label class="required">Secteur d’activité
        <input name="secteur" placeholder="Ex. : Mode, FoodTech…" required>
      </label>
      <label class="required">Produit / service proposé
        <input name="entreprise_offer" placeholder="Ex. : Sneakers recyclées" required>
      </label>
      <label class="required">Devise
        <select name="currency" required>
          <option value="CHF" selected>CHF (franc suisse)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </label>
      <label class="required">Valeur de l’offre (<span class="currency">${DEFAULT_CURRENCY}</span>)
        <input name="offer_value" type="number" min="0" step="0.01" placeholder="Ex. : 125" required>
      </label>
      <button id="${ROOT_ID}-btn" type="submit">💡 Voir la recommandation</button>
    </form>
    <div id="${ROOT_ID}-out"></div>
  `;

  const form         = document.getElementById(`${ROOT_ID}-form`);
  const btn          = document.getElementById(`${ROOT_ID}-btn`);
  const out          = document.getElementById(`${ROOT_ID}-out`);
  const currencySpan = form.querySelector('.currency');
  form.querySelector('input[name="secteur"]').focus();

  /* -- MAJ du libellé devise -- */
  form.currency.addEventListener('change', () => {
    currencySpan.textContent = form.currency.value;
  });

  /* ---------- LOGIQUE PRINCIPALE ---------- */
  form.addEventListener('submit', evt => {
    evt.preventDefault();

    const secteur   = form.secteur.value.trim();
    const produit   = form.entreprise_offer.value.trim();
    const insta     = form.instagram.value.trim();
    const currency  = form.currency.value;
    const rawVal    = form.offer_value.value.trim().replace(',', '.');
    const value     = parseFloat(rawVal);

    out.innerHTML = '';
    if (!secteur || !produit || !insta || isNaN(value) || value < 0) {
      out.innerHTML = `<p class="error">Veuillez remplir tous les champs correctement.</p>`;
      return;
    }

    /* Loader */
    out.innerHTML = '<p class="loader">🤔 Réflexion en cours…</p>';
    btn.disabled = true;

    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const match = findMatch(value);
      if (!match) {
        out.innerHTML = `<p class="error">Aucun palier trouvé pour ${value}${currency}.</p>`;
        btn.disabled  = false;
        return;
      }

      out.innerHTML = renderCard(match, value, secteur, produit, insta, currency);

      /* CTA Spottedge */
      btn.textContent = '🚀 Lancer mon offre gratuitement';
      btn.type        = 'button';
      btn.disabled    = false;
      btn.onclick     = () => window.open(SIGNUP_URL, '_blank');
    }, delay);
  });

  /* ---------- Helpers ---------- */
  function findMatch(val) {
    return OFFER_REQUEST_MATRIX.offer.find(p => val >= p.min_value && val <= p.max_value);
  }

  function renderCard(item, val, secteur, produit, insta, currency) {
    return `
      <div class="idea-card">
        <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 2 2 6.5v11L12 22l10-4.5v-11L12 2Zm0 2.83 8 3.59v8.53L12 20.56 4 15.95V7.42l8-3.59Zm-4.5 7.17a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1Z"/></svg>
        <div class="idea-text">
          <strong>Secteur :</strong> ${escapeHTML(secteur)}<br>
          <strong>Offre :</strong> ${escapeHTML(produit)}<br>
          <strong>Instagram :</strong> ${escapeHTML(insta)}<br>
          <strong>Valeur de l’offre :</strong> ${val.toFixed(2)} ${currency}<br>
          <strong>Contenu recommandé :</strong> ${escapeHTML(item.proposed)}<br>
          <strong>Options détaillées :</strong>
          <ul style="margin:0.3rem 0 0 1.1rem;padding:0;">
            ${item.options.map(o => `<li>${escapeHTML(o)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  function injectCSS(str){
    const style = document.createElement('style');
    style.textContent = str;
    document.head.appendChild(style);
  }

  function escapeHTML(str){
    return ('' + str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
})();