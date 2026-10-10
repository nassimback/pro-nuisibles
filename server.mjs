import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateQuote } from './src/validation.mjs';

const root=fileURLToPath(new URL('.',import.meta.url));
const port=Number(process.env.PORT||4173), host=process.env.HOST||'127.0.0.1';
const origin=process.env.PUBLIC_ORIGIN||`http://${host}:${port}`;
const mode=process.env.FORM_MODE||'preview';
if(!['preview','smtp'].includes(mode)) throw new Error('FORM_MODE must be preview or smtp');
if(mode==='smtp'&&['SMTP_HOST','SMTP_USER','SMTP_PASS','MAIL_FROM','ADMIN_EMAIL'].some(k=>!process.env[k])) throw new Error('SMTP configuration incomplete: refusing to report successful delivery.');
const transport=mode==='smtp'?nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==='true',requireTLS:process.env.SMTP_SECURE!=='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:10000,socketTimeout:20000,disableFileAccess:true,disableUrlAccess:true}):null;
const app=express();app.disable('x-powered-by');
// Deliberately do not trust arbitrary X-Forwarded-For. Configure a known proxy before deployment.
app.use((req,res,next)=>{
  res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; img-src 'self' blob:; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"});
  next();
});
app.get('/api/config',(_req,res)=>res.set('Cache-Control','no-store').json({mode}));
const requests=new Map();
const cleanup=setInterval(()=>{const now=Date.now();for(const [ip,data] of requests)if(data.until<now)requests.delete(ip);},60000);cleanup.unref();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:3,fields:10,fieldSize:20000,parts:14},fileFilter:(_req,file,cb)=>['image/jpeg','image/png','image/webp'].includes(file.mimetype)?cb(null,true):cb(new Error('Unsupported file type'))}).array('photos',3);
app.post('/api/devis',(req,res,next)=>{
  res.set('Cache-Control','no-store');
  if(req.get('origin')!==origin) return res.status(403).json({error:'Origine de la demande non autorisée. Rechargez le formulaire depuis le site.'});
  if(Number(req.get('content-length')||0)>16*1024*1024)return res.status(413).json({error:'La demande dépasse la taille autorisée.'});
  const now=Date.now(),ip=req.ip;let rate=requests.get(ip);
  if(!rate||rate.until<now){rate={count:0,until:now+15*60*1000};requests.set(ip,rate);}
  if(++rate.count>8)return res.status(429).set('Retry-After','900').json({error:'Trop de demandes ont été envoyées. Réessayez dans 15 minutes.'});
  next();
}, upload, async(req,res)=>{
  if(req.body.website)return res.status(400).json({error:'Demande non valide.'});
  const validation=validateQuote(req.body);if(validation.error)return res.status(422).json(validation);
  const id=randomUUID(), data={id,createdAt:new Date().toISOString(),...validation.data,mode,status:mode==='preview'?'local-preview':'pending'};
  let images;
  try {
    images=await Promise.all((req.files||[]).map(async(file,i)=>{
      const image=sharp(file.buffer,{limitInputPixels:25000000,animated:false});const meta=await image.metadata();
      if(!['jpeg','png','webp'].includes(meta.format)||(meta.pages||1)>1)throw new Error('Unsupported image');
      return {filename:`photo-${i+1}.webp`,content:await image.rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:80}).toBuffer(),contentType:'image/webp'};
    }));
  } catch {return res.status(422).json({error:'Une photo est illisible ou trop grande. Utilisez des images JPEG, PNG ou WebP de moins de 25 mégapixels.'});}
  const folder=path.join(root,'var','requests',id);
  try {
    await fs.mkdir(folder,{recursive:true});
    for(const image of images)await fs.writeFile(path.join(folder,image.filename),image.content);
    data.photos=images.map(i=>i.filename);
    const save=()=>fs.writeFile(path.join(folder,'request.json'),JSON.stringify(data,null,2));
    await save();
    const adminText=`Nouvelle demande ${id}\n\nNom : ${data.nom}\nTéléphone : ${data.telephone}\nEmail : ${data.email}\nVille : ${data.ville}\nNuisible : ${data.nuisible}\n\n${data.description}\n\nConsentement recueilli le ${data.createdAt}.`;
    const customerText=`Bonjour ${data.nom},\n\nVotre demande concernant ${data.nuisible.toLowerCase()} à ${data.ville} a bien été reçue par PRO NUISIBLES.\n\nRéférence : ${id}\nNous examinerons les informations transmises afin de préparer la suite. Cet accusé de réception ne confirme ni rendez-vous, ni prix, ni intervention.\n\nPRO NUISIBLES`;
    if(mode==='preview'){
      await fs.writeFile(path.join(folder,'notification-admin.txt'),adminText);
      await fs.writeFile(path.join(folder,'accuse-client.txt'),customerText);
      return res.status(201).json({id,mode,message:`Demande de test enregistrée sur cet ordinateur. Référence : ${id.slice(0,8)}. Les photos et les deux emails préparés ont été sauvegardés localement ; aucun email n’a été envoyé.`});
    }
    try {
      const sent=await transport.sendMail({from:process.env.MAIL_FROM,to:process.env.ADMIN_EMAIL,replyTo:{address:data.email,name:data.nom},subject:`Demande de devis PRO NUISIBLES · ${data.nuisible}`,text:adminText,attachments:images});
      if(!sent.accepted?.length)throw new Error('No recipient accepted');
      data.status='admin-notified';await save();
    } catch {
      data.status='admin-delivery-failed';await save();
      return res.status(503).json({error:`Votre demande a été conservée sous la référence ${id.slice(0,8)}, mais la notification n’a pas pu être transmise. Contactez-nous directement en indiquant cette référence.`});
    }
    try {
      const ack=await transport.sendMail({from:process.env.MAIL_FROM,to:{address:data.email,name:data.nom},subject:'Votre demande de devis PRO NUISIBLES',text:customerText});
      if(!ack.accepted?.length)throw new Error('Acknowledgment rejected');
      data.status='emails-sent';await save();
      return res.status(201).json({id,mode,message:`Votre demande a été reçue. Un accusé de réception a été envoyé à votre adresse email. Référence : ${id.slice(0,8)}.`});
    } catch {
      data.status='acknowledgment-failed';await save();
      return res.status(201).json({id,mode,message:`Votre demande a été reçue, mais l’accusé de réception email n’a pas pu être envoyé. Ne renvoyez pas le formulaire. Référence : ${id.slice(0,8)}.`});
    }
  } catch {return res.status(500).json({error:'La sauvegarde n’a pas pu être confirmée. Réessayez plus tard ou contactez-nous directement.'});}
});
app.use(express.static(path.join(root,'dist'),{maxAge:0,extensions:['html'],dotfiles:'deny'}));
app.use((req,res)=>res.status(404).type('html').send('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page introuvable | PRO NUISIBLES</title><link rel="stylesheet" href="/styles.css"><main class="container section"><h1>Cette page est introuvable.</h1><p>Retrouvez nos solutions depuis la page d’accueil.</p><a class="btn btn-green" href="/">Revenir à l’accueil</a></main></html>'));
app.use((error,_req,res,_next)=>res.status(error instanceof multer.MulterError?413:400).json({error:error instanceof multer.MulterError?'Fichiers trop volumineux ou trop nombreux. Limite : 3 photos de 5 Mo.':'La demande n’a pas pu être traitée. Vérifiez les fichiers joints.'}));
const server=app.listen(port,host,()=>console.log(`PRO NUISIBLES local preview: http://${host}:${port} (form: ${mode})`));
server.requestTimeout=45000;server.headersTimeout=20000;
