// Importe la fonction pour créer un client Supabase.
// Assurez-vous que votre projet est configuré pour gérer les modules ES (type="module" dans la balise script de votre HTML).
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// --- CONFIGURATION ---
// Remplacez par vos propres informations Supabase.
const SUPABASE_URL = 'https://zfhymdqdybuitsrzjmrb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaHltZHFkeWJ1aXRzcnpqbXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1MDIxMDcsImV4cCI6MjA0MjA3ODEwN30.eNKiRZMPCNzj41jYjol4claYdbzU8QykpezH072E8xo';

// --- INITIALISATION ---
// Crée une seule instance du client Supabase pour l'utiliser dans toute l'application.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fonction principale pour charger les logos des partenaires depuis Supabase et les afficher.
 * @async
 */
const loadPartnerLogos = async () => {
  // Cible le conteneur où les logos seront injectés.
  const logoContainer = document.querySelector('.logo-scroller-inner');

  // Si le conteneur n'est pas trouvé dans le HTML, on arrête la fonction.
  if (!logoContainer) {
    console.error("Le conteneur de logos '.logo-scroller-inner' est introuvable sur la page.");
    return;
  }

  try {
    // Exécute la requête pour récupérer les utilisateurs correspondants aux critères.
    const { data: users, error } = await supabase
      .from('USERS') // Le nom de votre table.
      .select('PROFILE_PICTURE, BUSINESS_NAME') // Les colonnes dont nous avons besoin.
      .in('TYPE', ['BUSINESS', 'AGENCY', 'MANDATE']) // Filtre sur le type d'utilisateur.
      .eq('STATUS', '3_ACTIVE_USER'); // Filtre sur le statut actif.

    // Gère les erreurs potentielles de la requête.
    if (error) {
      throw error;
    }

    // Si aucun utilisateur n'est trouvé, affiche un message informatif.
    if (!users || users.length === 0) {
      logoContainer.textContent = "Nos partenaires seront bientôt affichés ici.";
      return;
    }

    // Duplique la liste des utilisateurs pour créer un effet de défilement infini et fluide.
    const logosToDisplay = [...users, ...users];

    // Crée un fragment de document pour optimiser les performances du DOM.
    // Cela évite de modifier le DOM à chaque itération de la boucle.
    const fragment = document.createDocumentFragment();

    logosToDisplay.forEach(user => {
      // S'assure qu'il y a bien une URL d'image avant de créer l'élément.
      if (user.main_image) {
        const img = document.createElement('img');
        img.src = user.main_image;
        img.alt = `Logo de ${user.company_name || 'Partenaire'}`; // Texte alternatif pour l'accessibilité.
        fragment.appendChild(img);
      }
    });

    // Ajoute tous les logos au conteneur en une seule opération.
    logoContainer.appendChild(fragment);

  } catch (error) {
    console.error("Erreur lors de la récupération des logos des partenaires :", error.message);
    // Affiche un message d'erreur clair pour l'utilisateur final.
    if (logoContainer) {
      logoContainer.textContent = "Impossible de charger les logos pour le moment.";
    }
  }
};

// --- EXÉCUTION ---
// Ajoute un écouteur d'événement pour lancer la fonction une fois que le document HTML est complètement chargé.
document.addEventListener('DOMContentLoaded', loadPartnerLogos);