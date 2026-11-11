/* Opti_Lewis — script de démonstration (aucun paiement, panier local) */
const CATEGORIES = [
  {id:'unifocal',name:'Verres unifocaux',desc:'Une seule correction, pour voir de loin ou de près.'},
  {id:'progressif',name:'Verres progressifs',desc:'Plusieurs distances de vision dans un même verre.'},
  {id:'lumiere',name:'Verres anti-lumière bleue',desc:'Pensés pour les longues heures devant les écrans.'},
  {id:'photo',name:'Verres photochromiques',desc:'Ils s\'adaptent à la luminosité ambiante.'},
  {id:'antireflet',name:'Verres antireflets',desc:'Moins de reflets gênants, plus de netteté.'},
  {id:'perso',name:'Solutions optiques personnalisées',desc:'Un accompagnement selon votre usage.'}
];
/* Produits de démonstration : modifiez librement. Prix fictifs en FCFA. */
const PRODUCTS = [
  {id:1,name:'Verre unifocal Clarté',cat:'unifocal',desc:'Verre correcteur pour une vision nette au quotidien.',price:45000,shape:'round'},
  {id:2,name:'Verre progressif Horizon',cat:'progressif',desc:'Transition douce entre vision de loin et de près.',price:95000,shape:'square'},
  {id:3,name:'Verre Écran Confort',cat:'lumiere',desc:'Traitement anti-lumière bleue pour le travail sur écran.',price:60000,shape:'oval'},
  {id:4,name:'Verre antireflet Pureté',cat:'antireflet',desc:'Traitement antireflets pour limiter les éblouissements.',price:55000,shape:'round'}
];
const $ = (s,r=document)=>r.querySelector(s);
const fmt = n => n.toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g,' ')+' FCFA';
const esc = s => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* Illustration SVG de lunettes (aucune image externe susceptible d'échouer) */
function glasses(shape='round'){
  const lens = shape==='square' ? '<rect x="14" y="26" width="52" height="40" rx="10"/><rect x="94" y="26" width="52" height="40" rx="10"/>'
    : shape==='oval' ? '<ellipse cx="40" cy="46" rx="27" ry="21"/><ellipse cx="120" cy="46" rx="27" ry="21"/>'
    : '<circle cx="40" cy="46" r="25"/><circle cx="120" cy="46" r="25"/>';
  return `<svg viewBox="0 0 160 90" aria-hidden="true" style="color:#0F1B33">${lens}<path d="M66 44q14-10 28 0M13 40L2 32M147 40l11-8" stroke="#C9AE82"/></svg>`;
}
$('#heroArt').innerHTML = glasses('round');
$('#adviceArt').innerHTML = glasses('oval');
$('#yr').textContent = new Date().getFullYear();

/* Message de confirmation discret */
let tt; function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)}

/* Catégories */
$('#cats').innerHTML = CATEGORIES.map((c,i)=>`<a class="cat" href="#verres" data-cat="${c.id}"><div class="ill">${glasses(['round','square','oval'][i%3])}</div><h3>${c.name}</h3><p>${c.desc}</p><span>Voir les exemples</span></a>`).join('');

