import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { routes } from '../src/content.mjs';
const base='http://127.0.0.1:4173';
await fs.mkdir('test-results',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',bypassCSP:true});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report={routes:[],accessibility:[],layout:[],interactions:[],errors};
async function loadImages(){
  await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{});}await document.fonts.ready;});
}
for(const route of routes){
  const response=await page.goto(base+route.path);await loadImages();
  assert.equal(response.status(),200,route.path);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.title(),route.title);
  const images=await page.locator('img').evaluateAll(images=>images.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));assert.deepEqual(images,[]);
  report.routes.push({path:route.path,status:response.status(),title:await page.title()});
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.accessibility.push({path:route.path,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  await page.screenshot({path:`test-results/${route.path==='/'?'home':route.path.split('/')[1]}-desktop.png`,fullPage:true});
  for(const width of [390,768,1024,1440]){
    await page.setViewportSize({width,height:900});
    const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
    report.layout.push({path:route.path,width,overflow:dims.scroll>width});assert.ok(dims.scroll<=width,`${route.path} overflows at ${width}`);
  }
}
await page.setViewportSize({width:390,height:844});await page.goto(base);await loadImages();await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});await page.screenshot({path:'test-results/home-mobile-viewport.png'});
await page.getByRole('button',{name:'Ouvrir le menu'}).click();assert.equal(await page.locator('#navigation').isVisible(),true);await page.getByRole('button',{name:'Fermer le menu'}).click();
await page.locator('.hero-actions [data-contact="phone"]').click();await page.locator('dialog').waitFor({state:'visible'});await page.getByRole('button',{name:'Fermer',exact:true}).click();report.interactions.push('Mobile menu, unavailable contact dialog and close');
await page.selectOption('#quick-pest','Punaises de lit');await page.fill('#quick-city','Commune de test');await page.getByRole('button',{name:'Préparer ma demande'}).click();
assert.equal(await page.locator('[name="ville"]').inputValue(),'Commune de test');assert.equal(await page.locator('[name="nuisible"]').inputValue(),'Punaises de lit');report.interactions.push('Hero form preserves city and service on contact page');
await page.getByRole('textbox',{name:'Nom *',exact:true}).fill('Client fictif QA');await page.getByRole('textbox',{name:'Téléphone *',exact:true}).fill('0600000000');await page.getByRole('textbox',{name:'Email *',exact:true}).fill('qa@example.com');await page.locator('textarea[name="description"]').fill('Essai local fictif du formulaire avec une photographie.');
await page.setInputFiles('#photos','assets/wasp.jpg');assert.equal(await page.locator('.photo-thumb').count(),1);await page.locator('[name="consentement"]').check();
await page.getByRole('button',{name:'Envoyer ma demande'}).click();await page.locator('#form-status.success').waitFor();assert.match(await page.locator('#form-status').textContent(),/aucun email n’a été envoyé/);report.interactions.push('Quote with photo and consent is stored locally; no false email success');
await page.screenshot({path:'test-results/contact-mobile-success.png',fullPage:true});
await page.goto(base+'/services-et-zones-intervention/');await page.fill('#coverage-city','Ville de test');await page.getByRole('button',{name:'Vérifier',exact:false}).click();await page.locator('#coverage-result a').waitFor();report.interactions.push('Coverage check reports unconfirmed city honestly');
await page.goto(base);await page.locator('.faq-list summary').nth(1).click();assert.equal(await page.locator('.faq-list details').nth(1).getAttribute('open'),'');assert.equal(await page.locator('.faq-list details').first().getAttribute('open'),null);report.interactions.push('FAQ accordion');
await page.setViewportSize({width:1440,height:1000});await page.goto(base);await loadImages();await page.screenshot({path:'test-results/home-viewport.png'});
await fs.writeFile('test-results/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
assert.deepEqual(errors,[]);
assert.ok(report.accessibility.every(r=>r.violations.length===0),'Accessibility issues remain; see report.json');
