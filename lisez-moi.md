# Calage — Imprimerie de Jarry

Même moteur de décision que la version Python, mais tout se passe dans le navigateur.
Aucune installation de Python ni de poppler. Aucun fichier n'est envoyé nulle part :
l'analyse est faite en local par le navigateur.

---

## Tester tout de suite sur le Mac

Double-clic sur `index.html`. Ça s'ouvre dans Safari ou Chrome et c'est fonctionnel.

Seule limite de ce mode : pas d'installation dans le Dock, pas de fonctionnement hors ligne.

## Installer comme vraie application

Une PWA a besoin d'être servie par un serveur, même local. Dans le Terminal :

```bash
cd /chemin/vers/le/dossier
python3 -m http.server 8080
```

Si `python3` n'est pas disponible sur ton Mac :

```bash
npx serve -l 8080
```

Puis ouvrir `http://localhost:8080`.

- **Chrome / Edge** : icône d'installation dans la barre d'adresse, ou menu ⋮ > Installer.
- **Safari** : menu Fichier > Ajouter au Dock.

L'application apparaît alors dans le Dock avec sa propre fenêtre, sans barre d'adresse.

---

## Mettre à jour l'application

Un numéro de version est affiché en bas de page, à droite. **Vérifier qu'il correspond à la
version attendue avant de conclure qu'une fonction a disparu.**

Le service worker fonctionne désormais en **réseau d'abord** : une version déposée dans le
dossier est servie immédiatement, le cache ne sert plus que hors ligne. La version précédente
faisait l'inverse et pouvait servir un ancien `index.html` indéfiniment.

Si un doute persiste après remplacement des fichiers :

- ouvrir la console du navigateur, onglet Application, section Service Workers, cliquer sur
  « Unregister », puis recharger
- ou recharger avec Cmd + Maj + R

Éviter aussi de garder plusieurs copies du dossier dans Téléchargements. Un `idj-controle-pwa 2`
ouvert par erreur donne exactement la même impression qu'une régression.

---

## L'interface

Disposition de console de production, en trois colonnes.

**Bandeau latéral sombre** : les 33 produits, groupés par famille, avec leur code. Un clic
sélectionne, la zone centrale se recalcule. Plus lisible qu'une liste déroulante à 33 entrées.

**Zone de travail centrale** : bandeau d'état, barre d'outils, puis **le visuel en grand**,
fichier client et fichier corrigé côte à côte avec leurs repères. Les constats viennent
dessous en table dense à trois colonnes, puis l'atelier de corrections.

Un changement de produit redessine les repères sur le visuel, affiche le nom du produit et son
gabarit au-dessus de l'aperçu, et marque brièvement la zone. Le changement se voit, il ne se
devine plus.

**Inspecteur à droite** : spécifications, dimensions commandées, orientation, devis, plan de coupe.

Le rouge de marque `#CC2A2A` sert à l'accent et aux repères. Les verdicts utilisent des couleurs
distinctes et plus sourdes — vert `#1E7A46`, orange `#B5651D`, rouge `#B02020` — pour qu'un
bandeau rouge de verdict ne soit jamais confondu avec un élément d'habillage.

---

## Usage

1. Choisir le produit commandé dans la liste. Les spécifications s'affichent en dessous.
2. Glisser le PDF client dans la zone de dépôt.
3. Lire le verdict, copier le rapport, l'envoyer au client.

Le **plan de coupe** compare visuellement, à l'échelle, le format reçu et le format commandé.
Un fichier livré à 10 % du format apparaît comme un petit rectangle perdu dans le format cible.
C'est le défaut le plus fréquent et le plus invisible sur un écran.

---

## Ce que la version web contrôle

Identique à la version Python, à une exception près :

| Contrôle | Web | Python |
|---|---|---|
| Dimensions et proportions | oui | oui |
| Facteur d'échelle | oui | oui |
| Résolution ramenée au format fini | oui | oui |
| Polices non incorporées | oui | oui |
| Fond perdu réel (TrimBox / BleedBox) | oui | oui |
| Zone de sécurité, texte et logos | **oui** | non |
| Saisie des dimensions commandées | **oui** | non |
| Orientation imposée | oui | oui |
| Pagination | oui | oui |
| Espace colorimétrique RVB | **non** | oui |
| Lisibilité du texte à taille finale | **oui** | non |
| Détection de la transparence active | **oui** | oui |
| Texte pâle ou en opacité réduite | **oui** | non |

L'alerte RVB est absente de la version web : la détecter dans le navigateur demanderait
de décoder chaque flux d'image, ce qui alourdirait l'outil pour un contrôle que le Fiery
gère de toute façon mieux à l'impression.

---

