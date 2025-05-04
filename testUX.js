/* offer_request.js – Assistant IA : Contenu à demander (v2.0) */
(function () {
  /* ---------- CONFIG ---------- */
  const ROOT_ID          = 'offer-ai';
  const DEFAULT_CURRENCY = 'CHF';
  const SIGNUP_URL       = 'https://www.spottedge.app';

  const OFFER_REQUEST_MATRIX = {
    offer: [
      { min_value:   0, max_value:  50, proposed: '1 Story sur Instagram ou 1 vidéo sur TikTok', options: ['1 Story sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value:  51, max_value: 120, proposed: '2 Stories sur Instagram ou 1 vidéo sur TikTok', options: ['2 Stories sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 121, max_value: 250, proposed: '3 Stories ou 1 Carousel sur Instagram ou 1 vidéo sur TikTok', options: ['3 Stories', '1 Carousel sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 251, max_value: 400, proposed: '1 Reel + 1 Story sur Instagram ou 1 vidéo sur TikTok', options: ['1 Reel + 1 Story sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 401, max_value: 600, proposed: '1 Reel + 2 Stories sur Instagram ou 1 vidéo sur TikTok', options: ['1 Reel + 2 Stories sur Instagram ou 1 vidéo sur TikTok'] },
      { min_value: 601, max_value: Infinity, proposed: '1 Reel + 3 Stories sur Instagram ou 1 vidéo sur TikTok', options: ['1 Reel + 3 Stories sur Instagram ou 1 vidéo sur TikTok'] }
    ]
  };

  /* ---------- THEME & VARIABLES ---------- */
  const CSS = `
:root {
  /* Typographie */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;

  /* Couleurs */
  --color-bg: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e2e8f0;
  --color-primary: #1d4ed8;
  --color-primary-hover: #1e40af;
  --color-text: #1f2937;
  --color-text-muted: #4b5563;
  --color-error: #dc2626;

  /* Rayons & ombres */
  --radius-default: 0.75rem;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
  --transition: 0.2s ease-in-out;
}

#${ROOT_ID} {
  font-family: var(--font-sans);
  background: var(--color-surface);
  padding: 1.5rem;
  max-width: 600px;
  margin: 2rem auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-md);
  color: var(--color-text);
}

#${ROOT_ID} h1 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-primary-hover);
}

#${ROOT_ID} .subtitle {
  margin: 0 0 1.5rem;
  text-align: center;
  font-size: 1rem;
  color: var(--color-text-muted);
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: var(--color-text);
}
label.required::after {
  content: '*';
  color: var(--color-error);
  margin-left: 4px;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.25rem;
  font: inherit;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-default);
  transition: border-color var(--transition), box-shadow var(--transition);
}
input:focus, select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(29,78,216,0.2);
  outline: none;
}

button {
  display: block;
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-default);
  box-shadow: 0 4px 12px rgba(29,78,216,0.25);
  cursor: pointer;
  transition: background var(--transition), transform var(--transition);
}
button:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}
button:active {
  transform: translateY(0);
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.idea-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-sm);
  margin-top: 1.5rem;
}
.idea-card svg {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  fill: var(--color-primary);
}
.idea-text {
  font-size: 0.95rem;
  line-height: 1.5;
}
.idea-text strong {
  color: var(--color-primary);
}

.loader {
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  margin-top: 1.5rem;
}
.spinner {
  animation: spin 1s linear infinite;
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
  stroke: var(--color-primary);
  stroke-width: 4;
  fill: none;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: var(--color-error);
  font-weight: 600;
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 480px) {
  #${ROOT_ID} {
    padding: 1rem;
    margin: 1rem;
  }
  #${ROOT_ID} h1 {
    font-size: 1.25rem;
  }
  button {
    font-size: 0.95rem;
  }
}

:focus-visible {
  outline: 2px dashed var(--color-primary);
  outline-offset: 2px;
}
`; injectCSS(CSS);

  /* ---------- UI ---------- */
  const root = document.getElementById(ROOT_ID);
  if (!root) { console.error(`#${ROOT_ID} introuvable`); return; }

  root.innerHTML = `
    <h1>Quel contenu demander à votre influenceur ?</h1>
    <p class="subtitle">Renseignez quelques infos pour obtenir une recommandation instantanée.</p>
    <form id="${ROOT_ID}-form">
      <label class="required">Quel est votre compte Instagram ?
        <input name="instagram" placeholder="@nom_du_compte" autocomplete="username" required>
      </label>
      <label class="required">Secteur d’activité
        <input name="secteur" placeholder="Ex. : Mode, FoodTech…" required>
      </label>
      <label class="required">Produit / service proposé
        <input name="entreprise_offer" placeholder="Ex. : Sneakers recyclées" required>
      </label>
      <label class="required">Devise
        <select name="currency" required>
          <option value="CHF" selected>CHF (franc suisse)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </label>
      <label class="required">Valeur de l’offre (<span class="currency">${DEFAULT_CURRENCY}</span>)
        <input name="offer_value" type="number" min="0" step="0.01" placeholder="Ex. : 125" required>
      </label>
      <button id="${ROOT_ID}-btn" type="submit">💡 Voir la recommandation</button>
    </form>
    <div id="${ROOT_ID}-out"></div>
  `;

  /* ---------- LOGIQUE PRINCIPALE ---------- */
  const form         = document.getElementById(`${ROOT_ID}-form`);
  const btn          = document.getElementById(`${ROOT_ID}-btn`);
  const out          = document.getElementById(`${ROOT_ID}-out`);
  const currencySpan = form.querySelector('.currency');
  form.querySelector('input[name="secteur"]').focus();

  // Mise à jour du label devise
  form.currency.addEventListener('change', () => {
    currencySpan.textContent = form.currency.value;
  });

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

    // Loader animé
    out.innerHTML = `
      <div class="loader">
        <svg class="spinner" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"/></svg>
        <span>Génération en cours…</span>
      </div>
    `;
    btn.disabled = true;

    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const match = findMatch(value);
      if (!match) {
        out.innerHTML = `<p class="error">Aucun palier trouvé pour ${value.toFixed(2)} ${currency}.</p>`;
        btn.disabled  = false;
        return;
      }

      out.innerHTML = renderCard(match, value, secteur, produit, insta, currency);

      // CTA Spottedge
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
        <svg viewBox="0 0 24 24"><path d="M12 2 2 6.5v11L12 22l10-4.5v-11L12 2Zm0 2.83 8 3.59v8.53L12 20.56 4 15.95V7.42l8-3.59Zm-4.5 7.17a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1Z"/></svg>
        <div class="idea-text">
          <strong>Secteur :</strong> ${escapeHTML(secteur)}<br>
          <strong>Offre :</strong> ${escapeHTML(produit)}<br>
          <strong>Instagram :</strong> ${escapeHTML(insta)}<br>
          <strong>Valeur de l’offre :</strong> ${val.toFixed(2)} ${currency}<br>
          <strong>Contenu recommandé :</strong> ${escapeHTML(item.proposed)}<br>
          <strong>Options :</strong>
          <ul style="margin:0.3rem 0 0 1.1rem;padding:0;">
            ${item.options.map(o => `<li>${escapeHTML(o)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  function injectCSS(str) {
    const style = document.createElement('style');
    style.textContent = str;
    document.head.appendChild(style);
  }

  function escapeHTML(str) {
    return ('' + str).replace(/[&<>'"]/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }
})();