     // script.js
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
  console.log('🔘 Bouton cliqué, user =', user);

  if (!user) {
    out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
    return;
  }

  out.innerHTML = '<p>Chargement…</p>';

  // Requête Supabase
  const { data, error } = await supabase
    .from('USERS')
    .select('customer_personna')
    .eq('instagram', user)
    .single();

  if (error) {
    console.error('❌ Erreur Supabase', error);
    out.innerHTML = `<p class="error">Erreur : ${error.message}</p>`;
    return;
  }
  if (!data || !data.customer_personna) {
    out.innerHTML = `<p class="error">Aucune donnée trouvée pour @${user}</p>`;
    return;
  }

  const persona = data.customer_personna;

  // Construction du HTML de présentation
  let html = `
    <p><strong>Âge</strong> : ${persona.AGE}</p>
    <p><strong>Genre</strong> : ${persona.GENDER}</p>
    <p><strong>Catégories</strong> :</p>
    <ul>
      ${persona.CATEGORY.map(cat => `<li>${cat}</li>`).join('')}
    </ul>
    <p><strong>Localisation</strong> : ${persona.LOCATION}</p>
    <p><strong>Followers</strong> : ${persona.FOLLOWERS.toLocaleString()}</p>
    <p><strong>Taux d’engagement</strong> : ${persona.ENGAGEMENT_RATE}%</p>
    <p><strong>Vues estimées</strong> : ${persona.ESTIMATED_VIEWS}</p>
    <p><strong>Coordonnées GPS</strong> :
      ${persona.LOCATION_COORDINATES
        .map(coord => `${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`)
        .join(' ; ')}
    </p>
  `;

  out.innerHTML = html;
});