## Les classes de tolérance

Elles ne décrivent pas une qualité mais une **distance de lecture**. C'est elle qui fixe les
seuils de résolution et de taille de texte.

| Classe | Lecture | Résolution | Texte mini |
|---|---|---|---|
| **P1** | en main | 300 dpi cible, 150 mini | 1,4 mm |
| **P2** | à 1 ou 2 m | 120 dpi cible, 100 mini | 4 mm |
| **P3** | à 3 m et plus | 50 dpi cible, 30 mini | 8 mm |

Un panneau en P2 accepte donc du 100 dpi qui serait refusé sur une carte de visite, tout
simplement parce qu'on ne le lit pas le nez dessus. La classe s'affiche avec sa distance dans
le panneau des spécifications.

---

## Le devis

Panneau à droite : **quantité**, coefficients de grammage, finitions, et le **montant** en gros
caractères. Le détail ligne à ligne est affiché sous le total, de sorte qu'on voit toujours
d'où vient le chiffre.

Trois modes de tarification, définis par produit dans l'espace admin :

| Mode | Calcul |
|---|---|
| `PALIER` | montant du palier le plus élevé inférieur ou égal à la quantité |
| `M2` | prix au m² × surface × quantité, plancher au minimum de facturation |
| `UNITE` | prix unitaire × quantité |

Les finitions s'ajoutent en pourcentage du prix de base, en montant fixe, à l'unité ou au m².
Les finitions vendues **à l'unité** ont leur propre champ de quantité, à côté de la case :
huit œillets par exemplaire sur trois exemplaires se calculent bien en vingt-quatre œillets.

**Les montants livrés sont à zéro.** Ils n'ont pas été inventés à partir de la grille tarifaire :
un chiffre faux dans un devis coûte plus cher qu'une case vide. Tant qu'un produit n'est pas
tarifé, le panneau affiche « tarif non renseigné ».

---

## Le menu produit

Trois dispositifs se cumulent :

- **Recherche** en haut du bandeau. La saisie filtre immédiatement, Entrée sélectionne le
  premier résultat. Taper `kake` ne laisse que les deux kakemonos.
- **Récents** : les six derniers produits utilisés remontent en tête de liste. Sur un atelier
  où quatre ou cinq références font l'essentiel du volume, c'est le gain principal.
- **Familles repliables sur fond rouge** : Imprimerie et Signalétique sont les deux seuls
  bandeaux rouges du bandeau latéral, pour être repérées d'un coup d'œil. Un clic replie le
  groupe et affiche son effectif. Les Récents restent sur fond sombre, ce n'est pas une famille
  métier.

La lisibilité a aussi été revue : corps plus grand, interligne plus aéré, **gabarit affiché
sous chaque produit** (`9×5.5 cm`, `max 240×120 cm`), et code produit visible seulement au
survol ou sur la ligne sélectionnée pour ne plus concurrencer le nom.

---

## Nommage et dossier de dépôt

Tous les documents produits sont nommés **`CODE-MONTANT-NOM`**, par exemple
`KAK-60-71.00-affiche_client.pdf`. Sans tarif renseigné, le montant est remplacé par
`SANSTARIF`. Les caractères interdits dans un nom de fichier sont remplacés.

Le lien **Choisir le dossier de dépôt** en bas de page permet de désigner un dossier une fois
pour toutes : rapports, bons à tirer et fichiers corrigés y sont écrits directement, sans
passer par les téléchargements. Le dossier choisi est retenu d'une session à l'autre.

C'est le point de branchement avec un outil externe : il suffit de faire pointer ce dossier
vers ce que tu surveilles déjà.

**Cette fonction demande Chrome ou Edge.** Safari ne l'implémente pas et retombe
automatiquement sur le téléchargement classique.

---

## Journal et statistiques

Une **ligne par fichier reçu** est enregistrée : date, fichier, produit, famille, verdict
initial, verdict final, corrections appliquées, format reçu, format commandé, quantité,
montant, liste des défauts.

Onglet **Statistiques** de l'espace admin. La typologie retient ce que l'atelier a réellement
dû faire, pas le premier verdict :

| Typologie | Définition |
|---|---|
| **Direct** | passé sans correction |
| **Ajustement léger** | corrigé automatiquement, ou orange assumé |
| **Traitement lourd** | rouge non corrigeable, ou resté rouge après correction |

S'y ajoutent les produits les plus reçus et les défauts les plus fréquents. Le bouton
**Exporter le journal** produit un CSV complet, une ligne par fichier, exploitable dans un
tableur ou dans ton propre outil.

---

## Les quantités vendues

Sur les produits tarifés **par palier**, le champ quantité devient une liste des quantités
réellement vendues, construite à partir des paliers saisis dans l'espace admin.

