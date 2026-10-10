import { readFileSync } from 'node:fs';
import { business } from '../site.config.mjs';
import { services, routes } from './content.mjs';

export const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iconCache = new Map();
export function icon(name, extra = '', weight = 'regular') {
  const key = `${weight}/${name}`;
  if (!iconCache.has(key)) iconCache.set(key, readFileSync(new URL(`../node_modules/@phosphor-icons/core/assets/${weight}/${name}${weight === 'regular' ? '' : '-' + weight}.svg`, import.meta.url), 'utf8').replace('<svg ', '<svg class="icon" aria-hidden="true" focusable="false" '));
  return `<span class="icon-wrap ${extra}">${iconCache.get(key)}</span>`;
}
export const photo = (name, alt, cls = '', eager = false, sizes = '(max-width: 767px) 100vw, 50vw') => `<picture class="${cls}"><source type="image/webp" srcset="/assets/${name}-640.webp 640w, /assets/${name}-1280.webp 1280w, /assets/${name}-1800.webp 1800w" sizes="${sizes}"><img src="/assets/${name}-1280.webp" alt="${esc(alt)}" width="1280" height="853" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"></picture>`;

// Motion hooks, read by public/app.js: fade-up entrance (Elementor fadeInUp), letter reveal and clip reveal.
export const up = (delay = 0) => `data-anim="up"${delay ? ` data-delay="${delay}"` : ''}`;

// Theme button: lime pill-corner button whose fill grows from the pointer (ElementsKit "position aware").
export function btn(label, href, { variant = '', attrs = '', iconName = 'arrow-right', tag = 'a' } = {}) {
  const inner = `<span class="btn-text">${label}</span>${iconName ? icon(iconName, 'btn-icon') : ''}<span class="btn-fill" aria-hidden="true"></span>`;
  return tag === 'button' ? `<button class="btn ${variant}" ${attrs}>${inner}</button>` : `<a class="btn ${variant}" href="${href}" ${attrs}>${inner}</a>`;
}
export const quoteButton = (label = 'Demander un devis', cls = '', query = '') => btn(label, `/contact-devis/${query}`, { variant: cls.replace(/\bbtn\b|btn-lime|btn-green/g, '').trim() });

function contactHref(kind) {
  const number = kind === 'phone' ? business.phone : business.whatsapp;
  if (business.homepageOnly) return `href="#" data-contact="${kind}"`;
  if (!number) return `href="#coordonnees" data-contact="${kind}"`;
  return kind === 'phone' ? `href="tel:${esc(number)}"` : `href="https://wa.me/${esc(number)}" target="_blank" rel="noopener noreferrer"`;
}
export function action(kind, label, cls = 'btn') {
  const name = kind === 'phone' ? 'phone' : 'whatsapp-logo';
  if (cls === 'btn') return `<a class="btn" ${contactHref(kind)}><span class="btn-text">${label}</span>${icon(name, 'btn-icon')}<span class="btn-fill" aria-hidden="true"></span></a>`;
  if (cls === 'play') return `<a class="play-link" ${contactHref(kind)}><span class="play-circle">${icon(name)}</span><span>${label}</span></a>`;
  return `<a class="${cls}" ${contactHref(kind)}>${icon(name)}<span>${label}</span></a>`;
}

export const pill = (label, tone = '') => `<span class="pill ${tone}">${label}</span>`;
export const heading = (tag, html, cls = '', id = '') => `<${tag} class="split ${cls}"${id ? ` id="${id}"` : ''}>${html}</${tag}>`;

const logoMark = `<svg viewBox="0 0 50 50" aria-hidden="true" focusable="false"><circle cx="25" cy="25" r="25" fill="#C7F268"/><g fill="none" stroke="#033F2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="25" cy="29" rx="5" ry="8"/><circle cx="25" cy="17.5" r="3.4"/><path d="M23 14.5l-3-4M27 14.5l3-4M20 25l-6-3M20 30h-7M20.5 34.5l-5 4M30 25l6-3M30 30h7M29.5 34.5l5 4M25 23v14"/></g></svg>`;
export const logo = () => `<a class="brand" href="/" aria-label="PRO NUISIBLES, accueil">${logoMark}<span class="brand-name">PRO Nuisibles</span></a>`;

