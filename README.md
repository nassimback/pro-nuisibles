# PRO NUISIBLES

Site français de six pages, construit et servi en local. Interface en vert forêt et citron, photographies réelles, contenu HTML généré pour le référencement et JavaScript léger pour les interactions.

## Démarrer

Node.js 22.9 minimum (testé sur Node 24).

```powershell
npm install
npm run build
npm run dev
```

Ouvrir http://127.0.0.1:4173/. Le serveur écoute uniquement sur la machine locale par défaut.

Après modification du contenu ou des styles, exécuter `npm run build` puis actualiser le navigateur. Après modification du serveur ou de `.env`, redémarrer `npm run dev`.

## Structure

- `site.config.mjs` : identité, coordonnées, villes, avis et domaine. Les valeurs inconnues restent vides et sont affichées comme champs à renseigner.
- `src/content.mjs` : six routes, métadonnées, textes des services, questions et réponses.
- `src/components.mjs` : navigation, footer, formulaires, cartes et balises SEO communes.
- `src/pages.mjs` : composition des six pages.
- `src/home-sections.mjs` : sections de l’accueil, dans l’ordre de la démo Bugfree « Home v2 » (hero, demande rapide, approche, solutions, pourquoi nous, engagement, publics, démarche, devis, engagements, conseils, FAQ).
- `public/theme.css` : feuille unique reprenant les valeurs du thème Bugfree (Inter Tight sans resserrement, titres 66/48 px, sections de 100 px, rayons 20/12/10 px, pastilles à point citron), responsive 1024/767 px et réduction des mouvements.
- `public/boot.js` : active les états d’animation avant l’affichage (la CSP interdit les scripts en ligne).
- `public/app.js` : animations du thème (préchargeur, défilement doux Lenis, titres lettre par lettre, apparitions fadeInUp, révélation des images, curseur, remplissage des boutons depuis le pointeur, accordéon), menu, modales, photos, formulaire et vérification de commune.
- `assets/` : photos originales et sources. `dist/assets/` contient les versions WebP en trois largeurs et les polices locales.
- `scripts/build.mjs` : génération des pages, sitemap, robots, données publiques et images optimisées.
- `server.mjs` : serveur Node/Express et réception des demandes.
- `var/requests/` : demandes privées, photos réencodées et emails de démonstration. Ce dossier est ignoré par Git et n’est jamais servi en HTTP.
- `src/city-page.mjs` : gabarit facultatif pour de futures pages locales, non activé pour conserver exactement six pages.

## Formulaire

Le mode par défaut est `preview`. Il valide les champs côté navigateur **et serveur**, exige le consentement, accepte trois photos JPEG/PNG/WebP de 5 Mo chacune, vérifie le décodage de l’image, supprime les métadonnées et sauvegarde la demande dans un dossier privé. Deux fichiers texte simulent la notification administrateur et l’accusé client. L’interface dit explicitement qu’aucun email n’est envoyé.

Protection complémentaire : origine HTTP contrôlée, champ piège, limitation à huit demandes par quinze minutes et par IP, tailles limitées, pas d’accès HTTP aux données, politiques CSP et autres en-têtes. Les photos ne sont pas exposées publiquement. N’utilisez que des données fictives pendant la préparation.

Pour activer les emails, copier `.env.example` vers `.env`, renseigner le serveur SMTP, son compte, l’adresse expéditrice vérifiée et l’adresse administrateur, puis définir `FORM_MODE=smtp`. Aucune intégration externe n’est activée sans ces valeurs. Le serveur refuse de démarrer en mode SMTP incomplet. La notification administrateur comprend les photos ; l’accusé client confirme seulement la réception, sans promettre un délai ou une intervention. Les échecs administrateur et accusé client sont gérés séparément et enregistrés.

En hébergement public : HTTPS, `PUBLIC_ORIGIN` exact, volume privé persistant et sauvegardé pour `var/`, politique de rétention à appliquer, accès aux données limité aux personnes habilitées. Configurer le proxy de confiance selon l’hébergeur si nécessaire ; ne pas faire confiance à tous les en-têtes d’IP. Les protections fournies ne remplacent pas une protection anti-abus gérée à l’échelle d’un hébergement public.