Pour que la liste affiche 100, 200, 300, 400, il suffit de saisir ces quantités dans la colonne
`paliers` de l'onglet Tarifs : `100:19;200:32;300:44;400:55`. La liste du devis reprend
exactement ces valeurs, dans cet ordre.

Une entrée « autre… » reste disponible pour une quantité hors grille ; le palier retenu est
alors le plus élevé inférieur ou égal à la quantité demandée.

---

## L'espace admin

Lien en bas de page. Trois onglets :

- **Spécifications** : les 33 produits, tous les champs de contrôle éditables en tableau
- **Tarifs** : mode de tarification, paliers, prix au m², prix unitaire, minimum de facturation
- **Finitions et options** : libellés, modes, valeurs, familles concernées

Les paliers s'écrivent `quantité:montant` séparés par des points-virgules, par exemple
`100:69;500:220;1000:400`.

Un quatrième onglet, Statistiques, est décrit plus haut.

Chaque onglet permet d'**ajouter** une ligne et d'en **supprimer** une, avec confirmation, produits comme
finitions et coefficients. Un produit ajouté part d'un gabarit qu'il suffit de compléter.

### Sortir de l'admin

Deux boutons, présents sur les quatre onglets :

- **Enregistrer et fermer** applique les modifications et les conserve
- **Fermer sans enregistrer** annule tout ce qui a été fait depuis l'ouverture, y compris les
  lignes ajoutées ou supprimées. Une confirmation est demandée si quelque chose a changé.

La touche **Échap** et un clic à côté du panneau font la même chose que « fermer sans
enregistrer ». Auparavant, un clic à côté enregistrait silencieusement.

Les modifications enregistrées sont conservées dans le navigateur et reprises au prochain lancement. Le
bouton **Exporter** produit les fichiers `referentiel.js` et `tarifs.js` à replacer dans le
dossier, pour figer les réglages et les partager entre postes. **Réinitialiser** efface les
réglages locaux et revient aux fichiers du dossier.

---

## Le rapport

Deux boutons dans la barre d'outils :

- **Afficher le rapport** ouvre le rapport à l'écran, avec un bouton de copie et un bouton PDF
- **Télécharger le rapport** produit directement le PDF

Le rapport reprend l'identification, le verdict, tous les constats et le détail du montant. Il
n'inclut ni engagement du client ni cadre de signature : c'est un document interne. Pour la
version contresignée, c'est le bon à tirer.

---

## Corrections automatiques

Quand le contrôle relève un défaut géométrique, un panneau de corrections apparaît sous le
rapport. Quatre opérations, cumulables :

| Correction | Ce qu'elle fait | Ce qu'elle coûte |
|---|---|---|
| **Mise au format fini** | Met le contenu à l'échelle du format commandé | La résolution des images baisse d'autant. Le recontrôle l'affiche. |
| **Rotation** | Pivote de 90° vers l'orientation imposée | Rien. |
| **Fond perdu** | La page s'agrandit, le visuel garde sa taille exacte, la bande créée est comblée par la couleur du bord correspondant. TrimBox et BleedBox déclarées | Rien n'est rogné, rien n'est déformé. |
| **Marge de sécurité** | Réduit le visuel pour éloigner son contenu du trait de coupe, comble le pourtour de la même façon | Le visuel est plus petit. La résolution augmente. |

Une case permet de combler en blanc plutôt qu'en couleur, pour les supports destinés à
rester blancs autour du visuel.

### Comment la couleur de remplissage est trouvée

La page est rendue en petit, puis une bande de 3 % est échantillonnée sur chacun des quatre
bords. Pour chaque bande, c'est la **médiane par canal** qui est retenue, pas la moyenne :
un logo ou un texte posé sur le bord ne fausse donc pas le résultat.

Si les quatre bords sont proches, une couleur dominante unique est appliquée. S'ils diffèrent
(bandeau coloré en haut, pied de page sombre en bas), chaque bande reçoit la couleur de son
propre bord. Les quatre pastilles affichées au-dessus des options montrent ce qui a été relevé,
avant d'appliquer quoi que ce soit.

Après application, le fichier est **recontrôlé automatiquement** et le nouveau verdict s'affiche.
Le bouton de téléchargement produit un `_CORRIGE.pdf`.

Les corrections sont purement géométriques. Elles repositionnent, mettent à l'échelle et
déclarent les boîtes. **Aucun pixel n'est recréé.** Ce qui entre en pixels ressort en pixels.

### Pourquoi la résolution n'est pas corrigible

C'est volontaire, et c'est le garde-fou principal de l'outil.

