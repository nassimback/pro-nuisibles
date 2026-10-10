import { homeHero, homeInspection, homeAbout, homeServices, homeWhy, homeExpert, homeFeatures, homeOffers, homeEngagements, homeGuides } from './home-sections.mjs';
import { business } from '../site.config.mjs';
import { services, generalFaq } from './content.mjs';
import { icon, photo, action, btn, pill, heading, up, logo, faq, faqList, serviceCards, processSection, pageHero, esc, bugArt, helpLine } from './components.mjs';

export function home() {
  return `${homeHero()}${homeInspection()}${homeAbout()}${homeServices()}${homeWhy()}${homeExpert()}${homeFeatures()}${processSection()}${homeOffers()}${homeEngagements()}${homeGuides()}${faq(generalFaq)}`;
}

function serviceSidebar(current) {
  return `<aside class="sidebar"><div class="sidebar-inner">
    <nav class="side-nav" aria-label="Nos solutions"><h2>Explorer nos solutions</h2><ul>${services.map(s => `<li><a href="/${s.slug}/" ${s.slug === current ? 'aria-current="page"' : ''}>${s.name}${icon('arrow-right')}</a></li>`).join('')}<li><a href="/services-et-zones-intervention/">Services & zones${icon('arrow-right')}</a></li></ul></nav>
    <div class="side-contact">${logo()}<h2>Parlons de votre situation</h2><p>${esc(business.hours || '[Horaires à renseigner]')}<br>${esc(business.address || '[Adresse à renseigner]')}<br>${esc(business.email || '[Email à renseigner]')}</p><div class="side-phone">${action('phone', esc(business.phone || 'Appeler un expert'), 'side-phone-link')}</div></div>
  </div></aside>`;
}

export function servicePage(s) {
  const query = `?nuisible=${encodeURIComponent(s.name)}`;
  return `${pageHero({ label: s.name, heading: s.heading.replace('\n', ' '), crumbs: [['Nos solutions', '/services-et-zones-intervention/'], [s.name]], image: s.image })}
  <section class="block"><div class="container sidebar-layout">${serviceSidebar(s.slug)}
    <article class="entry">
      <div class="entry-img img-reveal">${photo(s.image, `Photographie de ${s.name.toLowerCase()}`, '', false, '(max-width: 1024px) 100vw, 850px')}</div>
      <p ${up()}>${s.intro} ${s.summary}</p>
      ${heading('h2', s.detailTitle)}
      <p ${up()}>${s.detail}</p>
      <div class="signs" id="signes"><div class="signs-card" ${up()}><h3 class="signs-title">Les signes à observer</h3>${s.signs.map((t, i) => `<div class="icon-box"><span class="icon-circle">${icon(['eye', 'magnifying-glass', 'map-pin'][i])}</span><div><h3>Signe n° ${i + 1}</h3><p>${t}</p></div></div>`).join('')}</div><div class="signs-img img-reveal shine">${photo('technician', 'Professionnel en tenue de protection préparant son intervention', '', false, '(max-width: 767px) 100vw, 410px')}</div></div>
      <blockquote class="quote-card" ${up()}>${icon('info', 'quote-mark')}<p><strong>Le bon réflexe : </strong>${s.advice}</p></blockquote>
      ${heading('h2', 'Une prise en charge en trois temps')}
      <p ${up()}>Le protocole exact est défini selon le diagnostic et les contraintes de vos lieux.</p>
      <div class="num-cards">${s.approach.map((t, i) => `<article class="num-card" ${up(i * 100)}><span class="num-circle">0${i + 1}</span><h3>${['Diagnostic', 'Intervention', 'Prévention & suivi'][i]}</h3><p>${t}</p></article>`).join('')}</div>
      ${heading('h2', 'Un devis adapté, sans tarif inventé')}
      <p ${up()}>${s.factors} Indiquez votre commune pour confirmer le secteur d’intervention.</p>
      <div class="entry-img wide img-reveal shine">${photo('treatment', 'Traitement d’une surface intérieure avec un équipement professionnel', '', false, '(max-width: 1024px) 100vw, 850px')}</div>
      <ul class="inline-checks" ${up()}>${['Diagnostic avant traitement', 'Consignes de sécurité expliquées', 'Suivi à définir ensemble'].map(t => `<li>${icon('check-circle', '', 'fill')}${t}</li>`).join('')}</ul>
      <div ${up()}>${btn('Demander mon devis', `/contact-devis/${query}`)}</div>
      ${heading('h2', 'Questions fréquentes')}
      ${faqList(s.faq)}
      ${s.source ? `<p class="source-note">Pour aller plus loin : <a href="${s.source[1]}" target="_blank" rel="noopener noreferrer">${s.source[0]}</a>.</p>` : ''}
    </article>
  </div></section>`;
}