let badgeCount = 0;
export function badge(cls = '') {
  const id = `badge-ring-${++badgeCount}`;
  return `<div class="spin-badge ${cls}" aria-hidden="true"><svg viewBox="0 0 140 140"><defs><path id="${id}" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0"/></defs><circle cx="70" cy="70" r="70" class="badge-bg"/><text><textPath href="#${id}" textLength="322" lengthAdjust="spacing">PRO NUISIBLES • DÉSINSECTISATION • PRÉVENTION • </textPath></text></svg><span class="badge-core">${icon('bug')}</span></div>`;
}

// Line-art insect used as a swinging corner decoration, like the theme's section corners.
export const bugArt = (cls = '') => `<svg class="bug-art ${cls}" viewBox="0 0 220 220" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="110" cy="128" rx="22" ry="44"/><path d="M90 112c13 6 27 6 40 0M89 128c14 6 28 6 42 0M91 144c12 6 26 6 38 0M96 159c9 5 19 5 28 0"/><ellipse cx="110" cy="76" rx="17" ry="14"/><circle cx="110" cy="52" r="12"/><circle cx="103" cy="49" r="4"/><circle cx="117" cy="49" r="4"/><path d="M104 42c-6-14-16-22-30-26M116 42c6-14 16-22 30-26"/><path d="M95 72C64 46 26 40 12 56c-12 14 6 34 42 34 18 0 32-6 41-12z"/><path d="M125 72c31-26 69-32 83-16 12 14-6 34-42 34-18 0-32-6-41-12z"/><path d="M95 80C70 82 40 96 34 112c-5 14 14 20 34 10 14-7 24-20 29-28M125 80c25 2 55 16 61 32 5 14-14 20-34 10-14-7-24-20-29-28"/><path d="M95 86l-28 18-12 26M94 96l-34 34-6 30M98 108l-26 44 2 34M125 86l28 18 12 26M126 96l34 34 6 30M122 108l26 44-2 34"/><path d="M40 62c16 2 34 8 48 16M180 62c-16 2-34 8-48 16"/></g></svg>`;

const navItems = [
  { path: '/', label: 'Accueil' },
  { label: 'Nos solutions', children: services.map(s => ({ path: `/${s.slug}/`, label: s.name })) },
  { path: '/services-et-zones-intervention/', label: 'Services & zones' },
  { path: '/contact-devis/', label: 'Contact' },
];
export function header(current, variant = 'line') {
  const link = (item) => `<a href="${item.path}" ${current === item.path ? 'aria-current="page"' : ''}>${item.label}</a>`;
  const items = navItems.map(item => item.children
    ? `<li class="has-sub${item.children.some(c => c.path === current) ? ' is-current' : ''}"><button type="button" class="sub-toggle" aria-expanded="false">${item.label}${icon('caret-down', 'caret')}</button><ul class="sub-menu">${item.children.map(c => `<li>${link(c)}</li>`).join('')}</ul></li>`
    : `<li>${link(item)}</li>`).join('');
  return `<a class="skip" href="#contenu">Aller au contenu</a>
  <header class="site-header header-${variant}"><div class="header-bar"><div class="header-inner">${logo()}<nav id="navigation" aria-label="Navigation principale"><ul class="nav-list">${items}</ul><div class="nav-mobile-cta">${btn('Demander un devis', '/contact-devis/')}</div></nav><div class="header-cta">${btn('Demander un devis', '/contact-devis/', { variant: 'btn-white-fill' })}</div><button class="menu-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="navigation"><span></span><span></span><span></span></button></div></div></header>`;
}