Rééchantillonner une image ne crée aucune information. Le résultat est flou au lieu d'être
pixelisé, ce qui est parfois préférable à l'œil en grand format, mais ce n'est pas une
réparation. Surtout, une fois le fichier « corrigé », il passe au vert : le contrôle valide
un fichier qui n'a pas changé.

Conséquence commerciale directe : aujourd'hui l'alerte et le BAT avec réserve placent le
risque du côté du client. Une correction automatique de résolution le ramènerait chez IDJ.

La résolution reste donc un **diagnostic**, jamais une correction. Si un fichier doit être
agrandi, c'est un travail manuel, chez l'infographiste, avec un BAT signé.

---

## Contrôle de lisibilité du texte

Un texte paraît lisible à l'écran parce que la page est zoomée. À l'impression, il disparaît.

L'outil mesure le **plus petit corps de la page**, dans la matrice de texte du PDF et non dans
la métrique déclarée, puis le ramène au format fini en appliquant le facteur d'échelle. Un
corps 12 dans un fichier livré à 10 % du format devient 1,2 pt réel, soit 0,4 mm.

Seuils par classe, colonne `texte_mini_mm` du référentiel :

| Classe | Lecture | Seuil |
|---|---|---|
| P1 petite imprimerie | en main | 1,4 mm (environ 4 pt) |
| P2 moyen format | 1 à 2 m | 4 mm |
| P3 grand format | 3 m et plus | 8 mm |

En dessous du seuil : alerte orange, à signaler au client. En dessous de la moitié du seuil :
verdict rouge.

Deux limites à connaître. Le contrôle porte sur la page 1, comme le reste de l'analyse. Et un
PDF contenant une couche de texte invisible issue d'un OCR peut déclencher une fausse alerte,
puisque ce texte est bien présent dans le fichier même s'il ne s'imprime pas.

---

## Dimensions commandées, produits à format libre

Onze produits n'ont pas de format fixe : les trois panneaux, les stickers, le vinyle standard,
les deux banderoles, l'affiche grand format, le vinyle brut, le microperforé et la bâche brute.

Pour ceux-là, deux champs apparaissent sous les spécifications : **largeur × hauteur en
centimètres, telles que le client les a commandées**. À partir de cette saisie, le fichier est
contrôlé exactement comme un format fixe : dimensions, facteur d'échelle, résolution ramenée
au format fini, lisibilité du texte, zone de sécurité.

Tant que les deux champs sont vides, le format n'est pas contrôlé et l'outil le dit.

Les panneaux gardent leur limite machine. Une commande en 300 × 150 cm sur du panneau alu est
refusée en rouge, le maximum étant 240 × 120 cm.

Les valeurs saisies sont mémorisées par produit pendant la session, et la zone 2 se recalcule
à chaque changement de produit ou de dimension, sans avoir à redéposer le fichier.

---

## Proposition de format réalisable

Quand la commande ne peut pas être honorée telle quelle, l'outil ne se contente pas de refuser :
il calcule le **plus grand format conservant les proportions du fichier**.

Le calcul s'applique aux **29 produits**, pas seulement à ceux dont on saisit les dimensions.
Quatre situations le déclenchent :

| Situation | Boîte de calcul | Format adoptable |
|---|---|---|
| Dimensions commandées au-delà de la limite machine | maximum du produit | oui |
| Dimensions commandées de proportions différentes du fichier | dimensions commandées | oui |
| Produit à format fixe, fichier de proportions différentes | format du produit | non, le format ne change pas |
| Fichier au-delà du maximum ou hors plage, sans saisie | maximum du produit | non |

Sur un produit à format fixe, une carte de visite ou un roll-up, le format ne peut pas bouger.
Le message devient alors « surface occupée par le visuel » : il annonce la place que le visuel
prendra réellement dans le format, le pourtour étant comblé par la couleur de ses bords. La
correction « mettre au format fini » applique exactement ça, sans déformer.

La boîte est testée dans ses deux orientations, un panneau 240 × 120 pouvant se poser en
120 × 240. Le plus grand des deux résultats est retenu.

### Exemple

Fichier 189 × 75 cm, soit un ratio de 2,52. Client qui commande un panneau alu 300 × 150 cm.

- Hors limite machine : le maximum est 240 × 120 cm.
- Largeur bloquée à 240 → hauteur 95,2 cm. Tient dans la boîte.
- Hauteur bloquée à 120 → largeur 302,4 cm. Ne tient pas.

Proposition : **240 × 95,2 cm**.

Le message annonce aussi ce que donnera ce format en résolution et en taille du plus petit
texte, avec la mention explicite quand l'une des deux passe sous son seuil. Sur cet exemple,
44 dpi contre 100 requis : le format est réalisable, le fichier ne l'est pas.

