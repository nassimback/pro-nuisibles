import { business, serviceArea } from '../site.config.mjs';
import { services } from './content.mjs';
import { esc, icon, photo, btn, action, pill, heading, up, badge, bugArt, quickForm, serviceCards, helpLine } from './components.mjs';

// Home sections follow the Bugfree "Home v2" sequence; claims the business cannot back (ratings, prices, team) are replaced by verifiable content.

export function homeHero() {
  return `<section class="hero"><div class="hero-box">${photo('hero', 'Professionnel en tenue de protection réalisant un traitement dans un salon', 'hero-photo', true, '100vw')}<div class="hero-shade"></div>
    <div class="container hero-inner"><div class="hero-copy">
      ${pill('Frelons · Guêpes · Punaises de lit · Cafards', 'pill-glass')}
      ${heading('h1', 'Entreprise de désinsectisation<br>dans les Bouches-du-Rhône (13)')}
      <p ${up()}>De Marseille à Arles, d’Aix-en-Provence à Martigues : nous identifions le nuisible, expliquons les solutions possibles et préparons une intervention adaptée à vos lieux et à leurs occupants.</p>
      <div class="hero-actions" ${up(100)}>${btn('Demander un devis', '/contact-devis/', { variant: 'btn-white-fill' })}${action('phone', 'Appeler un expert', 'play')}</div>
      <div class="hero-proof" ${up(200)}><span class="proof-dots">${services.map(s => `<span>${photo(s.image, '', '', false, '50px')}</span>`).join('')}<span class="proof-plus">${icon('plus')}</span></span><p>Intervention dans tout le département<br>des Bouches-du-Rhône (13).</p></div>
    </div>${badge('hero-badge')}</div>
  </div></section>`;
}

export function homeInspection() {
  const phone = business.phone ? esc(business.phone) : '[Téléphone à renseigner]';
  return `<section class="inspection"><div class="container inspection-row">
    <div class="inspection-form" ${up()}><h2>Préparez votre demande de devis</h2>${quickForm()}</div>
    <div class="inspection-call" ${up(100)}><a class="call-line" ${business.phone ? `href="tel:${phone}"` : 'href="/contact-devis/" data-contact="phone"'}><span class="icon-circle dark xl">${icon('phone')}</span><span>Appelez-nous : ${phone}</span></a><h3>Un conseil avant d’agir ? Échangez avec PRO NUISIBLES</h3><p>Décrivez ce que vous observez : nous vous aidons à identifier la prochaine étape.</p></div>
  </div></section>`;
}

export function homeAbout() {
  return `<section class="block about"><div class="container two-col">
    <div class="about-media">
      <div class="about-main img-reveal">${photo('team-consultation', 'Échange entre un technicien et une cliente avant intervention', '', false, '(max-width: 767px) 80vw, 470px')}</div>
      <div class="about-second">${photo('treatment-room', 'Technicien préparant une intervention dans un salon lumineux', '', false, '(max-width: 767px) 60vw, 345px')}</div>
      <div class="about-card" ${up(200)}><span class="mini-pill">Notre méthode</span><strong>4</strong><span class="about-card-icons">${icon('magnifying-glass')}${icon('file-text')}${icon('shield-check')}${icon('calendar-check')}</span><span>étapes claires</span><a href="#">Nous contacter</a></div>
    </div>
    <div class="about-copy">
      ${pill('L’approche PRO NUISIBLES')}
      ${heading('h2', 'Des nuisibles en moins,<br>de la sérénité en plus')}
      <p ${up()}>Quand les nuisibles s’invitent chez vous, vous avez besoin de comprendre ce qui se passe et de savoir quoi faire. Nous identifions le problème, expliquons les solutions possibles et préparons une intervention adaptée, partout dans les Bouches-du-Rhône.</p>
      <div class="icon-pair">${[['magnifying-glass', 'Un diagnostic attentif', 'Identifier le nuisible et ses refuges avant de choisir une méthode.'], ['shield-check', 'Des consignes claires', 'Des précautions expliquées pour les occupants et les animaux.']].map(([ic, h, t], i) => `<div class="icon-box" ${up(i * 100)}><span class="icon-circle">${icon(ic)}</span><div><h3>${h}</h3><p>${t}</p></div></div>`).join('')}</div>
      <blockquote class="quote-card" ${up()}>${icon('quotes', 'quote-mark', 'fill')}<p>Nous identifions le nuisible avant de traiter, nous expliquons les précautions avant d’intervenir et nous préparons la suite avec vous, pour que le problème ne revienne pas.</p></blockquote>
      <div ${up(100)}>${btn('Découvrir nos services', '/services-et-zones-intervention/')}</div>
    </div>
  </div></section>`;
}