function coverageBlock() {
  const cities = business.cities.length ? business.cities.map(c => `<li><a href="/contact-devis/?ville=${encodeURIComponent(c.name)}">${icon('map-pin')}${esc(c.name)}${c.postalCode ? ` <small>${esc(c.postalCode)}</small>` : ''}</a></li>`).join('') : ['[Ville principale]', '[Communes voisines]', '[Département]'].map(t => `<li><span>${icon('map-pin')}${t}</span></li>`).join('');
  return `<section class="block" id="zones"><div class="container two-col coverage">
    <div>${pill('Zone d’intervention')}${heading('h2', 'Une solution locale,<br>un accompagnement humain')}<p ${up()}>Maison, appartement, commerce ou copropriété : votre commune est le point de départ d’une intervention adaptée.</p><ul class="city-list" ${up(100)}>${cities}</ul>${business.cities.length ? '' : `<p class="small-note" ${up()}>Zone d’intervention à renseigner. La couverture de chaque commune reste à confirmer.</p>`}</div>
    <div class="coverage-card" ${up(100)}><span class="icon-circle xl">${icon('map-pin')}</span><h3>Votre commune est-elle desservie ?</h3><p>Renseignez une ville ou un code postal. Les modalités et disponibilités restent à confirmer lors de votre échange.</p><form id="coverage-form"><label class="sr-only" for="coverage-city">Ville ou code postal</label><div class="coverage-input"><input id="coverage-city" required maxlength="120" placeholder="Ville ou code postal *" autocomplete="address-level2">${btn('Vérifier', '', { tag: 'button', attrs: 'type="submit"', iconName: 'magnifying-glass' })}</div><p id="coverage-result" role="status"></p></form></div>
  </div></section>`;
}

export function areasPage() {
  const audiences = [['house', 'Particuliers', 'Maison ou appartement : précisez les pièces touchées et les contraintes de votre foyer. Les consignes tiennent compte des occupants et des animaux.'], ['storefront', 'Professionnels', 'Commerce, bureau ou hébergement : décrivez l’activité, les zones concernées et vos horaires pour une intervention compatible avec votre organisation.'], ['buildings', 'Copropriétés', 'Gestionnaires et syndics : identifiez les parties communes et logements concernés. Une coordination peut être nécessaire.']];
  return `${pageHero({ label: 'Services et zones d’intervention', heading: 'Services et zones d’intervention', crumbs: [['Services & zones']], image: 'treatment' })}
  <section class="block"><div class="box box-white has-corners">${bugArt('corner corner-tr')}${bugArt('corner corner-bl')}<div class="container">
    <div class="center-head">${pill('Nos domaines d’intervention', 'pill-grey')}${heading('h2', 'Un besoin précis,<br>une solution adaptée')}</div>
    ${serviceCards()}
    ${helpLine('Choisissez le nuisible concerné pour découvrir les signes à observer', 'Demander un devis', '/contact-devis/')}
  </div></div></section>
  <section class="block"><div class="container">
    <div class="center-head">${pill('Pour qui ?')}${heading('h2', 'Chaque lieu<br>a ses contraintes')}</div>
    <div class="feature-cards three">${audiences.map(([ic, h, t], i) => `<article class="feature-card" ${up(i * 100)}><span class="icon-circle xl ring">${icon(ic)}</span><h3>${h}</h3><p>${t}</p></article>`).join('')}</div>
  </div></section>
  ${coverageBlock()}${processSection()}${faq(generalFaq.slice(0, 4))}`;
}