Le bouton **Adopter ce format** écrit la proposition dans les champs de dimensions et relance
le contrôle. Tout le reste suit : plan de coupe, corrections, zone de sécurité.

Pour occuper toute la surface commandée, il faudrait recadrer le visuel. L'outil ne le fait pas :
choisir ce qu'on coupe dans une image est une décision de composition, elle revient
à l'infographiste.

---

## Alerte à la saisie des dimensions

Dès la frappe, avant même de déposer un fichier, un bloc s'affiche sous les deux champs :

- **Surface en m²**, calculée en direct
- **Dépassement de la limite machine**, en rouge, avec le plus grand format conservant les
  proportions demandées. Une commande de 300 × 150 cm sur panneau alu affiche immédiatement
  « en conservant ces proportions, le plus grand possible est 240 × 120 cm »
- **Format sous le minimum du produit**, pour les stickers et le vinyle standard
- **Minimum de facturation**, quand la surface commandée est en dessous. Un microperforé de
  50 × 50 cm affiche 0,25 m² et rappelle que la facturation partira sur 1 m²
- **Zone de sécurité minimale** applicable au produit

L'opérateur voit donc l'impossibilité au moment où il prend la commande, pas une fois le
fichier reçu.

---

## Comment le fond perdu est compté

La valeur `fond_perdu_mm` du référentiel est le **total ajouté au format fini**, pas le débord
par bord. C'est le vocabulaire de l'atelier : « 4 mm de fond perdu » veut dire 2 mm de chaque
côté du trait de coupe.

Une carte de visite 9 × 5,5 cm doit donc arriver en **9,4 × 5,9 cm**, avec la TrimBox posée
à 2 mm des bords.

L'outil applique et vérifie cette convention partout : mesure du fond perdu présent, correction
automatique, fiche produit, plan de coupe. Les messages annoncent systématiquement les deux
valeurs, le débord par bord et le total au format, pour qu'il n'y ait plus d'ambiguïté.

### Format fini et format de fichier ne sont pas la même chose

Le premier constat indique le **format fini**, et rappelle la taille physique de la page quand
elle diffère. C'est le format fini qui doit correspondre à la commande, jamais la page.

Un fichier de carte de visite livré en **9,4 × 5,9 cm est correct** : c'est le format fini plus
le fond perdu. L'outil le reconnaît comme tel **même si le PDF ne déclare aucune TrimBox**,
et annonce alors « format fini reçu 9,0 × 5,5 cm, page physique de 9,4 × 5,9 cm, fond perdu
compris ».

Sans cette reconnaissance, un 9,4 × 5,9 tomberait dans la tolérance de proportions de 3 % et
l'outil proposerait de le ramener à 9 × 5,5, ce qui supprimerait le fond perdu. C'est
exactement ce qu'il ne faut pas faire, et c'est verrouillé.

Dans ce cas, le fichier est **vert**. Poser les traits de coupe reste possible en un clic, sous
le titre « préparation pour le RIP », mais ce n'est pas présenté comme la correction d'un défaut.
La zone de sécurité est alors mesurée depuis le trait de coupe, pas depuis le bord physique.

### Les traits de coupe ne sont jamais un défaut

IDJ ne demande pas de traits de coupe à ses clients : leur absence n'est donc jamais signalée.
Seul le **fond perdu** est contrôlé, et le message le dit dans ces termes.

| Fichier reçu | Verdict |
|---|---|
| Format fini + fond perdu, TrimBox déclarée | vert, fond perdu conforme |
| Format fini + fond perdu, sans TrimBox | vert, fond perdu présent |
| Format fini exact, sans fond perdu | orange, ajout automatique possible |
| Fond perdu insuffisant | orange |

Un format qui ne correspond ni au fini ni au fini plus fond perdu, un 9,8 × 6,3 par exemple,
n'est pas reconnu et repart en contrôle normal.

La marge de sécurité, elle, reste une valeur **par bord** : 5 mm signifie 5 mm depuis chaque
trait de coupe vers l'intérieur.

---

## Contrôle multipage

Toutes les pages du document sont analysées, jusqu'à 40. Au-delà, l'outil le dit et s'arrête
là. Sont contrôlés sur chaque page : polices, résolution, lisibilité, densité d'encre, zone de
sécurité, marges de pli, transparence.

Les défauts identiques sont **regroupés**, sinon un huit pages produirait seize lignes de
rapport. Chaque constat porte la mention des pages concernées :

- `[toutes les pages]`
- `[pages 1 à 4, 6 à 8]`
- `[page 5]`

Un format de page différent d'une page à l'autre déclenche un verdict rouge.

