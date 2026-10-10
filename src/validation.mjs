const choices = new Set(['Frelons et guêpes','Punaises de lit','Cafards et blattes','Je ne sais pas']);
export function validateQuote(input = {}) {
  const fields = ['nom','telephone','email','ville','nuisible','description'];
  if(fields.some(k=>typeof input[k]!=='string')) return {error:'Renseignez tous les champs obligatoires.'};
  const data=Object.fromEntries(fields.map(k=>[k,input[k].trim()]));
  if(data.nom.length<2||data.nom.length>120||data.ville.length<2||data.ville.length>120) return {error:'Vérifiez votre nom et votre ville (2 à 120 caractères).'};
  if(!/^[+\d\s().-]{8,30}$/.test(data.telephone)||data.telephone.replace(/\D/g,'').length<8) return {error:'Renseignez un numéro de téléphone valide.'};
  if(data.email.length>254||!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(data.email)) return {error:'Renseignez une adresse email valide.'};
  if(!choices.has(data.nuisible)) return {error:'Sélectionnez le nuisible concerné.'};
  if(data.description.length<10||data.description.length>5000) return {error:'Décrivez le problème en 10 à 5 000 caractères.'};
  if(input.consentement!=='oui') return {error:'Votre accord est nécessaire pour traiter cette demande.'};
  if([data.nom,data.ville,data.telephone,data.email].some(v=>/[\r\n\x00]/.test(v))) return {error:'Un champ contient des caractères non autorisés.'};
  return {data:{...data,consentement:true,consentVersion:'2026-10-08'}};
}
