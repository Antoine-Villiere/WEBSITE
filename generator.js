/* generator.js – proxy Cloudflare vers Cloud Run
   © 2025 – libre de droits
-------------------------------------------------------------------- */
(function () {
  /* ----------------- CONFIG ----------------- */
  const WORKER_URL      = 'https://generator.hello-6ce.workers.dev';       // ← à adapter
  const STYLE_ID        = 'generator-style';
  const DEFAULT_CHOICE  = 'description';                  // valeur pré‑séléctionnée
  const CHOICES = {
    description : {
      label : 'Description',
      fields: [
        {id:'nom',    label:'Nom du produit/service', type:'input'},
        {id:'infos',  label:'Infos clés',              type:'textarea'},
        {id:'site',   label:'URL site (optionnel)',    type:'input'}
      ]
    },
    hooks : {
      label : 'Hooks',
      fields: [
        {id:'type_prod', label:'Type de produit',         type:'input'},
        {id:'nom',       label:'Nom du produit',          type:'input'},
        {id:'audience',  label:'Audience cible',          type:'input'},
        {id:'probleme',  label:'Problème à résoudre',     type:'input'},
        {id:'tonalite',  label:'Tonalité',                type:'input'},
        {id:'site',      label:'URL site (optionnel)',    type:'input'}
      ]
    },
    ugc : {
      label : 'UGC',
      fields: [
        {id:'info_marque',    label:'Infos marque / produit', type:'textarea'},
        {id:'canal',          label:'Canal',                  type:'input'},
        {id:'objectif',       label:'Objectif',               type:'input'},
        {id:'brief_creatif',  label:'Brief créatif (option)', type:'textarea'},
        {id:'site',           label:'URL site (optionnel)',   type:'input'}
      ]
    }
  };

  /* ----------------- CSS minimal pour la carte de résultat ----------------- */
  const CSS = `
.generator-card{max-width:650px;margin:2rem auto;padding:1.5rem;border:1px solid #e4e4e4;border-radius:12px;font-family:system-ui;}
.generator-card h2{margin-top:0;font-size:1.2rem}
.generator-card pre{background:#f7f7f7;padding:1rem;border-radius:8px;white-space:pre-wrap}
.generator-btn{padding:.6rem 1.2rem;margin-top:1rem;font-size:1rem;border-radius:6px;border:none;background:#0077ff;color:#fff;cursor:pointer}
.generator-btn:hover{background:#0061d1}
.generator-loader{color:#666;font-style:italic}
.generator-error{color:#c00;font-weight:600}
`;

  /* Injecte le CSS une seule fois */
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /* ----------------- Construction du formulaire ----------------- */
  document.addEventListener('DOMContentLoaded', buildUI);

  function buildUI() {
    const container = document.getElementById('generator');
    if (!container) {
      console.error('#generator introuvable');
      return;
    }

    // Sélecteur de type
    const select = document.createElement('select');
    select.id = 'choice';
    Object.keys(CHOICES).forEach(k => {
      const o = document.createElement('option');
      o.value = k; o.textContent = CHOICES[k].label;
      if (k === DEFAULT_CHOICE) o.selected = true;
      select.appendChild(o);
    });
    container.appendChild(select);

    // Zone dynamique des champs
    const fieldsZone = document.createElement('div');
    fieldsZone.id = 'fields';
    container.appendChild(fieldsZone);

    // Bouton
    const btn = document.createElement('button');
    btn.className = 'generator-btn';
    btn.textContent = 'Générer';
    container.appendChild(btn);

    // Résultat
    const output = document.createElement('pre');
    output.id = 'output';
    output.className = 'generator-card';
    output.textContent = 'En attente…';
    container.appendChild(output);

    // Init affichage
    fillFields(select.value, fieldsZone);

    /* ---------- Événements ---------- */
    select.addEventListener('change', () => fillFields(select.value, fieldsZone));

    btn.addEventListener('click', async () => {
      const payload = { choice: select.value };
      for (const input of fieldsZone.querySelectorAll('input, textarea')) {
        if (input.value.trim()) payload[input.id] = input.value.trim();
      }

      output.innerHTML = '<p class="generator-loader">⏳ Génération…</p>';
      try {
        const res  = await fetch(`${WORKER_URL}/generate`, {
          method : 'POST',
          headers: { 'Content-Type':'application/json' },
          body   : JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(res.status);
        const json = await res.json();
        output.textContent = JSON.stringify(json, null, 2);
      } catch (err) {
        output.innerHTML = `<p class="generator-error">Erreur : ${err}</p>`;
      }
    });
  }

  function fillFields(choice, zone) {
    zone.innerHTML = '';
    CHOICES[choice].fields.forEach(f => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginTop = '1rem';
      label.textContent = f.label;
      const input = document.createElement(f.type === 'textarea' ? 'textarea' : 'input');
      input.id = f.id;
      input.style.width = '100%';
      input.style.padding = '.4rem';
      label.appendChild(input);
      zone.appendChild(label);
    });
  }
})();