Attention : jusqu'à cette version, seule la page 1 était analysée alors que les corrections,
elles, s'appliquaient à toutes. Un vingt pages pouvait donc être corrigé sur la foi d'un
diagnostic fait sur la première.

---

## Marges de pli

Un PDF ne contient **aucune information de pli**. Le découpage vient du référentiel, colonne
`plis`, au format `TYPE:largeur1,largeur2,largeur3` en millimètres.

Valeur livrée pour les dépliants : `ROULE3:100,99,98`, pli roulé à 3 volets en 130 g, avec une
marge au pli de 5 mm (colonne `marge_pli_mm`).

Le volet qui s'enroule à l'intérieur est le plus étroit, sinon il gondole et le pli casse.

### La convention de montage n'a pas à être déclarée

Le recto et le verso sont montés en miroir : les lignes de pli tombent à 100 et 199 mm dans un
sens, à 98 et 197 mm dans l'autre. Plutôt que d'imposer une convention et de se tromper une
fois sur deux, l'outil **contrôle les deux positions à la fois**. Un contenu doit dégager la
marge quelle que soit la convention retenue, ce qui est de toute façon la règle sûre.

Le contrôle porte sur les blocs de texte et les images placées, page par page. Les fonds pleine
page en sont exclus.

### Ce que l'on voit à l'écran

Sur l'aperçu du fichier, chaque pli est matérialisé :

- une **bande bleue translucide** couvre la zone interdite, marge comprise
- deux **axes en tirets** marquent les deux positions possibles du pli, montage recto et
  montage verso
- chaque volet porte son **étiquette de largeur**, V1 100, V2 99, V3 98

Le plan de coupe reprend les mêmes lignes à l'échelle, et le bon à tirer imprime les bandes
par-dessus les aperçus : le client voit sur le document qu'il signe où tombent les plis.

Sur un produit sans pli, aucun de ces repères n'apparaît.

Le contrôle de pertinence est écrit une seule fois et sert partout : aperçu à l'écran, plan de
coupe, bon à tirer et rapport PDF. Les rectangles tracés dans les PDF sont en plus rognés sur
l'emprise exacte de la vignette.

Ils ne s'affichent pas non plus tant que le fichier n'est pas au format du dépliant : les
volets sont exprimés dans le format fini, donc sur un fichier livré à un autre format ils
tomberaient hors de l'image. La légende le dit alors explicitement. Une fois la correction
appliquée, le fichier passe au bon format et les repères apparaissent.

---

## Choisir portrait ou paysage

Trois cas, selon le produit.

**Produits à dimensions libres** (panneaux, banderoles, vinyles, bâches, stickers, affiches
grand format). L'orientation découle de ce que l'on saisit : une largeur supérieure à la
hauteur donne du paysage. Commander 200 x 90 puis recevoir un fichier en 90 x 200 déclenche
désormais une alerte d'orientation et la rotation en correction. Avant, l'outil acceptait les
deux sens sans rien dire.

**Produits à orientation imposée** (roll-up, kakemonos, dépliants, brochures, banderoles).
Rien à choisir, la fiche rappelle l'orientation du produit et tout fichier livré dans l'autre
sens est signalé.

**Produits à format fixe et orientation indifférente** (cartes de visite, flyers, cartons,
affiches A3, étiquettes). Un sélecteur à trois positions apparaît sous les spécifications :

| Position | Effet |
|---|---|
| **Indifférent** | comportement par défaut, les deux sens sont acceptés |
| **Portrait** | un fichier paysage est signalé, la rotation est proposée |
| **Paysage** | un fichier portrait est signalé, la rotation est proposée |

Le choix est mémorisé par produit pendant la session et relance le contrôle immédiatement.

C'est ce réglage qui permet de refuser un flyer A4 livré en paysage alors que la commande
portait sur du portrait, cas qui passait silencieusement jusqu'ici.

---

## Zone de sécurité

Elle remplace le fond perdu en signalétique, qui est désormais à zéro pour tous les produits
de cette famille.

**Aucun texte, aucun logo ne doit y entrer.** Le contrôle mesure les boîtes englobantes de
chaque bloc de texte et de chaque image placée, puis vérifie leur distance au bord. Le message
indique le nombre d'éléments en cause et la distance du plus proche.

| Famille | Largeur de la zone |
|---|---|
| Imprimerie | valeur fixe du référentiel, 5 mm |
| Signalétique | valeur du référentiel, **relevée à la largeur d'une lettre du visuel si celle-ci est supérieure** |

La largeur d'une lettre est mesurée sur le fichier, pas estimée : c'est la chasse moyenne du
bloc de texte le plus large, ramenée au format fini. Sur une banderole à très grandes lettres,
la zone de sécurité s'élargit donc automatiquement.

