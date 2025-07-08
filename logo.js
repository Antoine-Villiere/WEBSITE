document.addEventListener('DOMContentLoaded', async () => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');

  const SUPABASE_URL = 'https://zfhymdqdybuitsrzjmrb.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaHltZHFkeWJ1aXRzcnpqbXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1MDIxMDcsImV4cCI6MjA0MjA3ODEwN30.eNKiRZMPCNzj41jYjol4claYdbzU8QykpezH072E8xo';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  loadPartnerLogos(supabase);
});

async function loadPartnerLogos(supabase) {
  const logoContainer = document.querySelector('.logo-scroller-inner');
  if (!logoContainer) return;

  try {
    const { data: users, error } = await supabase
      .from('USERS')
      .select('PROFILE_PICTURE, BUSINESS_NAME')
      .in('TYPE', ['BUSINESS', 'AGENCY', 'MANDATE'])
      .eq('STATUS', '3_ACTIVE_USER');

    if (error) throw error;

    if (!users || users.length === 0) {
      logoContainer.textContent = "Nos partenaires seront bientôt affichés ici.";
      return;
    }

    const logosToDisplay = [...users, ...users];
    const fragment = document.createDocumentFragment();

    logosToDisplay.forEach(user => {
      if (user.PROFILE_PICTURE) {
        const img = document.createElement('img');
        img.src = user.PROFILE_PICTURE;
        img.alt = `Logo de ${user.BUSINESS_NAME || 'Partenaire'}`;
        fragment.appendChild(img);
      }
    });

    logoContainer.appendChild(fragment);
  } catch (error) {
    console.error("Erreur lors de la récupération des logos :", error.message);
    logoContainer.textContent = "Impossible de charger les logos pour le moment.";
  }
}
