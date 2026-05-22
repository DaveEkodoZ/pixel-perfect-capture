export const usersWeb = [
  { id: 1, nom: "Marie Mballa", email: "marie@cuy.cm", telephone: "+237 690 11 22 33", role: "ADMIN", is_active: true },
  { id: 2, nom: "Jean Eboa", email: "jean@cuy.cm", telephone: "+237 677 44 55 66", role: "ADMIN", is_active: true },
  { id: 3, nom: "Aïcha Ngono", email: "aicha@cuy.cm", telephone: "+237 655 88 99 00", role: "MODERATEUR", is_active: false },
  { id: 4, nom: "Paul Atangana", email: "paul@cuy.cm", telephone: "+237 699 12 34 56", role: "ADMIN", is_active: true },
];

export const usersMobile = [
  { id: 1, nom: "Samuel Biya", telephone: "+237 690 00 11 22", role: "USER", est_active: true },
  { id: 2, nom: "Clarisse Onana", telephone: "+237 677 33 44 55", role: "USER", est_active: true },
  { id: 3, nom: "Yves Mbarga", telephone: "+237 655 66 77 88", role: "USER", est_active: false },
  { id: 4, nom: null, telephone: "+237 699 99 88 77", role: "USER", est_active: true },
  { id: 5, nom: "Estelle Fouda", telephone: "+237 690 22 33 44", role: "USER", est_active: true },
];

export const posts = [
  {
    id: 1,
    titre: "Lancement du programme de propreté urbaine",
    contenu: "La CUY lance un vaste programme de propreté dans les sept arrondissements de Yaoundé.",
    contact: "contact@cuy.cm",
    est_active: true,
    nb_vues: 1284,
    nb_likes: 312,
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
  },
  {
    id: 2,
    titre: "Travaux d'asphaltage à Bastos",
    contenu: "Les travaux d'asphaltage de l'avenue principale de Bastos débuteront lundi prochain.",
    contact: "voirie@cuy.cm",
    est_active: true,
    nb_vues: 842,
    nb_likes: 198,
    cover: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=800",
  },
  {
    id: 3,
    titre: "Marché de Mokolo : nouvelle organisation",
    contenu: "Une nouvelle organisation du marché de Mokolo entrera en vigueur dès le 15 du mois.",
    contact: null,
    est_active: false,
    nb_vues: 421,
    nb_likes: 76,
    cover: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
  },
];

export const stories = [
  { id: 1, url_media: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400", est_active: true, nb_vues: 542, nb_likes: 89 },
  { id: 2, url_media: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400", est_active: true, nb_vues: 312, nb_likes: 54 },
  { id: 3, url_media: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400", est_active: true, nb_vues: 178, nb_likes: 32 },
  { id: 4, url_media: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400", est_active: false, nb_vues: 90, nb_likes: 12 },
];

export const sondages = [
  {
    id: 1,
    question: "Quel projet prioriser pour 2026 ?",
    statut: "ACTIF",
    total: 1245,
    options: [
      { id: 1, libelle: "Transports en commun", votes: 612 },
      { id: 2, libelle: "Espaces verts", votes: 304 },
      { id: 3, libelle: "Éclairage public", votes: 219 },
      { id: 4, libelle: "Gestion des déchets", votes: 110 },
    ],
  },
  {
    id: 2,
    question: "Êtes-vous satisfait du nouveau service de bus ?",
    statut: "TERMINE",
    total: 856,
    options: [
      { id: 1, libelle: "Très satisfait", votes: 401 },
      { id: 2, libelle: "Plutôt satisfait", votes: 289 },
      { id: 3, libelle: "Insatisfait", votes: 166 },
    ],
  },
];

export const signalements = [
  { id: 1, quartier: "Bastos", ville: "Yaoundé", categorie: "Voirie", description: "Nid-de-poule profond sur l'avenue principale.", statut: "EN_ATTENTE", photo: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=400", date: "2026-05-20" },
  { id: 2, quartier: "Mvog-Mbi", ville: "Yaoundé", categorie: "Éclairage", description: "Lampadaire en panne depuis 2 semaines.", statut: "EN_COURS", photo: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400", date: "2026-05-18" },
  { id: 3, quartier: "Mokolo", ville: "Yaoundé", categorie: "Déchets", description: "Bac à ordures débordant près du marché.", statut: "RESOLU", photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400", date: "2026-05-12" },
  { id: 4, quartier: "Nlongkak", ville: "Yaoundé", categorie: "Voirie", description: "Canalisation bouchée provoquant inondation.", statut: "EN_ATTENTE", photo: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400", date: "2026-05-21" },
];

export const idees = [
  { id: 1, titre: "Vélos en libre service", description: "Mettre en place des vélos en libre service dans le centre-ville.", statut: "EN_ATTENTE", auteur: "Samuel Biya", date: "2026-05-19" },
  { id: 2, titre: "Marchés nocturnes mensuels", description: "Organiser des marchés nocturnes culturels chaque mois.", statut: "VALIDE", auteur: "Clarisse Onana", date: "2026-05-10" },
  { id: 3, titre: "Application de covoiturage citoyen", description: "Une app pour le covoiturage entre quartiers.", statut: "REJETE", auteur: "Yves Mbarga", date: "2026-05-02" },
  { id: 4, titre: "Plus d'arbres dans les écoles", description: "Planter des arbres fruitiers dans les cours d'école.", statut: "EN_ATTENTE", auteur: "Estelle Fouda", date: "2026-05-20" },
];