/* Filtres + recherche en temps réel */
let cat='all', term='';
const catName = id => (CATEGORIES.find(c=>c.id===id)||{}).name||'';
function renderFilters(){
  $('#filters').innerHTML = [{id:'all',name:'Tous'},...CATEGORIES].map(c=>`<button class="chip" data-f="${c.id}" aria-pressed="${c.id===cat}">${c.name}</button>`).join('');
}
function renderProducts(){
  const list = PRODUCTS.filter(p=>(cat==='all'||p.cat===cat)&&(p.name+p.desc+catName(p.cat)).toLowerCase().includes(term));
  $('#grid').innerHTML = list.length ? list.map(p=>`<article class="card"><div class="ill">${glasses(p.shape)}</div><div class="body"><small>${catName(p.cat)}</small><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="price">${fmt(p.price)}<i>prix de démonstration</i></div><button class="btn" data-add="${p.id}">Ajouter au panier</button></div></article>`).join('')
    : '<p class="empty">Aucun produit ne correspond. Essayez un autre mot ou une autre catégorie.</p>';
}
$('#filters').addEventListener('click',e=>{const b=e.target.closest('[data-f]');if(b){cat=b.dataset.f;renderFilters();renderProducts()}});
$('#cats').addEventListener('click',e=>{const a=e.target.closest('[data-cat]');if(a){cat=a.dataset.cat;renderFilters();renderProducts()}});
$('#q').addEventListener('input',e=>{term=e.target.value.trim().toLowerCase();renderProducts()});
$('#searchForm').addEventListener('submit',e=>{e.preventDefault();$('#verres').scrollIntoView()});
renderFilters();renderProducts();

/* Panier local */
let cart = [];
function renderCart(){
  $('#count').textContent = cart.reduce((s,i)=>s+i.qty,0);
  $('#items').innerHTML = cart.length ? cart.map(i=>`<li><strong>${esc(i.name)}</strong><span>${fmt(i.price*i.qty)}</span><p>Quantité : ${i.qty} × ${fmt(i.price)}</p><button class="rm" data-rm="${i.id}" aria-label="Retirer ${esc(i.name)}">Retirer</button></li>`).join('')
    : '<li><p>Votre panier est vide. Ajoutez un produit de démonstration pour commencer.</p></li>';
  $('#sub').textContent = fmt(cart.reduce((s,i)=>s+i.price*i.qty,0));
}
$('#grid').addEventListener('click',e=>{
  const b=e.target.closest('[data-add]');if(!b)return;
  const p=PRODUCTS.find(x=>x.id==b.dataset.add), l=cart.find(x=>x.id===p.id);
  l?l.qty++:cart.push({...p,qty:1});
  renderCart();toast(p.name+' ajouté au panier');
});
$('#items').addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(b){cart=cart.filter(i=>i.id!=b.dataset.rm);renderCart();toast('Produit retiré du panier')}});
renderCart();

/* Tiroir panier accessible : focus piégé, fermeture avec Échap */
let opener;
function openCart(){opener=document.activeElement;$('#drawer').hidden=$('#overlay').hidden=false;$('#closeCart').focus()}
function closeCart(){$('#drawer').hidden=$('#overlay').hidden=true;opener&&opener.focus()}
$('#cartBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#overlay').onclick=closeCart;
document.addEventListener('keydown',e=>{
  if($('#drawer').hidden){if(e.key==='Escape')closeNav();return}
  if(e.key==='Escape')closeCart();
  if(e.key==='Tab'){const f=[...$('#drawer').querySelectorAll('button:not([disabled])')];const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
});
$('#accountBtn').onclick=()=>toast('Espace compte : bientôt disponible (démo)');

/* Menu mobile */
function closeNav(){$('#nav').classList.remove('open');$('#burger').setAttribute('aria-expanded','false')}
$('#burger').onclick=()=>{const o=$('#nav').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
$('#nav').addEventListener('click',e=>{if(e.target.tagName==='A')closeNav()});

/* Formulaire de contact : validation navigateur, aucun envoi */
$('#cf').addEventListener('submit',e=>{
  e.preventDefault();const err=$('#cerr'),em=$('#e');err.classList.remove('ok');
  if($('#n').value.trim().length<2){err.textContent='Indiquez votre nom (2 caractères minimum).';$('#n').focus()}
  else if(!em.value||!em.checkValidity()){err.textContent='Saisissez une adresse e-mail valide.';em.focus()}
  else if($('#m').value.trim().length<10){err.textContent='Votre message doit contenir au moins 10 caractères.';$('#m').focus()}
  else{err.textContent='Message validé. Il n\'est pas envoyé : ce formulaire est une démonstration.';err.classList.add('ok');e.target.reset()}
});