## Informations à compléter avant publication

1. Téléphone, WhatsApp, email, adresse, horaires, identité juridique, SIRET et communes réellement desservies dans `site.config.mjs`.
2. Certifications et assurances seulement si documentées. Aucune n’a été inventée.
3. Mentions légales, identité de l’hébergeur, modalités de confidentialité et durée de conservation dans `public/app.js`.
4. Domaine final dans `siteUrl`, valeur `PUBLIC_ORIGIN` correspondante et configuration SMTP.
5. Remplacer les emplacements d’avis par de vrais témoignages autorisés via `business.reviews`.
6. Vérifier les droits photographiques et conserver les attributions. Les photos de techniciens illustrent des scènes de désinfection et ne représentent pas l’équipe PRO NUISIBLES. Pour une représentation exacte des méthodes, privilégier vos photos d’intervention. Le visuel détouré du bloc confiance provient désormais de la démonstration Bugfree demandée en référence. Son usage est limité à l’aperçu local : le remplacer ou obtenir les droits nécessaires avant publication. Le paramètre `expertImageIsPreview` bloque l’indexation tant que ce point reste à traiter.
7. Définir `assetsApproved: true`, puis `indexable: true` uniquement après validation. Le build empêche l’indexation lorsque les coordonnées, villes, identité ou domaine ne sont pas renseignés. Par défaut, robots et meta interdisent l’indexation de cet aperçu.

Les liens d’appel et WhatsApp deviennent actifs dès que les coordonnées correspondantes sont renseignées et que le site est reconstruit. Sinon, une modale explique leur absence ; aucun numéro fictif n’est utilisé.

## Référencement

Titres et descriptions uniques, un H1 par page, liens internes, URL françaises, canonical par page, sitemap XML, robots.txt, Open Graph et données Schema.org `Organization`, `WebPage` et `BreadcrumbList`. Aucun score d’avis, agrément, zone réelle ou horaire non vérifié n’est ajouté au balisage. Compléter un schéma d’entreprise locale avec les coordonnées vérifiées lors de la publication.

`SEO-NOTES.txt` documente les intentions de recherche observées et les sources. Il n’y a pas d’estimation inventée du volume des mots-clés. Les communes manquantes restent des emplacements explicites.

Pour ajouter ultérieurement une page par ville : renseigner sa couverture vérifiée, son texte local original, ses contraintes d’accès, une description SEO unique et ses FAQ ; utiliser `renderCityPage` de `src/city-page.mjs`, l’ajouter à la génération dans `scripts/build.mjs`, au sitemap et aux liens de la page zones. Éviter les copies où seul le nom de ville change.

## Contrôles

```powershell
npm test
npm run check
npm audit
```

`npm run check` nécessite le serveur démarré et Chrome installé. Il vérifie les six pages, les titres/H1, l’accessibilité automatisée (axe), l’absence de débordement à 390, 768, 1024 et 1440 px, le menu, la FAQ, le transfert du préformulaire, la vérification des communes et un envoi local avec photo. Les captures et le rapport sont dans `test-results/`. Il crée une demande fictive de test dans `var/`.

Ces contrôles automatisés ne constituent pas une certification d’accessibilité ni une mesure des performances réelles sur le domaine de production. L’envoi SMTP doit être testé avec les véritables paramètres après configuration.

## Direction visuelle

Référence : Bugfree version 2, enrichie des cartes de services de la version 1 et de la démarche en trois étapes de la version 3. Implémentation indépendante en HTML/CSS/JS réutilisable. Couleurs principales : #033F2D, #C7F268, #F5F5F5 ; police Inter Tight auto-hébergée. L’en-tête translucide arrondi se superpose aux visuels d’ouverture, qui gardent une marge latérale et des angles arrondis. Intensité de variation 5/10, mouvement 3/10, densité 4/10. Alternance de surfaces claires et vertes, photos superposées et trois cartes de services respectent explicitement le brief, même lorsque les recommandations génériques du skill suggèrent une autre composition.
