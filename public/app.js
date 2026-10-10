/* Progressive enhancement: navigation, dialogs, forms and image previews. */
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

/* Client preview: internal destinations are intentionally inactive. */
document.addEventListener('click', event => {
  const link=event.target.closest('a[href="#"]');
  if(link&&!link.hasAttribute('data-contact'))event.preventDefault();
});
document.querySelectorAll('form[action="#"]').forEach(form=>form.addEventListener('submit',event=>event.preventDefault()));

/* Header: mobile menu and "Nos solutions" dropdown */
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const setMenu = open => {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  nav.classList.toggle('open', open);
};
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('.sub-toggle').forEach(toggle => toggle.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
}));
document.addEventListener('click', event => {
  document.querySelectorAll('.sub-toggle[aria-expanded="true"]').forEach(toggle => {
    if (!toggle.parentElement.contains(event.target) && !nav.classList.contains('open')) toggle.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.sub-toggle[aria-expanded="true"]').forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
  if (nav?.classList.contains('open')) { setMenu(false); menuButton.focus(); }
});

/* Preloader: fades out once the page has loaded, as in the theme */
const markLoaded = () => root.classList.add('is-loaded');
if (document.readyState === 'complete') markLoaded(); else { addEventListener('load', markLoaded, { once: true }); setTimeout(markLoaded, 3500); }

/* Smooth wheel scrolling on desktop (the theme ships SmoothScroll.js) */
let lenis;
if (!reduceMotion && finePointer && window.Lenis) {
  lenis = new window.Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]:not([data-contact])');
    if (!link || link.getAttribute('href').length < 2) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { event.preventDefault(); lenis.scrollTo(target, { offset: -20 }); }
  });
}

/* Magic cursor: a lime ball that trails the pointer (ratio 0.15) */
const ball = document.querySelector('#cursor-ball');
if (ball && !reduceMotion && finePointer && innerWidth > 1024) {
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 }, pos = { ...mouse };
  addEventListener('mousemove', event => { mouse.x = event.clientX; mouse.y = event.clientY; root.classList.add('has-cursor'); }, { passive: true });
  document.addEventListener('mouseleave', () => root.classList.remove('has-cursor'));
  const follow = () => {
    pos.x += (mouse.x - pos.x) * .15; pos.y += (mouse.y - pos.y) * .15;
    ball.style.transform = `translate3d(${pos.x - 5}px, ${pos.y - 5}px, 0)`;
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);
}

/* Position-aware button fill: the circle grows from where the pointer enters or leaves */
const placeFill = event => {
  const button = event.target.closest('.btn');
  if (!button || button.contains(event.relatedTarget)) return;
  const fill = button.querySelector('.btn-fill'); const box = button.getBoundingClientRect();
  fill?.style.setProperty('--x', `${event.clientX - box.left}px`);
  fill?.style.setProperty('--y', `${event.clientY - box.top}px`);
};
document.addEventListener('mouseover', placeFill);
document.addEventListener('mouseout', placeFill);

/* Headings: letter-by-letter entrance (theme heading style 3: x 50 → 0, back ease, 0.02 s stagger) */
const splitHeading = heading => {
  const text = heading.textContent.replace(/\s+/g, ' ').trim();
  const visual = document.createElement('span'); visual.setAttribute('aria-hidden', 'true');
  let index = 0;
  heading.childNodes.forEach(node => {
    if (node.nodeName === 'BR') { visual.append(document.createElement('br')); return; }
    node.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { visual.append(' '); return; }
      const word = document.createElement('span'); word.className = 'w';
      for (const char of part) {
        const c = document.createElement('span'); c.className = 'c'; c.textContent = char;
        c.style.transitionDelay = `${(index++ * .02).toFixed(2)}s`; word.append(c);
      }
      visual.append(word);
    });
  });
  const label = document.createElement('span'); label.className = 'sr-only'; label.textContent = text;
  heading.replaceChildren(label, visual); heading.classList.add('is-ready');
};