export function contactPage() {
  const cards = [
    ['phone', 'Par téléphone', business.phone || '[Téléphone à renseigner]', 'technician', action('phone', 'Appeler', 'text-link')],
    ['whatsapp-logo', 'Sur WhatsApp', business.whatsapp ? 'Partagez les premiers détails' : '[WhatsApp à renseigner]', 'treatment', action('whatsapp', 'Ouvrir WhatsApp', 'text-link')],
    ['map-pin', 'Zone d’intervention', business.cities.length ? business.cities.map(c => c.name).join(', ') : '[Communes à renseigner]', 'hero', `<a class="text-link" href="/services-et-zones-intervention/#zones">Voir notre secteur${icon('arrow-right')}</a>`],
  ];
  const field = (label, input) => `<label class="field"><span class="sr-only">${label}</span>${input}</label>`;
  return `${pageHero({ label: 'Contact et demande de devis', heading: 'Contact et demande de devis', crumbs: [['Contact & devis']], image: 'hero' })}
  <section class="block" id="coordonnees"><div class="container"><div class="contact-cards">${cards.map(([ic, label, value, img, link], i) => `<article class="contact-card" ${up(i * 100)}><div class="contact-card-img shine">${photo(img, '', '', false, '(max-width: 767px) 100vw, 33vw')}</div><div class="contact-card-body"><span class="icon-circle xl">${icon(ic)}</span><div><span>${label}</span><strong>${esc(value)}</strong>${link}</div></div></article>`).join('')}</div></div></section>
  <section class="block contact-section" id="demande"><div class="container two-col contact-layout">
    <div class="contact-media img-reveal">${photo('technician', 'Technicienne en tenue de protection', '', false, '(max-width: 1024px) 100vw, 600px')}<div class="hours-card" ${up(200)}><h3>Horaires :</h3><ul><li>${esc(business.hours || '[Horaires à renseigner]')}</li><li>${esc(business.address || '[Adresse à renseigner]')}</li></ul></div></div>
    <div class="contact-form-panel">${pill('Demande de devis')}${heading('h2', 'Décrivez votre situation,<br>nous préparons la suite')}
      <p class="form-intro" ${up()}>Les champs marqués d’un * sont nécessaires à votre demande. Quelques détails et, si possible, des photos nous aident à préparer un devis adapté.</p>
      <div class="preview-notice" id="form-mode">${icon('info')}<span>Version de démonstration locale : les demandes sont enregistrées sur cet ordinateur. Aucun email n’est envoyé.</span></div>
      <form id="quote-form" action="/api/devis" method="post" enctype="multipart/form-data"><div class="form-grid">
        ${field('Nom *', '<input name="nom" required minlength="2" maxlength="120" autocomplete="name" placeholder="Nom *">')}
        ${field('Téléphone *', '<input name="telephone" type="tel" required minlength="8" maxlength="30" autocomplete="tel" placeholder="Téléphone *">')}
        ${field('Email *', '<input name="email" type="email" required maxlength="254" autocomplete="email" placeholder="Email *">')}
        ${field('Ville *', '<input name="ville" required minlength="2" maxlength="120" autocomplete="address-level2" placeholder="Ville et code postal *">')}
        <label class="field full"><span class="sr-only">Nuisible concerné *</span><select name="nuisible" required><option value="">Nuisible concerné *</option>${services.map(s => `<option>${s.name}</option>`).join('')}<option>Je ne sais pas</option></select>${icon('caret-down', 'select-caret')}</label>
        ${field('Description du problème *', '<textarea name="description" required minlength="10" maxlength="5000" rows="5" placeholder="Description du problème * : où avez-vous observé les nuisibles ? Depuis quand ? Quelles pièces sont concernées ?"></textarea>').replace('class="field"', 'class="field full"')}
        <div class="full"><label class="upload-zone" for="photos">${icon('upload-simple')}<strong>Ajouter des photos <span class="optional">(facultatif)</span></strong><span>Jusqu’à 3 photos · JPEG, PNG ou WebP · 5 Mo par photo</span><input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple aria-describedby="photo-help"></label><p id="photo-help" class="small-note">Prenez vos photos à distance, sans vous exposer. Évitez les personnes et les informations privées.</p><div id="photo-preview" aria-live="polite"></div></div>
        <div class="hp" aria-hidden="true"><label>Site internet<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <label class="consent full"><input type="checkbox" name="consentement" value="oui" required><span>J’accepte que mes informations et mes photos soient utilisées pour traiter ma demande de devis. * <button type="button" data-modal="privacy">Politique de confidentialité</button></span></label>
      </div>${btn('Envoyer ma demande', '', { tag: 'button', attrs: 'id="submit-quote" type="submit"', iconName: 'paper-plane-tilt' })}<p class="form-status" id="form-status" role="status" aria-live="polite"></p></form>
    </div>
  </div></section>${faq(generalFaq.slice(0, 3), 'Avant d’envoyer\nvotre demande')}`;
}
