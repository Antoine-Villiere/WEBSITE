/* hooks.js – AI‑Assistant : Hooks marketing */
(function(){
  const WORKER_URL      = 'https://generator.hello-6ce.workers.dev';       // ← à adapter
  const ROOT_ID='hooks-ai';

  const CSS=`#${ROOT_ID}{font-family:Inter,system-ui;background:#fff;padding:2rem 1rem;max-width:620px;margin:2rem auto;border:1px solid #ececec;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.05)}
#${ROOT_ID} h1{margin:0 0 1.4rem;font-size:1.65rem;text-align:center;color:#0d4020}
label{display:block;margin-top:1rem;font-size:.9rem;color:#333}
input{width:100%;padding:.55rem .7rem;margin-top:.35rem;border:1px solid #d0d0d0;border-radius:8px;font:inherit}
button{margin-top:1.7rem;width:100%;padding:.75rem 1.2rem;font-size:1rem;border:0;border-radius:10px;background:#28a745;color:#fff;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(40,167,69,.35)}
button:hover{background:#208838}
.ai-card{margin-top:1rem;padding:1rem;border-radius:10px;background:#f3fcf5;display:flex;gap:.7rem}
.ai-card svg{flex:0 0 28px;fill:#28a745}
.ai-text{flex:1;font-size:.95rem}
.loader,.error{text-align:center;margin-top:1.2rem;font-style:italic;color:#666}
.error{color:#c00;font-style:normal;font-weight:600}`;injectCSS(CSS);

  const root=document.getElementById(ROOT_ID);
  if(!root){console.error(`#${ROOT_ID} manquant`);return;}

  root.innerHTML=`<h1>AI Assistant – Hooks</h1><form id="${ROOT_ID}-form">
    <label>Type de produit<input name="type_prod" required></label>
    <label>Nom du produit<input name="nom" required></label>
    <label>Audience cible<input name="audience" required></label>
    <label>Problème<input name="probleme" required></label>
    <label>Tonalité<input name="tonalite" required></label>
    <label>URL site (optionnel)<input name="site"></label>
    <button>Générer 3 hooks</button>
  </form><div id="${ROOT_ID}-out"></div>`;

  const form=document.getElementById(`${ROOT_ID}-form`);
  const out=document.getElementById(`${ROOT_ID}-out`);

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const p={choice:'hooks'};new FormData(form).forEach((v,k)=>{if(v.trim())p[k]=v.trim();});
    out.innerHTML='<p class="loader">⏳ Génération…</p>';
    try{const r=await fetch(`${WORKER_URL}/generate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const {result}=await r.json();
      out.innerHTML=result.map(t=>aiCard(t)).join('');
    }catch(err){out.innerHTML=`<p class="error">Erreur : ${err.message}</p>`}
  });

  function aiCard(text){
    return `<div class="ai-card">
      <svg width="28" height="28" viewBox="0 0 24 24"><path d="m12 22-4-4h3v-4h2v4h3l-4 4Zm6-10a6 6 0 1 0-12 0 6 6 0 0 0 12 0Zm-6 8C8.134 20 4 15.866 4 10S8.134 0 14 0s10 4.134 10 10-4.134 10-10 10Z"/></svg>
      <div class="ai-text"><strong>AI Assistant :</strong> ${escapeHTML(text)}</div>
    </div>`;
  }
  function injectCSS(c){const s=document.createElement('style');s.textContent=c;document.head.appendChild(s);}
  function escapeHTML(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
})();