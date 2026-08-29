/* =====================================================================
   TARIFS ET OPTIONS — Imprimerie de Jarry
   ---------------------------------------------------------------------
   Modifiable depuis l'espace Admin de l'application, qui enregistre dans
   le navigateur et permet l'export vers ce fichier.

   Les montants sont volontairement à zéro : ils n'ont pas été inventés.
   À renseigner depuis l'onglet Tarifs de l'espace Admin.
   ===================================================================== */
const TARIFS = {
  devise: "€",
  mention: "Prix TTC",

  /* Coefficients multiplicateurs appliqués au prix de base. */
  coefficients: [
    { code: "G170", libelle: "Papier 170 g",        coef: 1.25, familles: ["IMPRIMERIE"] },
    { code: "G300", libelle: "Papier 300 g",        coef: 1.50, familles: ["IMPRIMERIE"] },
  ],

  /* Finitions et options.
     mode : POURCENT (sur le prix de base), FIXE (montant unique),
            UNITE (montant x quantité), M2 (montant x surface). */
  finitions: [
    { code: "RAIN",  libelle: "Rainage",              mode: "POURCENT", valeur: 23, familles: ["IMPRIMERIE"] },
    { code: "PLI",   libelle: "Pliage",               mode: "POURCENT", valeur: 23, familles: ["IMPRIMERIE"] },
    { code: "COINS", libelle: "Coins arrondis",       mode: "POURCENT", valeur: 23, familles: ["IMPRIMERIE"] },
    { code: "PLAST", libelle: "Plastification",       mode: "UNITE",    valeur: 0,  familles: ["IMPRIMERIE"] },
    { code: "OEIL",  libelle: "Œillets",              mode: "UNITE",    valeur: 0,  familles: ["SIGNALETIQUE"] },
    { code: "OURL",  libelle: "Ourlet",               mode: "M2",       valeur: 0,  familles: ["SIGNALETIQUE"] },
    { code: "LAM",   libelle: "Lamination",           mode: "M2",       valeur: 0,  familles: ["SIGNALETIQUE"] },
    { code: "POSE",  libelle: "Pose sur site",        mode: "FIXE",     valeur: 0,  familles: ["SIGNALETIQUE"] },
  ],

  /* Remise maximale autorisée, en pourcentage. */
  remiseMax: 20,

  /* Plancher de facturation, en euros. Sous ce montant, l'écart est ajouté
     au devis sous le libellé « Frais de traitement ». Une commande de deux
     stickers ne couvre pas le temps de calage, de découpe et de comptoir.
     Mettre à 0 pour désactiver. */
  fraisTraitementMini: 15,
};