export function homeServices() {
  return `<section class="block" aria-labelledby="home-services-title"><div class="box box-white has-corners">${bugArt('corner corner-tr')}${bugArt('corner corner-bl')}<div class="container">
    <div class="center-head">${pill('Désinsectisation dans le 13', 'pill-grey')}${heading('h2', 'Une solution ciblée<br>pour chaque nuisible', '', 'home-services-title')}</div>
    ${serviceCards()}
    ${helpLine('Vous ne savez pas quel nuisible vous avez observé ?', 'Parlons de votre situation', '/contact-devis/')}
  </div></div></section>`;
}

export function homeZones() {
  const cities = serviceArea.featuredCities;
  return `<section class="block zones" id="zones" aria-labelledby="home-zones-title"><div class="container two-col">
    <div class="zones-copy">
      ${pill('Zone d’intervention')}
      ${heading('h2', 'Désinsectisation dans les<br>Bouches-du-Rhône (13)', '', 'home-zones-title')}
      <p ${up()}>Que vous soyez à Marseille, à Aix-en-Provence ou dans une commune voisine, décrivez votre situation : nous confirmons avec vous le déplacement et les modalités de l’intervention.</p>
      <ul class="city-chips" aria-label="Principales villes desservies" ${up(100)}>${cities.map(c => `<li>${icon('map-pin')}<span>${esc(c)}</span></li>`).join('')}<li class="more">et les communes environnantes</li></ul>
      <div class="zones-actions" ${up(200)}>${btn('Services et zones d’intervention', '/services-et-zones-intervention/')}${btn('Demander un devis', '/contact-devis/', { variant: 'btn-dark' })}</div>
    </div>
    <div class="zones-card box-dark" ${up(100)}><span class="zones-no" aria-hidden="true">${serviceArea.code}</span><div class="zones-top"><span class="icon-circle xl">${icon('map-pin')}</span><h3>${serviceArea.department}</h3><p>Maisons, appartements, commerces et copropriétés du département : une prise en charge adaptée à chaque lieu.</p></div><div class="zones-bottom"><p class="zones-label">Nuisibles traités dans le 13</p><ul class="zones-services">${services.map(s => `<li><a href="#">${icon(s.icon)}<span>${s.name}</span>${icon('arrow-right', 'go')}</a></li>`).join('')}</ul><p class="zones-note">Disponibilités et déplacement confirmés lors de votre demande.</p></div></div>
  </div></section>`;
}

export function homeExpert() {
  return `<section class="block"><div class="box box-dark expert">${bugArt('corner corner-tr light')}<div class="container two-col">
    <div class="expert-copy">
      ${pill('Notre engagement', 'pill-glass')}
      ${heading('h2', 'Pourquoi notre démarche<br>fait la différence')}
      <p ${up()}>Nous ne proposons pas un traitement standard : la méthode, le périmètre et les précautions dépendent du nuisible, de son activité et des lieux à protéger.</p>
      <div class="glass-cards">${[['chat-circle-text', 'À votre écoute', 'Votre situation, vos contraintes et vos questions guident le premier échange.'], ['sliders-horizontal', 'Une réponse sur mesure', 'Le nuisible, les accès et l’occupation des lieux orientent le protocole.']].map(([ic, h, t], i) => `<article class="glass-card" ${up(i * 100)}><h3>${h}</h3><p>${t}</p><span class="icon-circle">${icon(ic)}</span><span class="outline-no" aria-hidden="true">0${i + 1}</span></article>`).join('')}</div>
    </div>
    <div class="expert-media"><img src="/assets/inspection-kitchen-1280.webp" alt="Inspection minutieuse des recoins d’une cuisine" width="1280" height="1800" loading="lazy" decoding="async">${badge('expert-badge')}</div>
  </div></div></section>`;
}

