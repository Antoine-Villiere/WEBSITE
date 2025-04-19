<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js/dist/umd/supabase.min.js"></script>
<script>
;(function() {
  console.log('✅ script.js chargé et exécuté');

  // 1) Référence aux éléments du DOM
  const btn = document.getElementById('check');
  const inp = document.getElementById('username');
  const out = document.getElementById('results');

  if (!btn || !inp || !out) {
    console.error('❌ Élément manquant', { btn, inp, out });
    return;
  }

  // 2) Initialise le client Supabase
  const SUPABASE_URL = 'https://zfhymdqdybuitsrzjmrb.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…';  // ta clé anon
  const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);

  // 3) Au clic sur “Vérifier”
  btn.addEventListener('click', async () => {
    const user = inp.value.replace(/^@/, '').trim();
    out.innerHTML = '';

    if (!user) {
      out.innerHTML = '<p class="error">Veuillez saisir un nom d’influenceur.</p>';
      return;
    }

    out.innerHTML = '<p>Chargement…</p>';

    // 4) Requête Supabase : table USERS, colonne INSTAGRAM = user
    const { data, error } = await supabase
      .from('USERS')
      .select('CUSTOMER_PERSONNA')
      .eq('INSTAGRAM', user)
      .single();

    if (error) {
      console.error('❌ Supabase error', error);
      out.innerHTML = `<p class="error">Profil non trouvé ou erreur base.</p>`;
      return;
    }

    // 5) Affichage du JSON CUSTOMER_PERSONNA
    //    On suppose que CUSTOMER_PERSONNA est déjà stocké en JSON ou en texte JSON
    let persona;
    try {
      persona = (typeof data.CUSTOMER_PERSONNA === 'string')
        ? JSON.parse(data.CUSTOMER_PERSONNA)
        : data.CUSTOMER_PERSONNA;
    } catch (e) {
      console.warn('⚠️ Impossible de parser CUSTOMER_PERSONNA, on affiche brut', e);
      persona = data.CUSTOMER_PERSONNA;
    }

    // 6) Construction du rendu HTML
    let html = '<h2>Customer Persona</h2><ul>';
    for (const [key, val] of Object.entries(persona)) {
      // Si valeur tableau, on join par des virgules
      const display = Array.isArray(val) ? val.join(', ') : val;
      html += `<li><strong>${key}</strong> : ${display}</li>`;
    }
    html += '</ul>';

    out.innerHTML = html;
  });
})();
</script>