/* Scroll-triggered entrances: fade-up blocks, split headings, clip-path image reveals */
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.querySelectorAll('.split').forEach(splitHeading);
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.delay) el.style.animationDelay = `${el.dataset.delay}ms`;
    el.classList.add('is-in'); observer.unobserve(el);
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-anim], .split, .img-reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('[data-anim], .split, .img-reveal').forEach(el => el.classList.add('is-in'));
}

/* Accordion: one open item per list, animated like the ElementsKit collapse */
document.querySelectorAll('.faq-list').forEach(list => {
  const items = [...list.querySelectorAll('details')];
  const animate = (details, open) => {
    const answer = details.querySelector('.faq-answer');
    if (reduceMotion) { details.open = open; return; }
    if (open) details.open = true;
    const from = open ? 0 : answer.scrollHeight, to = open ? answer.scrollHeight : 0;
    answer.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 350, easing: 'ease' }).onfinish = () => { if (!open) details.open = false; };
  };
  items.forEach(details => details.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    const willOpen = !details.open;
    if (willOpen) items.filter(other => other !== details && other.open).forEach(other => animate(other, false));
    animate(details, willOpen);
  }));
});

const escapeHtml = (text = '') => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let publicConfig;
const configReady = fetch('/site-data.json').then(r=>r.json()).then(data => (publicConfig=data));
const modal = document.querySelector('#info-dialog');
const modalContent = document.querySelector('#dialog-content');
let lastTrigger;
const modalTexts = {
  legal: () => `<h2 id="dialog-title">Mentions légales</h2><p><strong>Version de préparation : informations légales à compléter avant publication.</strong></p><h3>Éditeur du site</h3><p>PRO NUISIBLES<br>Raison sociale : ${escapeHtml(publicConfig?.legalName || '[À renseigner]')}<br>SIRET : ${escapeHtml(publicConfig?.siret || '[À renseigner]')}<br>Adresse : ${escapeHtml(publicConfig?.address || '[À renseigner]')}<br>Téléphone : ${escapeHtml(publicConfig?.phone || '[À renseigner]')}<br>Email : ${escapeHtml(publicConfig?.email || '[À renseigner]')}</p><h3>Publication et hébergement</h3><p>Directeur de publication : [À renseigner].<br>Hébergeur, adresse et contact : [À renseigner selon l’hébergement choisi].</p><h3>Informations commerciales</h3><p>Certifications, assurances et références : [À documenter]. Les délais, prix et modalités d’intervention doivent être confirmés par un devis. Aucun agrément ni résultat garanti n’est revendiqué sur cette version.</p>`,
  privacy: () => `<h2 id="dialog-title">Confidentialité</h2><p><strong>Texte de préparation à adapter et valider avant publication.</strong></p><h3>Votre demande de devis</h3><p>Le formulaire recueille votre nom, téléphone, email, ville, le nuisible concerné, votre description et, si vous le souhaitez, vos photos. Ces informations servent uniquement à examiner votre demande et à vous répondre.</p><p>Responsable du traitement : PRO NUISIBLES, [identité et adresse à compléter]. Destinataires : les personnes habilitées à traiter les demandes et le prestataire email configuré. Durée de conservation, base juridique, prestataires et éventuels transferts : [À renseigner avant mise en ligne].</p><h3>Vos droits</h3><p>Vous pouvez demander l’accès, la rectification ou l’effacement de vos informations et exercer les autres droits applicables. Contact : ${escapeHtml(publicConfig?.email || '[Email à renseigner]')}. Vous pouvez adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">CNIL</a>.</p><h3>Fonctionnement de l’aperçu</h3><p>En mode local, les demandes et photos sont conservées sur cet ordinateur dans un dossier privé, inaccessible depuis le site. Aucun email n’est envoyé. Les photos sont réencodées pour supprimer leurs métadonnées. N’utilisez que des données de test tant que les informations légales ne sont pas complétées.</p><h3>Cookies</h3><p>Ce site n’utilise ni traceur publicitaire, ni outil de mesure d’audience, ni cookie de suivi. Les polices et photos sont hébergées localement. Les liens vers WhatsApp et les sources externes ouvrent des services tiers uniquement si vous les activez.</p>`,
  credits: () => `<h2 id="dialog-title">Crédits photographiques</h2><p>Les images illustrent les prestations. Les personnes photographiées ne sont pas présentées comme des salariés de PRO NUISIBLES. Les scènes en équipement de protection proviennent de séances de désinfection.</p><ul><li>Photographies de traitement intérieur : Matilda Wormwood, <a href="https://www.pexels.com/photo/person-holding-spray-bottle-4098786/" target="_blank" rel="noopener noreferrer">Pexels 4098786</a> et <a href="https://www.pexels.com/photo/photo-of-person-spraying-disinfectant-4099466/" target="_blank" rel="noopener noreferrer">4099466</a>, <a href="https://www.pexels.com/license/" target="_blank" rel="noopener noreferrer">licence Pexels</a>.</li><li>Photographie en tenue de protection : Michelangelo Buonarroti, <a href="https://www.pexels.com/photo/a-woman-in-ppe-disinfecting-4176229/" target="_blank" rel="noopener noreferrer">Pexels 4176229</a>, licence Pexels.</li><li>Punaise de lit : CDC / Organisation mondiale de la santé, <a href="https://commons.wikimedia.org/wiki/File:Cimex_lectularius.jpg" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>, domaine public.</li><li>Blatte germanique : Bagous, <a href="https://commons.wikimedia.org/wiki/File:Blatella_germanica_1.jpg" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.</li><li>Frelons asiatiques sur leur nid : Francis ITHURBURU (Quiricou), <a href="https://commons.wikimedia.org/wiki/File:Vespa_v%C3%A9lutina.jpg" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a>.</li></ul><p>Modifications : redimensionnement, conversion WebP et recadrage d’affichage. Les versions adaptées des photos CC BY-SA restent proposées sous leurs licences respectives.</p>`,
  contact: () => `<h2 id="dialog-title">Coordonnées à compléter</h2><p>Le numéro de téléphone et le compte WhatsApp de PRO NUISIBLES ne sont pas encore renseignés sur cette version locale.</p><p>Vous pouvez tester le parcours de demande de devis. Aucun appel ni message ne sera envoyé à un numéro fictif.</p><a class="btn btn-green" href="/contact-devis/">Accéder au formulaire</a>`,
};
document.addEventListener('click', async event => {
  const trigger = event.target.closest('[data-modal], [data-contact]');
  if (!trigger) return;
  event.preventDefault(); lastTrigger = trigger;
  try { await configReady; } catch { /* Keep honest placeholders if config unavailable. */ }
  const key = trigger.hasAttribute('data-contact') ? 'contact' : trigger.dataset.modal;
  modalContent.innerHTML = modalTexts[key]?.() || modalTexts.contact();
  modal.showModal();
});
document.querySelector('.dialog-close')?.addEventListener('click',()=>modal.close());
modal?.addEventListener('click',event=>{if(event.target===modal){const box=modal.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)modal.close();}});
modal?.addEventListener('close',()=>lastTrigger?.focus());