export function homeFeatures() {
  const items = [['house', 'Particuliers', 'Maison ou appartement, en tenant compte du foyer.'], ['storefront', 'Professionnels', 'Commerces et bureaux, selon votre activité.'], ['buildings', 'Copropriétés', 'Parties communes et logements concernés.']];
  return `<section class="block features"><div class="container two-col">
    <div class="features-media img-reveal shine">${photo('exterior-inspection', 'Inspection préventive des abords et fondations d’une maison', '', false, '(max-width: 1024px) 100vw, 520px')}<div class="glass-cta" ${up(200)}><span class="glass-cta-icon">${icon('headset')}</span><p class="glass-cta-title">Encore des questions ?</p><p>Comment pouvons-nous vous aider face aux nuisibles ?</p>${btn('Nous contacter', '/contact-devis/')}</div></div>
    <div class="features-copy">
      ${pill('Pour qui ?')}
      ${heading('h2', 'Une réponse adaptée<br>à chaque type de lieu')}
      <p ${up()}>De l’identification du nuisible au choix de la méthode, chaque intervention tient compte des lieux, de leurs occupants et de leurs contraintes.</p>
      <p ${up(100)}>Maison, appartement, commerce, bureau ou copropriété : précisez votre situation pour recevoir des consignes adaptées et un devis qui détaille la prestation, les passages prévus et le suivi.</p>
      <div class="feature-cards">${items.map(([ic, h, t], i) => `<article class="feature-card" ${up(i * 100)}><span class="icon-circle xl ring">${icon(ic)}</span><h3>${h}</h3><p>${t}</p></article>`).join('')}</div>
      <div ${up()}>${btn('Services & zones', '/services-et-zones-intervention/')}</div>
    </div>
  </div></section>`;
}

export function homeOffers() {
  const plans = [
    { s: services[0], ic: 'bug', list: ['Hauteur et accès au nid', 'Espèce et activité observée', 'Matériel et précautions nécessaires'] },
    { s: services[1], ic: 'bed', list: ['Surface et nombre de pièces', 'Niveau d’infestation constaté', 'Nombre de passages prévus'], featured: true },
    { s: services[2], ic: 'bug-beetle', list: ['Surface et zones actives', 'Accès aux refuges', 'Coordination en immeuble'] },
  ];
  return `<section class="block offers"><div class="container">
    <div class="split-head"><div>${pill('Devis sur mesure')}${heading('h2', 'Un devis clair, adapté<br>à votre situation dans le 13')}</div><div><p ${up()}>Il n’existe pas de tarif unique : l’espèce, l’étendue du problème, les accès et le protocole font varier le coût. Votre devis précise la prestation, les passages prévus et les éventuels frais.</p><div ${up(100)}>${btn('Demander un devis', '/contact-devis/')}</div></div></div>
    <div class="offer-grid">${plans.map(({ s, ic, list, featured }, i) => `<article class="offer-card${featured ? ' is-featured' : ''}" ${up(i * 100)}>
      <div class="offer-head"><span class="icon-circle${featured ? ' dark' : ''}">${icon(ic)}</span><div><h3>${s.name}</h3><span>${s.tag.charAt(0) + s.tag.slice(1).toLowerCase()}</span></div></div>
      <p>${s.summary}</p>
      <div class="offer-price"><strong>Sur devis</strong><span>/ après diagnostic</span></div>
      ${btn('Demander un devis', `/contact-devis/?nuisible=${encodeURIComponent(s.name)}`, { variant: `btn-block ${featured ? 'btn-dark' : ''}`, iconName: '' })}
      <h4>Ce que nous étudions :</h4>
      <ul class="check-list">${list.map(t => `<li>${icon('check-circle', '', 'fill')}${t}</li>`).join('')}</ul>
    </article>`).join('')}</div>
    <ul class="offer-notes" ${up()}><li>${icon('file-text')}Devis détaillé avant intervention</li><li>${icon('info')}Consignes expliquées</li><li>${icon('calendar-check')}Suivi à définir ensemble</li></ul>
  </div></section>`;
}

