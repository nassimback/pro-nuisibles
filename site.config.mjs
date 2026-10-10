// All unverified business information stays empty. Never invent credentials or reviews.
export const business = {
  name: 'PRO NUISIBLES',
  siteUrl: process.env.PUBLIC_ORIGIN || 'http://127.0.0.1:4173',
  indexable: false,
  phone: '', // international format, e.g. +33...
  whatsapp: '', // country code + digits, without +
  email: '', address: '', hours: '', legalName: '', siret: '',
  certifications: [],
  cities: [], // { name: 'Ville réelle', postalCode: '...', slug: 'ville-reelle' }
  reviews: [], // { name, context, quote }, with publication permission
  assetsApproved: false,
  expertImageIsPreview: false,
};
