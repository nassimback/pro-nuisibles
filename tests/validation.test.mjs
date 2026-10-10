import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuote } from '../src/validation.mjs';
const valid={nom:'Client de test',telephone:'06 00 00 00 00',email:'test@example.com',ville:'Ville de test',nuisible:'Punaises de lit',description:'Données fictives pour vérifier le formulaire.',consentement:'oui'};
test('Accepts a complete quote and records explicit consent',()=>{assert.equal(validateQuote(valid).data.consentement,true);});
test('Rejects absent consent and unknown pest types',()=>{assert.ok(validateQuote({...valid,consentement:'non'}).error);assert.ok(validateQuote({...valid,nuisible:'Autre valeur'}).error);});
test('Rejects email header injection and multiple recipient syntax',()=>{assert.ok(validateQuote({...valid,email:'a@example.com\r\nBcc:b@example.com'}).error);assert.ok(validateQuote({...valid,email:'a@example.com,b@example.com'}).error);});
test('Rejects malformed types, oversized descriptions and invalid phone numbers',()=>{assert.ok(validateQuote({...valid,nom:['one','two']}).error);assert.ok(validateQuote({...valid,description:'a'.repeat(5001)}).error);assert.ok(validateQuote({...valid,telephone:'abcdefghi'}).error);});
