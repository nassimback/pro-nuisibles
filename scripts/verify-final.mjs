import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes } from '../src/content.mjs';
const base='http://127.0.0.1:4173';
const valid={nom:'Vérification fictive',telephone:'0600000000',email:'test@example.com',ville:'Ville de test',nuisible:'Frelons et guêpes',description:'Une demande fictive utilisée uniquement pour le contrôle local.',consentement:'oui'};
async function send(changes={},file=null,origin=base){const data=new FormData();for(const [k,v] of Object.entries({...valid,...changes}))data.append(k,v);if(file)data.append('photos',file,'test-photo.jpg');return fetch(base+'/api/devis',{method:'POST',headers:{Origin:origin},body:data});}
const api=[];
for(const [label,result,expected] of [
  ['Cross-origin rejected',await send({},null,'https://example.com'),403],
  ['Consent required on server',await send({consentement:'non'}),422],
  ['Fake image rejected',await send({},new Blob(['not an image'],{type:'image/jpeg'})),422],
  ['Disallowed file MIME rejected',await send({},new Blob(['not an image'],{type:'text/plain'})),400],
]){assert.equal(result.status,expected,label);api.push({label,status:result.status});}
const image=await fs.readFile('assets/wasp.jpg');const result=await send({},new Blob([image],{type:'image/jpeg'}));assert.equal(result.status,201);const payload=await result.json();assert.equal(payload.mode,'preview');
const folder=path.join('var','requests',payload.id);const record=JSON.parse(await fs.readFile(path.join(folder,'request.json'),'utf8'));assert.equal(record.status,'local-preview');assert.equal(record.photos.length,1);assert.ok((await fs.stat(path.join(folder,'notification-admin.txt'))).size>0);assert.ok((await fs.stat(path.join(folder,'accuse-client.txt'))).size>0);assert.equal((await fetch(`${base}/var/requests/${payload.id}/request.json`)).status,404);api.push({label:'Photo and two email previews persisted privately',status:201});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',bypassCSP:true});const page=await context.newPage();
const mobile=[];
for(const r of routes){await page.goto(base+r.path);await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{});}await document.fonts.ready;});const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();mobile.push({path:r.path,violations:audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});await page.setViewportSize({width:320,height:800});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`320px overflow ${r.path}`);await page.setViewportSize({width:390,height:844});}
await page.goto(base);await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{});}await document.fonts.ready;});await page.screenshot({path:'test-results/home-mobile-viewport.png'});
await page.goto(base+'/contact-devis/');await page.screenshot({path:'test-results/contact-mobile-viewport.png'});
await page.setViewportSize({width:1440,height:1000});await page.goto(base);await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{});}await document.fonts.ready;});await page.screenshot({path:'test-results/home-viewport.png'});
const links=await page.locator('a[href^="/"]').evaluateAll(a=>[...new Set(a.map(el=>el.getAttribute('href').split('#')[0]))]);for(const link of links)assert.equal((await fetch(base+link)).status,200,link);
await page.goto(base+'/contact-devis/');await page.evaluate(()=>document.querySelector('#quote-form').scrollIntoView());await page.screenshot({path:'test-results/contact-form-desktop.png'});
const report={api,mobile,internalLinks:links.length};await fs.writeFile('test-results/final-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();assert.ok(mobile.every(r=>r.violations.length===0));
