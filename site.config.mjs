// All unverified business information stays empty. Never invent credentials or reviews.
export const business = {
  name: 'PRO NUISIBLES',
  homepageOnly: true, // Client preview: only the homepage is generated and published.
  siteUrl: process.env.PUBLIC_ORIGIN || 'http://127.0.0.1:4173',
  indexable: false,
  phone: '', // international format, e.g. +33...
  whatsapp: '', // country code + digits, without +
  email: '', address: '', hours: '', legalName: '', siret: '',
  postalAddress: null, // optional, for schema.org: { streetAddress, postalCode, addressLocality }
  certifications: [],
  cities: [], // verified communes with a dedicated check: { name: 'Ville réelle', postalCode: '...', slug: 'ville-reelle' }
  reviews: [], // { name, context, quote }, with publication permission
  assetsApproved: false,
  expertImageIsPreview: false,
};

// Coverage confirmed by the client: département des Bouches-du-Rhône (13) only.
// Communes come from the Bouches-du-Rhône section of villes_region_paca.pdf; other départements are deliberately excluded.
export const serviceArea = {
  department: 'Bouches-du-Rhône',
  code: '13',
  region: 'Provence-Alpes-Côte d’Azur',
  // Shown on the homepage (kept short on purpose, no keyword stuffing).
  featuredCities: ['Marseille', 'Aix-en-Provence', 'Arles', 'Aubagne', 'Martigues', 'Istres', 'Salon-de-Provence', 'Vitrolles'],
  // Full confirmed list, reserved for the future « Services et zones d’intervention » page.
  communes: ['Marseille', 'Aix-en-Provence', 'Arles', 'Martigues', 'Aubagne', 'Istres', 'Salon-de-Provence', 'Vitrolles', 'Marignane', 'La Ciotat', 'Miramas', 'Fos-sur-Mer', 'Gardanne', 'Allauch', 'Plan-de-Cuques', 'Les Pennes-Mirabeau', 'Bouc-Bel-Air', 'Cabriès', 'Châteaurenard', 'Berre-l’Étang', 'Port-de-Bouc', 'Port-Saint-Louis-du-Rhône', 'Saint-Martin-de-Crau', 'Tarascon', 'Trets', 'Rognac', 'Septèmes-les-Vallons', 'Le Rove', 'Gignac-la-Nerthe', 'Carry-le-Rouet', 'Sausset-les-Pins', 'Saint-Rémy-de-Provence', 'Éguilles', 'Lambesc', 'Pélissanne', 'La Fare-les-Oliviers', 'Velaux', 'Lançon-Provence', 'Châteauneuf-les-Martigues'],
};

// Absolute URL for a site path. PUBLIC_ORIGIN may include a sub-folder (GitHub Pages), which new URL('/x', base) would drop.
export const absoluteUrl = (sitePath = '/') => `${business.siteUrl.replace(/\/+$/, '')}${sitePath.startsWith('/') ? sitePath : `/${sitePath}`}`;
