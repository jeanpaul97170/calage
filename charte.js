/* =====================================================================
   CHARTE GRAPHIQUE — Imprimerie de Jarry
   ---------------------------------------------------------------------
   Valeurs issues de charte-graphique-imprimerie-de-jarry.md.
   Seul fichier à modifier pour rhabiller l'application.
   Pour le logo : déposer logo.svg dans ce dossier.
   ===================================================================== */
const CHARTE = {
  nom: "Imprimerie de Jarry",
  titre: "Calage",

  logo: "logo.svg",
  hauteurLogo: 22,
  logoRemplaceTitre: false,

  couleurs: {
    marque:      "#CC2A2A",  // rouge IDJ
    barre:       "#1A1A1A",  // bandeau latéral, noir texte de la charte
    barre2:      "#262626",
    barreTexte:  "#E8E8E8",
    fond:        "#F0F0F0",  // gris clair charte
    panneau:     "#FFFFFF",
    trait:       "#D8D8D8",
    traitFort:   "#BFBFBF",
    texte:       "#1A1A1A",
    texteFaible: "#6B6B6B",
    accent:      "#CC2A2A",
  },

  // bande de repérage colorimétrique en haut de page
  gamme: ["#CC2A2A", "#1A1A1A", "#E8E8E8", "#CC2A2A"],

  polices: {
    googleFonts: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
    titre:   "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    donnees: "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  },
};

/* Les couleurs des verdicts (vert, orange, rouge) ne sont volontairement
   pas dans la charte : ce sont des signaux de sécurité, ils doivent rester
   identiques quelle que soit l'identité visuelle. Le rouge de verdict est
   d'ailleurs distinct du rouge de marque, pour qu'un bandeau rouge ne soit
   jamais confondu avec un simple élément d'habillage. */