La zone apparaît en pointillé dans le plan de coupe, en gris si elle est respectée, en orange
sinon.

### Deux limites

Les visuels de fond, ceux qui couvrent plus de 90 % de la page, sont exclus du contrôle : ils
sont censés aller jusqu'au bord.

Les logos **vectoriels** ne sont pas détectés, seulement les logos en image. Contrôler les
tracés vectoriels ferait remonter tous les aplats de fond en fausse alerte, ce qui rendrait
l'information inutilisable.

---

## Page plus grande que le format fini

Un fichier dont la page dépasse nettement le format fini plus le fond perdu est signalé :
recto verso monté côte à côte, ou visuel posé sur une feuille plus grande.

Le seuil est de 35 % de surface au-delà de la page attendue, ce qui laisse passer les
variations normales de fond perdu sans laisser passer une pose double.

Dans ce cas, le format fini retenu reste celui du trait de coupe, et le message invite à
confirmer avec le client avant de lancer. Le fond perdu n'est alors plus annoncé comme
« conforme » mais comme « d'au moins X mm sur chaque bord », puisqu'il est très inégal.

---

## Bon à tirer avec réserves

Sur tout fichier non conforme, un bouton **Éditer le bon à tirer** produit un PDF A4 prêt à
faire signer, contenant :

- l'identification du **fichier remis par le client**, du produit et des dimensions commandées
- la **liste des points relevés sur le fichier remis**, reprise mot pour mot du contrôle, avec
  une pastille rouge ou orange selon la gravité
- si une correction a été appliquée : la **liste des actes de correction** et les **points
  subsistant après correction**, en trois blocs distincts
- les **aperçus du fichier remis et du fichier corrigé**, côte à côte, avec leurs dimensions
- le texte d'engagement du client
- un cadre de signature avec la mention manuscrite

### Sur le texte d'engagement

Il est volontairement **limité aux points listés**. Le client renonce à réclamer sur ces
points-là, et sur eux seuls. Le document précise explicitement que l'imprimerie reste
responsable de la conformité de sa production : qualité d'impression, quantités, support,
finitions, délai.

C'est un choix, pas un oubli. Une décharge générale qui exclurait toute responsabilité est
commercialement agressive et juridiquement fragile. Une réserve précise, énumérée, portée à la
connaissance du client avant impression et contresignée est nettement plus solide.

Ce texte n'a pas été rédigé par un juriste. À faire relire par un avocat avant d'en faire un
document contractuel courant.

Le nom de l'entreprise et la couleur d'accent viennent de `charte.js` : le bon à tirer suit
automatiquement l'identité visuelle.

---

## Aperçu avant et après

Le fichier client est rendu et affiché dès le contrôle. Après une correction, l'aperçu du
fichier corrigé apparaît à côté, à la même échelle d'affichage, pour une validation visuelle
immédiate.

Deux repères sont superposés sur chaque aperçu :

- **Trait de coupe**, en tirets blancs, à la position réelle du fond perdu du produit
- **Zone de sécurité**, en pointillés orange

Sur un fichier de carte de visite en 9,4 × 5,9 cm, le trait de coupe est donc tracé à 2,13 %
de la largeur et la zone de sécurité à 7,45 %. Ces positions sont calculées depuis les
dimensions réelles du fichier, pas approximées.

Le fond en damier représente le hors-format, ce qui rend visible d'un coup d'œil un fichier
qui n'occupe pas tout son cadre.

La légende sous les aperçus n'affiche que les repères pertinents : pas de trait de coupe en
signalétique, puisqu'il n'y a pas de fond perdu.

---

## Détection du texte pâle

Un texte noir posé à 25 % d'opacité reste parfaitement lisible sur un écran rétroéclairé.
Sur papier, il ressort délavé. C'est le défaut le plus vicieux des fichiers Canva, parce que
la validation à l'écran donne toute confiance.

L'outil parcourt les opérateurs de la page, suit l'opacité et la couleur de remplissage en
vigueur à chaque bloc de texte, et calcule une **densité d'encre effective** :

`densité = (1 - couche la plus faible du remplissage) x opacité`

Un noir opaque donne 100 %. Un noir à 25 % d'opacité donne 25 %. Un gris clair à 100 %
d'opacité donne 22 %.

| Densité | Verdict |
|---|---|
| moins de 15 % | rouge, quasi invisible à l'impression |
| moins de 35 % | orange, délavé sur papier |
| au-delà | pas d'alerte |

Le message indique aussi **quelle proportion du texte de la page est concernée**, pour
distinguer un filigrane décoratif d'un bloc de mentions réellement à imprimer.