export function faqList(items, numbered = true) {
  return `<div class="faq-list">${items.map(([q, a], i) => `<details ${up(i ? Math.min(i * 100, 400) : 0)}${i === 0 ? ' open' : ''}><summary><span>${numbered ? `${i + 1}. ` : ''}${esc(q)}</span>${icon('arrow-down', 'faq-icon')}</summary><div class="faq-answer"><p>${esc(a)}</p></div></details>`).join('')}</div>`;
}

export function faq(items, title = 'Vos questions,\nnos réponses.', intro = 'Les bonnes informations pour avancer sereinement face aux nuisibles, avant même de demander un devis.') {
  return `<section class="block"><div class="box box-white has-corners">${bugArt('corner corner-tr')}${bugArt('corner corner-bl')}<div class="container">
    <div class="split-head"><div>${pill('Questions fréquentes', 'pill-grey')}${heading('h2', title.replace('\n', '<br>'))}</div><div><p ${up()}>${intro}</p><div ${up(100)}>${btn('Poser ma question', '/contact-devis/')}</div></div></div>
    <div class="faq-layout"><div class="faq-visual img-reveal">${photo('treatment', 'Traitement d’une surface intérieure par un professionnel équipé', '', false, '(max-width: 1024px) 100vw, 40vw')}<div class="glass-stat"><span class="glass-icon">${icon('chat-circle-text')}</span><p>Un doute ? Décrivez ce que vous observez, nous vous aidons à identifier la prochaine étape.</p></div></div>${faqList(items)}</div>
  </div></div></section>`;
}

// Service cards: grey card, lime icon; on hover the photo rises with a green veil (theme "service-item").
export function serviceCards(exclude = '') {
  return `<div class="service-grid">${services.filter(s => s.slug !== exclude).map((s, i) => `<a class="service-card" href="/${s.slug}/" ${up(i * 100)}><span class="service-card-bg">${photo(s.image, '', '', false, '(max-width: 767px) 100vw, 33vw')}</span><span class="icon-circle">${icon(s.icon)}</span><h3>${s.name}</h3><p>${s.summary}</p><span class="text-link">Découvrir la solution ${icon('arrow-right')}</span></a>`).join('')}</div>`;
}

export function helpLine(text, linkLabel, href) {
  return `<p class="help-line" ${up()}><span class="help-dots"><span class="dot-photo">${photo('technician', '', '', false, '40px')}</span><span class="dot-icon">${icon('phone')}</span></span><span>${text} – <a href="${href}">${linkLabel}</a></span></p>`;
}

export function processSection(title = 'De l’inspection à la prévention,<br>une démarche claire.') {
  const steps = [
    ['Vous décrivez la situation', 'Le nuisible observé, les pièces concernées, votre commune : quelques détails suffisent pour préparer le premier échange.', 'technician'],
    ['Inspection & diagnostic', 'L’identification du nuisible et l’évaluation des lieux orientent la méthode, le périmètre et les précautions.', 'treatment'],
    ['Traitement adapté', 'Une intervention ciblée, expliquée dans un devis précis, avec des consignes claires pour les occupants.', 'hero'],
    ['Prévention & suivi', 'Des conseils de prévention et des modalités de suivi pour surveiller l’évolution de la situation.', 'wasp'],
  ];
  return `<section class="block"><div class="box box-white has-corners">${bugArt('corner corner-tr')}${bugArt('corner corner-bl')}<div class="container">
    <div class="center-head">${pill('Notre démarche', 'pill-grey')}${heading('h2', title)}</div>
    <ol class="steps">${steps.map(([h, t, img], i) => `<li class="step ${i % 2 ? 'step-low' : ''}" ${up(i * 100)}><div class="step-text"><h3>${h}</h3><p>${t}</p></div><span class="step-no">0${i + 1}</span><div class="step-photo">${photo(img, '', '', false, '200px')}</div></li>`).join('')}</ol>
  </div></div></section>`;
}

