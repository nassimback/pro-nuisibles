import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { business } from '../site.config.mjs';
import { routes, services } from '../src/content.mjs';
import { shell } from '../src/components.mjs';
import { home, servicePage, areasPage, contactPage } from '../src/pages.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
await fs.rm(dist,{recursive:true,force:true});
await fs.mkdir(path.join(dist,'assets'),{recursive:true});
if (business.indexable && (!business.assetsApproved || business.siteUrl.includes('127.0.0.1') || !business.phone || !business.address || !business.cities.length || !business.legalName || !business.siret)) throw new Error('Complétez et vérifiez les informations, le domaine et les droits des photos avant d’activer l’indexation.');
await fs.cp(path.join(root,'public'),dist,{recursive:true});
await fs.copyFile(path.join(root,'node_modules/lenis/dist/lenis.min.js'),path.join(dist,'lenis.min.js'));
await fs.copyFile(path.join(root,'node_modules/@phosphor-icons/core/assets/bold/asterisk-bold.svg'),path.join(dist,'assets','asterisk.svg'));
if (business.indexable && business.expertImageIsPreview) throw new Error('Remplacez ou licenciez le visuel détouré de démonstration avant publication, puis désactivez expertImageIsPreview.');
for(const weight of [400,500,600,700]) await fs.copyFile(path.join(root,`node_modules/@fontsource/inter-tight/files/inter-tight-latin-${weight}-normal.woff2`),path.join(dist,`assets/inter-tight-latin-${weight}-normal.woff2`));
for(const image of ['hero','technician','treatment','wasp','bedbug','cockroach']){
  const input=path.join(root,'assets',`${image}.jpg`);
  for(const width of [640,1280,1800]){
    const output=path.join(dist,'assets',`${image}-${width}.webp`);
    const stat=await fs.stat(output).catch(()=>null), source=await fs.stat(input);
    if(!stat||stat.mtimeMs<source.mtimeMs) await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:image==='hero'?83:79,effort:5}).toFile(output);
  }
}
for(const route of routes){
  let body;
  if(route.path==='/')body=home();
  else if(route.path==='/contact-devis/')body=contactPage();
  else if(route.path==='/services-et-zones-intervention/')body=areasPage();
  else body=servicePage(services.find(s=>route.path===`/${s.slug}/`));
  const folder=path.join(dist,route.path);await fs.mkdir(folder,{recursive:true});await fs.writeFile(path.join(folder,'index.html'),shell(route,body));
}
await fs.writeFile(path.join(dist,'site-data.json'),JSON.stringify({phone:business.phone,whatsapp:business.whatsapp,email:business.email,address:business.address,legalName:business.legalName,siret:business.siret,cities:business.cities}));
await fs.writeFile(path.join(dist,'robots.txt'),`User-agent: *\n${business.indexable?'Allow: /':'Disallow: /'}\nSitemap: ${new URL('/sitemap.xml',business.siteUrl).href}\n`);
await fs.writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${new URL(r.path,business.siteUrl).href}</loc></url>`).join('')}</urlset>`);
await fs.writeFile(path.join(dist,'favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#103f30"/><text x="32" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="#c7f268">PN</text></svg>');
const basePath=(process.env.PUBLIC_BASE_PATH||'').replace(/\/$/,'');
if(basePath){
  const textFiles=[];
  async function collect(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await collect(file);else if(/\.(?:html|css|js)$/.test(entry.name))textFiles.push(file);}}
  await collect(dist);
  for(const file of textFiles){
    let content=await fs.readFile(file,'utf8');
    if(file.endsWith('.html'))content=content.replaceAll('href="/','href="'+basePath+'/').replaceAll('src="/','src="'+basePath+'/').replaceAll('action="/','action="'+basePath+'/');
    if(file.endsWith('.css'))content=content.replaceAll("url('/","url('"+basePath+'/').replaceAll('url("/','url("'+basePath+'/');
    if(file.endsWith('.js'))content=content.replaceAll("fetch('/","fetch('"+basePath+'/').replaceAll('href=`/','href=`'+basePath+'/').replaceAll('href="/','href="'+basePath+'/').replaceAll("href='/","href='"+basePath+'/');
    await fs.writeFile(file,content);
  }
}
console.log(`Built ${routes.length} pages in dist/. Preview is ${business.indexable?'indexable':'noindex'}.`);
