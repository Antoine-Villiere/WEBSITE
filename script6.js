// script.js
// → charger avec <script type="module" src="script.js"></script>
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://zfhymdqdybuitsrzjmrb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaHltZHFkeWJ1aXRzcnpqbXJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjUwMjEwNywiZXhwIjoyMDQyMDc4MTA3fQ.x7NimQ4pw2e2wLhSq79SKjAOUNfqKvxw7-mNJBkO88w';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ script.js chargé et exécuté');

const btn = document.getElementById('check');
const inp = document.getElementById('username');
const out = document.getElementById('results');

if (!btn || !inp || !out) {
  console.error('❌ Élément manquant', { btn, inp, out });
  throw new Error('Elements manquants');
}

btn.addEventListener('click', async () => {
  const user = inp.value.replace(/^@/, '').trim();
  if (!user) {
    out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
    return;
  }

  out.innerHTML = '<p>Chargement…</p>';

  // → on récupère profile pic + persona + data
  const { data, error } = await supabase
    .from('USERS')
    .select('PROFILE_PICTURE,CUSTOMER_PERSONA,INFLUENCER_DATA')
    .eq('INSTAGRAM', user)
    .single();

  if (error) {
    const msg = error.message.includes('JSON object requested')
      ? 'Oups, les data de cet influenceur ne sont pas encore disponibles, revenez prochainement.'
      : `Erreur : ${error.message}`;
    out.innerHTML = `<p class="error">${msg}</p>`;
    return;
  }
  if (!data) {
    out.innerHTML = `<p class="error">Aucune donnée trouvée pour @${user}</p>`;
    return;
  }

  const pic     = data.PROFILE_PICTURE;
  const persona = data.CUSTOMER_PERSONA;
  const info    = data.INFLUENCER_DATA;

  // → construction de la carte bento
  out.innerHTML = `
  <div style="
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      padding: 16px;
      max-width: 600px;
    ">
    <img
      src="${pic}"
      alt="${user}"
      style="
        width: 96px;
        height: 96px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 16px;
      "
    />
    <div style="flex: 1;">
      <div style="display: flex; gap: 12px; margin-bottom: 12px;">
        <div style="
            flex:1;
            background: #f9f9f9;
            border-radius: 8px;
            padding: 12px;
            text-align:center;
          ">
          <div style="font-size: 13px; color: #666;">Followers</div>
          <div style="font-size: 18px; font-weight: bold;">
            ${persona.FOLLOWERS.toLocaleString()}
          </div>
        </div>
        <div style="
            flex:1;
            background: #f9f9f9;
            border-radius: 8px;
            padding: 12px;
            text-align:center;
          ">
          <div style="font-size: 13px; color: #666;">Engagement</div>
          <div style="font-size: 18px; font-weight: bold;">
            ${persona.ENGAGEMENT_RATE}%
          </div>
        </div>
      </div>
      <div style="margin-bottom: 12px;">
        <div style="font-size: 13px; color: #666; margin-bottom: 4px;">Catégories</div>
        ${
          Array.isArray(persona.CATEGORY) && persona.CATEGORY.length
            ? persona.CATEGORY
                .map(cat => `
                  <span style="
                    display:inline-block;
                    background:#e0f7fa;
                    color:#00796b;
                    border-radius:12px;
                    padding:4px 8px;
                    margin:0 6px 6px 0;
                    font-size:12px;
                  ">${cat}</span>
                `).join('')
            : '<span style="font-size:12px; color:#999;">Aucune catégorie</span>'
        }
      </div>
      <div>
        <div style="font-size: 13px; color: #666; margin-bottom: 4px;">Localisation</div>
        <div style="font-size: 15px; font-weight: 500; color: #333;">
          ${info.location||'–'}
        </div>
      </div>
    </div>
  </div>
  `;
});