export function finalCta() {
  return `<section class="block"><div class="box box-dark cta-box">${bugArt('corner corner-tr light')}<div class="container cta-layout"><div>${pill('Faisons le premier pas', 'pill-glass')}${heading('h2', 'Un espace protégé.<br>L’esprit tranquille.')}<p ${up()}>Un doute sur un nuisible ? Décrivez-nous la situation : nous vous aidons à choisir la prochaine étape.</p><div class="cta-actions" ${up(100)}>${btn('Parler de ma situation', '/contact-devis/', { variant: 'btn-white-fill' })}${action('phone', 'Appeler un expert', 'play')}</div></div>${badge('cta-badge')}</div></div></section>`;
}

export function footer() {
  const contactItems = [
    ['envelope-simple', 'Email', business.email || '[Email à renseigner]'],
    ['phone', 'Téléphone', business.phone || '[Téléphone à renseigner]'],
    ['clock', 'Horaires', business.hours || '[Horaires à renseigner]'],
  ];
  return `<footer class="block footer"><div class="box box-dark">${bugArt('corner corner-tr light')}${bugArt('corner corner-bl light')}<div class="container">
    <div class="footer-strip">${logo()}${contactItems.map(([ic, label, value]) => `<div class="footer-info"><span class="icon-circle lg">${icon(ic)}</span><div><h3>${label} :</h3><p>${esc(value)}</p></div></div>`).join('')}</div>
    <div class="footer-grid">
      <div class="footer-about"><p>Des solutions contre les nuisibles et un accompagnement clair pour retrouver des lieux sereins.</p><h3>Restons en contact :</h3><div class="footer-socials">${action('phone', 'Appeler', 'round-link')}${action('whatsapp', 'WhatsApp', 'round-link')}<a class="round-link" href="/contact-devis/">${icon('envelope-simple')}<span>Écrire</span></a></div></div>
      <div><h3>Liens utiles</h3><ul class="star-list"><li><a href="/">Accueil</a></li><li><a href="/services-et-zones-intervention/">Services & zones</a></li><li><a href="/contact-devis/">Contact & devis</a></li><li><a href="/services-et-zones-intervention/#zones">Vérifier ma commune</a></li></ul></div>
      <div><h3>Nos solutions</h3><ul class="star-list">${services.map(s => `<li><a href="/${s.slug}/">${s.name}</a></li>`).join('')}</ul></div>
      <div class="footer-zone"><h3>Votre commune est-elle desservie ?</h3><p>${business.address ? esc(business.address) : '[Adresse à renseigner]'} · Indiquez votre ville pour préparer votre demande.</p><form class="footer-form" action="/contact-devis/" method="get"><label class="sr-only" for="footer-city">Votre ville</label><input id="footer-city" name="commune" placeholder="Votre ville ou code postal *" autocomplete="address-level2" required maxlength="120"><button type="submit" aria-label="Envoyer ma ville">${icon('arrow-right')}</button></form></div>
    </div>
    <div class="footer-bottom"><p>© ${new Date().getFullYear()} PRO NUISIBLES. Tous droits réservés.</p><ul class="star-inline"><li><button type="button" data-modal="legal">Mentions légales</button></li><li><button type="button" data-modal="privacy">Confidentialité</button></li><li><button type="button" data-modal="credits">Crédits photos</button></li></ul></div>
  </div></div></footer>
  <div class="mobile-cta">${action('phone', 'Appeler', 'mobile-action')}${action('whatsapp', 'WhatsApp', 'mobile-action')}<a class="mobile-action is-lime" href="/contact-devis/">${icon('file-text')}<span>Devis</span></a></div>
  <dialog id="info-dialog" aria-labelledby="dialog-title"><button class="dialog-close" type="button" aria-label="Fermer">${icon('x')}</button><div id="dialog-content"></div></dialog>`;
}

