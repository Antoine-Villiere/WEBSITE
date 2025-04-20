// script.js
// → charger avec <script type="module" src="script.js"></script>
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://zfhymdqdybuitsrzjmrb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaHltZHFkeWJ1aXRzcnpqbXJiIiwicm9sZSI6InNlcnZpY2VjZSIsImlhdCI6MTcyNjUwMjEwNywiZXhwIjoyMDQyMDc4MTA3fQ.x7NimQ4pw2e2wLhSq79SKjAOUNfqKvxw7-mNJBkO88w';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ script.js chargé et exécuté');

document.addEventListener('DOMContentLoaded', () => {
  // Crée et injecte le formulaire de saisie
  const root = document.getElementById('results');
  root.innerHTML = `
    <div id="bento-card" style="max-width:700px;margin:2rem auto;font-family:sans-serif;">
      <div style="display:flex;justify-content:center;margin-bottom:1rem;">
        <input id="username" placeholder="Entrez @username"
               style="flex:1;padding:.75rem 1rem;border:1px solid #ccc;border-radius:999px;outline:none;
                      box-shadow:inset 0 2px 8px rgba(0,0,0,0.05);font-size:1rem;" />
        <button id="check"
                style="margin-left:.5rem;padding:.75rem 1.5rem;border:none;border-radius:999px;
                       background:linear-gradient(135deg,#ff5858,#f09819);color:#fff;
                       font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.1);
                       transition:transform .1s;">Vérifier</button>
      </div>
      <div id="bento-content"></div>
    </div>
  `;

  const btn = document.getElementById('check');
  const inp = document.getElementById('username');
  const out = document.getElementById('bento-content');

  btn.addEventListener('click', async () => {
    const user = inp.value.replace(/^@/, '').trim();
    if (!user) {
      out.innerHTML = `<p style="color:#d9534f;text-align:center;">Veuillez saisir un nom d’influenceur.</p>`;
      return;
    }
    out.innerHTML = `<p style="text-align:center;color:#666;">Chargement…</p>`;

    // → requête Supabase
    const { data, error } = await supabase
      .from('USERS')
      .select('PROFILE_PICTURE,CUSTOMER_PERSONA,INFLUENCER_DATA')
      .eq('INSTAGRAM', user)
      .single();

    if (error) {
      const msg = error.message.includes('JSON')
        ? 'Données pas encore disponibles, revenez bientôt.'
        : `Erreur : ${error.message}`;
      out.innerHTML = `<p style="color:#d9534f;text-align:center;">${msg}</p>`;
      return;
    }
    if (!data) {
      out.innerHTML = `<p style="color:#d9534f;text-align:center;">Aucune donnée pour @${user}</p>`;
      return;
    }

    const pic     = data.PROFILE_PICTURE;
    const persona = data.CUSTOMER_PERSONA;
    const info    = data.INFLUENCER_DATA;

    // → construction de la bento card
    out.innerHTML = `
      <div style="
        display:grid;
        grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
        gap:1rem;
        background:rgba(255,255,255,0.8);
        backdrop-filter:blur(12px);
        border-radius:16px;
        box-shadow:0 8px 24px rgba(0,0,0,0.08);
        padding:1.5rem;
      ">
        <!-- Photo -->
        <div style="text-align:center;">
          <img src="${pic}" alt="${user}"
               style="width:120px;height:120px;border-radius:50%;object-fit:cover;
                      border:4px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
          <h3 style="margin:.75rem 0 0;font-size:1.1rem;color:#333;">@${user}</h3>
        </div>

        <!-- Stats générales -->
        <div style="display:flex;flex-direction:column;gap:.75rem;">
          <div style="font-size:.9rem;color:#666;">Followers</div>
          <div style="font-size:1.5rem;font-weight:600;color:#333;">
            ${persona.FOLLOWERS.toLocaleString()}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.75rem;">
          <div style="font-size:.9rem;color:#666;">Engagement</div>
          <div style="font-size:1.5rem;font-weight:600;color:#333;">
            ${persona.ENGAGEMENT_RATE}%
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.75rem;">
          <div style="font-size:.9rem;color:#666;">Posts/Semaine</div>
          <div style="font-size:1.5rem;font-weight:600;color:#333;">
            ${info.posts_per_week.toFixed(1)}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.75rem;">
          <div style="font-size:.9rem;color:#666;">Moy. Likes</div>
          <div style="font-size:1.5rem;font-weight:600;color:#333;">
            ${info.avg_likes.toFixed(1)}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.75rem;">
          <div style="font-size:.9rem;color:#666;">Moy. Comments</div>
          <div style="font-size:1.5rem;font-weight:600;color:#333;">
            ${info.avg_comments.toFixed(1)}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.75rem;">
          <div style="font-size:.9rem;color:#666;">Vues Moy.</div>
          <div style="font-size:1.5rem;font-weight:600;color:#333;">
            ${info.avg_views.toFixed(1)}
          </div>
        </div>

        <!-- Catégories -->
        <div style="grid-column:1/-1;">
          <div style="font-size:.9rem;color:#666;margin-bottom:.5rem;">Catégories</div>
          ${Array.isArray(persona.CATEGORY) && persona.CATEGORY.length
            ? persona.CATEGORY.map(cat => `
                <span style="
                  display:inline-block;
                  background:#e8f5e9;
                  color:#2e7d32;
                  border-radius:12px;
                  padding:4px 8px;
                  margin:0 6px 6px 0;
                  font-size:.8rem;
                ">${cat}</span>
              `).join('')
            : `<span style="font-size:.9rem;color:#999;">Aucune catégorie</span>`
          }
        </div>

        <!-- Localisation -->
        <div style="grid-column:1/-1;">
          <div style="font-size:.9rem;color:#666;margin-bottom:.5rem;">Localisation</div>
          <div style="font-size:1rem;color:#333;font-weight:500;">
            ${info.location || '–'}
          </div>
        </div>
      </div>
    `;
  });
});