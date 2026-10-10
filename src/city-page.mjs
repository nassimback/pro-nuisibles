// Future local pages: opt-in only, with verified coverage and genuinely local copy.
// This module is deliberately not mounted: the delivered site has exactly six pages.
import { shell, esc, quoteButton, serviceCards, faq } from './components.mjs';
export function renderCityPage(city) {
  if(!city.verified || !city.slug || !city.name || !city.localIntroduction || !city.accessNotes || !city.faq?.length) throw new Error('Provide verified coverage, original local content and local FAQs before generating a city page.');
  const route={path:`/zones/${city.slug}/`,label:`Désinsectisation à ${city.name}`,title:`Désinsectisation à ${city.name} | PRO NUISIBLES`,description:city.metaDescription};
  if(!route.description)throw new Error('Provide a unique local meta description.');
  return {route,html:shell(route,`<section class="section"><div class="container"><div class="breadcrumb"><a href="/">Accueil</a><a href="/services-et-zones-intervention/">Nos zones</a></div><h1>Désinsectisation à ${esc(city.name)}</h1><p>${esc(city.localIntroduction)}</p>${quoteButton('Demander un devis','btn btn-green',`?ville=${encodeURIComponent(city.name)}`)}</div></section><section class="section"><div class="container"><h2>Préparer votre intervention à ${esc(city.name)}</h2><p>${esc(city.accessNotes)}</p>${serviceCards()}</div></section>${faq(city.faq)}`)};
}