export function quickForm() {
  const select = (id, name, label, options) => `<div class="field"><label class="sr-only" for="${id}">${label}</label><select id="${id}" name="${name}" ${name === 'nuisible' ? 'required' : ''}><option value="">${label}${name === 'nuisible' ? ' *' : ''}</option>${options.map(o => `<option>${o}</option>`).join('')}</select>${icon('caret-down', 'select-caret')}</div>`;
  return `<form class="quick-form" action="/contact-devis/" method="get">
    ${select('quick-pest', 'nuisible', 'Nuisible concerné', [...services.map(s => s.name), 'Je ne sais pas'])}
    <div class="field"><label class="sr-only" for="quick-city">Votre ville</label><input id="quick-city" name="ville" placeholder="Votre ville ou code postal *" autocomplete="address-level2" required maxlength="120"></div>
    ${select('quick-place', 'lieu', 'Type de lieu', ['Maison', 'Appartement', 'Commerce ou bureau', 'Copropriété', 'Autre'])}
    ${select('quick-since', 'depuis', 'Observé depuis', ['Quelques jours', 'Quelques semaines', 'Plus d’un mois', 'Je ne sais pas'])}
    ${select('quick-zone', 'zone', 'Zone concernée', ['Intérieur', 'Extérieur', 'Intérieur et extérieur'])}
    ${btn('Préparer ma demande', '', { tag: 'button', attrs: 'type="submit"' })}
  </form>`;
}

export function pageHero({ label, heading: title, crumbs = [], image = 'hero' }) {
  return `<section class="page-hero"><div class="page-hero-box">${photo(image, '', 'page-hero-photo', true, '100vw')}<div class="page-hero-shade"></div><div class="container page-hero-inner">${heading('h1', esc(title))}<nav class="breadcrumb" aria-label="Fil d’Ariane" ${up(100)}><a href="/">Accueil</a>${crumbs.map(([t, href]) => `<span aria-hidden="true">/</span>${href ? `<a href="${href}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}`).join('')}</nav></div></div></section>`;
}

// French typography: non-breaking space before ? : ! ; in text nodes only.
const frenchSpacing = html => html.replace(/>([^<]+)</g, (_, text) => `>${text.replace(/ ([?:!;])/g, " $1")}<`);
const previewNavigation = html => business.homepageOnly
  ? html.replace(/href="\/[^\"]*"/g,'href="#"').replace(/action="\/[^\"]*"/g,'action="#"')
  : html;

export function shell(route, body) {
  const canonical = new URL(route.path, business.siteUrl).href;
  const schema = [ { '@context':'https://schema.org', '@type':'Organization', name:business.name, url:business.siteUrl }, { '@context':'https://schema.org', '@type':'WebPage', name:route.title, description:route.description, url:canonical, inLanguage:'fr-FR' } ];
  if (route.path !== '/') schema.push({ '@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Accueil',item:business.siteUrl},{'@type':'ListItem',position:2,name:route.label,item:canonical}] });
  const pageContent=`${header(route.path, route.path === '/' ? 'line' : 'glass')}<main id="contenu">${frenchSpacing(body)}</main>${frenchSpacing(footer())}`;
  return `<!doctype html><html lang="fr" class="no-js"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(route.title)}</title><meta name="description" content="${esc(route.description)}"><meta name="robots" content="${business.indexable ? 'index,follow' : 'noindex,nofollow'}"><meta name="theme-color" content="#033f2d"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:title" content="${esc(route.title)}"><meta property="og:description" content="${esc(route.description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:site_name" content="PRO NUISIBLES"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/inter-tight-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/inter-tight-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/theme.css"><script src="/boot.js"></script><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script><script defer src="/lenis.min.js"></script><script defer src="/app.js"></script></head><body><div class="preloader" aria-hidden="true"><div class="preloader-ring"></div>${logoMark}</div><div id="cursor-ball" aria-hidden="true"></div>${previewNavigation(pageContent)}</body></html>`;
}