### La limite assumée

Un texte franchement blanc est ignoré. Il est presque toujours posé sur un fond sombre, et
l'outil ne peut pas trancher sans analyser ce qu'il y a dessous. Un texte blanc sur fond
blanc passera donc au travers : c'est le seul cas de ce type qui échappe au contrôle.

Un texte en mode de fusion est signalé séparément, son rendu papier pouvant s'écarter
fortement de l'écran.

---

## Transparence et polices : ce que l'outil ne fait pas, volontairement

L'outil **signale** la transparence active (opacité partielle, modes de fusion, masques) mais
ne l'aplatit jamais. Deux raisons.

D'abord, un aplatissement correct est un calcul lourd : il faut résoudre les zones de
recouvrement, arbitrer entre vectoriel et rastérisé, gérer les modes de fusion et la
surimpression. Aucune bibliothèque navigateur ne sait le faire proprement. La seule chose
qu'un navigateur sait faire, c'est **rastériser toute la page en image**, ce qui n'est pas un
aplatissement mais une destruction : le texte devient de l'image et une police non incorporée
se retrouve figée avec sa substitution, définitivement.

Ensuite, l'aplatissement n'est plus nécessaire. Le Fiery et VersaWorks traitent la transparence
nativement. Aplatir aujourd'hui, c'est le plus souvent dégrader : filets blancs aux jonctions,
texte rastérisé, surimpression cassée. Le seul cas légitime reste un sous-traitant qui exige
du PDF/X-1a, et cet aplatissement se fait alors dans Acrobat, une fois, en connaissance de cause.

### La garantie de non-destruction

Les corrections de l'outil embarquent la page source telle quelle et se contentent de la
repositionner. Aucun texte n'est réinterprété, aucune police n'est resubstituée, aucun flux
n'est réencodé.

Vérifié par comparaison des flux de texte avant et après correction, sur un fichier à police
non incorporée : chaînes de caractères, corps et polices strictement identiques. Le défaut est
**conservé et toujours signalé**, jamais masqué ni aggravé.

---

## Rhabiller l'application

Tout le graphisme est dans **`charte.js`**, un seul fichier, une dizaine de valeurs :
nom, couleurs, polices, bande de repérage, logo.

Pour le logo, déposer `logo.svg` dans le dossier. Si le fichier est absent, l'application
retire proprement l'emplacement et affiche le nom en toutes lettres.

Les valeurs livrées sont **celles de la charte IDJ** : rouge `#CC2A2A`, gris clair `#F0F0F0`,
noir texte `#1A1A1A`, police Inter. Elles viennent du document
`charte-graphique-imprimerie-de-jarry.md`.

Les **couleurs des verdicts** (vert, orange, rouge) ne sont volontairement pas dans la charte.
Ce sont des signaux de sécurité : ils doivent rester identiques quelle que soit l'identité
visuelle. Penser aussi à reporter la couleur de fond dans `manifest.json`, champs
`theme_color` et `background_color`, pour l'écran de lancement de la PWA.

---

## Mettre à jour le référentiel

Deux possibilités.

**À chaud, sans toucher au code** : lien « Charger un référentiel à jour » en bas de page,
puis sélectionner le CSV. Valable pour la session en cours.

**En permanence** : régénérer `referentiel.js` à partir du CSV. Le fichier contient une seule
ligne de code, `const REFERENTIEL = [...]`, avec un objet par produit. On peut aussi l'éditer
directement dans un éditeur de texte.

---

## Fonctionnement hors ligne complet (optionnel)

Le moteur d'analyse est chargé depuis un CDN au premier lancement. La coquille de
l'application est mise en cache, mais pas ces deux bibliothèques externes.

Pour un fonctionnement totalement autonome, télécharger dans le dossier :

- `pdf.min.mjs` et `pdf.worker.min.mjs` (pdf.js 4.0.379)
- `pdf-lib.min.js` (pdf-lib 1.17.1)

Puis dans `index.html`, remplacer :

```js
const CDN_PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/";
const CDN_PDFLIB = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
```

par :

```js
const CDN_PDFJS = "./";
const CDN_PDFLIB = "./pdf-lib.min.js";
```

et ajouter ces trois fichiers à la liste `COQUILLE` dans `sw.js`.

---

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Interface et moteur de décision |
| `charte.js` | Identité visuelle : couleurs, polices, logo, nom |
| `referentiel.js` | Les 29 produits et leurs seuils |
| `manifest.json` | Déclaration PWA (nom, icônes, couleurs) |
| `sw.js` | Service worker, cache de la coquille |
| `icon-192.png`, `icon-512.png` | Icônes de l'application |
