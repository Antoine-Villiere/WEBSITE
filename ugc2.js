/* ugc.js – AI‑Assistant : Idées UGC */
(function(){
  const WORKER_URL      = 'https://generator.hello-6ce.workers.dev';       // ← à adapter
  const ROOT_ID='ugc-ai';

  const CSS=`#${ROOT_ID}{font-family:Inter,system-ui;background:#fff;padding:2rem 1rem;max-width:680px;margin:2rem auto;border:1px solid #ececec;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.05)}
#${ROOT_ID} h1{margin:0 0 1.4rem;font-size:1.65rem;text-align:center;color:#4a356f}
label{display:block;margin-top:1rem;font-size:.9rem;color:#333}
input,textarea{width:100%;padding:.55rem .7rem;margin-top:.35rem;border:1px solid #d0d0d0;border-radius:8px;font:inherit;resize:vertical}
button{margin-top:1.7rem;width:100%;padding:.75rem 1.2rem;font-size:1rem;border:0;border-radius:10px;background:#8b5cf6;color:#fff;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(139,92,246,.35)}
button:hover{background:#7042d2}
.idea{margin-top:1.2rem;padding:1.1rem;border-left:4px solid #8b5cf6;background:#f7f3ff;border-radius:10px}
.idea h3{margin:.2rem 0;font-size:1.05rem;color:#4a356f}
.idea ul{margin:.3rem 0 0 1rem;padding:0}
.loader,.error{text-align:center;margin-top:1.2rem;font-style:italic;color:#666}
.error{color:#c00;font-style:normal;font-weight:600}`;
  injectCSS(CSS);

  const root=document.getElementById(ROOT_ID);
  if(!root){console.error(`#${ROOT_ID} manquant`);return;}

  root.innerHTML=`<h1>AI Assistant – Idées UGC</h1><form id="${ROOT_ID}-form">
    <label>Infos marque / produit<textarea name="info_marque" required></textarea></label>
    <label>Canal<input name="canal" required></label>
    <label>Objectif<input name="objectif" required></label>
    <label>Brief créatif (optionnel)<textarea name="brief_creatif"></textarea></label>
    <label>URL site (optionnel)<input name="site"></label>
    <button>Générer 3 idées UGC</button>
  </form><div id="${ROOT_ID}-out"></div>`;

  const form=document.getElementById(`${ROOT_ID}-form`);
  const out=document.getElementById(`${ROOT_ID}-out`);

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const p={choice:'ugc'};new FormData(form).forEach((v,k)=>{if(v.trim())p[k]=v.trim();});
    out.innerHTML='<p class="loader">⏳ Génération…</p>';
    try{const r=await fetch(`${WORKER_URL}/generate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const {result}=await r.json();
      out.innerHTML=result.map((v,i)=>idea(v,i+1)).join('');
    }catch(err){out.innerHTML=`<p class="error">Erreur : ${err.message}</p>`}
  });

  function idea(v,idx){
    const vis=v['visuels clés']||v.visuels||[];
    return `<div class="idea">
      <h3>🎬 Idée ${idx}</h3>
      <p><strong>Hook :</strong> ${escape(v.hook||'‑')}</p>
      <p><strong>Scénario :</strong> ${escape(v.scénario||v.scenario||'‑')}</p>
      <p><strong>Visuels clés :</strong></p>
      <ul>${vis.map(it=>`<li>${escape(it)}</li>`).join('')}</ul>
      <p><strong>CTA :</strong> ${escape(v.cta||'‑')}</p>
    </div>`;
  }
  function injectCSS(c){const s=document.createElement('style');s.textContent=c;document.head.appendChild(s);}
  function escape(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
})();