document.querySelector('#coverage-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const city = document.querySelector('#coverage-city').value.trim();
  if (!city) return;
  const result = document.querySelector('#coverage-result');
  try {
    await configReady;
    const match = publicConfig.cities.find(c=>c.name.toLocaleLowerCase('fr')===city.toLocaleLowerCase('fr')||c.postalCode===city);
    result.textContent = match ? `${match.name} figure dans notre secteur. Les disponibilités seront confirmées lors de votre échange. ` : 'La couverture de cette commune reste à confirmer. ';
    const link=document.createElement('a'); link.href=`/contact-devis/?ville=${encodeURIComponent(city)}`;link.textContent='Demander une confirmation'; result.append(link);
  } catch { result.textContent='La vérification est momentanément indisponible. Indiquez votre commune dans le formulaire de contact.'; }
});


const form = document.querySelector('#quote-form');
if (form) {
  const params = new URLSearchParams(location.search);
  for (const name of ['ville','nuisible']) if(params.get(name)) form.elements[name].value=params.get(name).slice(0,120);
  if(params.get('commune')&&!params.get('ville')) form.elements.ville.value=params.get('commune').slice(0,120);
  const context=[['lieu','Type de lieu'],['depuis','Observé depuis'],['zone','Zone concernée']].filter(([key])=>params.get(key)).map(([key,label])=>`${label} : ${params.get(key).slice(0,60)}.`).join(' ');
  if(context&&!form.elements.description.value) form.elements.description.value=context+' ';
  fetch('/api/config').then(r=>r.ok?r.json():Promise.reject()).then(data=>{
    if(data.mode==='smtp') document.querySelector('#form-mode').hidden=true;
  }).catch(()=>{document.querySelector('#form-mode span').textContent='Service de réception indisponible. L’envoi nécessite le serveur du site ; réessayez plus tard.';});
  let photos = [];
  const photoInput = document.querySelector('#photos');
  const status = document.querySelector('#form-status');
  const previews = document.querySelector('#photo-preview');
  let urls=[];
  function renderPhotos() {
    urls.forEach(URL.revokeObjectURL);urls=[];previews.replaceChildren();
    photos.forEach((file,index)=>{
      const item=document.createElement('div');item.className='photo-thumb';
      const img=document.createElement('img');img.src=URL.createObjectURL(file);urls.push(img.src);img.alt=`Aperçu de ${file.name}`;
      const label=document.createElement('span');label.textContent=file.name;
      const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.setAttribute('aria-label',`Retirer ${file.name}`);
      remove.addEventListener('click',()=>{photos.splice(index,1);photoInput.value='';renderPhotos();});
      item.append(img,label,remove);previews.append(item);
    });
  }
  photoInput.addEventListener('change',()=>{
    const incoming=Array.from(photoInput.files);
    if(photos.length+incoming.length>3 || incoming.some(f=>f.size>5*1024*1024||!['image/jpeg','image/png','image/webp'].includes(f.type))) {
      status.className='form-status error';status.textContent='Ajoutez au maximum 3 photos JPEG, PNG ou WebP de 5 Mo chacune.';photoInput.value='';return;
    }
    photos.push(...incoming);status.textContent='';status.className='form-status';renderPhotos();
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const button=document.querySelector('#submit-quote');
    const original=button.innerHTML;button.disabled=true;button.textContent='Envoi en cours…';
    status.className='form-status';status.textContent='Votre demande est en cours de transmission.';
    const data=new FormData(form);data.delete('photos');photos.forEach(file=>data.append('photos',file));
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),30000);
    try {
      const response=await fetch('/api/devis',{method:'POST',body:data,signal:controller.signal});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||'L’envoi a échoué. Veuillez réessayer.');
      status.className='form-status success';status.textContent=payload.message;
      form.reset();photos=[];renderPhotos();
    } catch(error) {
      status.className='form-status error';status.textContent=error.name==='AbortError' ? 'Le serveur met trop de temps à répondre. Vérifiez la réception avant de renvoyer votre demande.' : error.message==='Failed to fetch' ? 'Connexion interrompue. Votre demande n’a pas pu être confirmée. Réessayez lorsque la connexion sera rétablie.' : error.message;
    } finally {clearTimeout(timeout);button.disabled=false;button.innerHTML=original;}
  });
  window.addEventListener('pagehide',()=>urls.forEach(URL.revokeObjectURL),{once:true});
}
