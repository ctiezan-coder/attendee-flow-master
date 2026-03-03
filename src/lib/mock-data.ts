import { SessionStatus } from "@/components/SessionStatusBadge";

export interface Intervenant {
  id: string;
  nom: string;
  titre: string;
  organisation: string;
  bio: string;
  photo?: string;
}

export interface Session {
  id: string;
  titre: string;
  thematique: string;
  date: string;
  horaire: string;
  lieu: string;
  intervenants: Intervenant[];
  places: number;
  inscrits: number;
  presents: number;
  statut: SessionStatus;
  description: string;
  mode: "presentiel" | "en_ligne" | "hybride";
}

export interface Participant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  secteur: string;
  taille: string;
  fonction: string;
  niveauExport: "debutant" | "intermediaire" | "confirme";
  dateInscription: string;
}

export const intervenants: Intervenant[] = [
  {
    id: "1",
    nom: "Marie Dupont",
    titre: "Directrice Export",
    organisation: "CCI France",
    bio: "Experte en développement international avec 15 ans d'expérience.",
  },
  {
    id: "2",
    nom: "Jean-Pierre Martin",
    titre: "Consultant Commerce International",
    organisation: "Business France",
    bio: "Spécialiste des marchés émergents et du commerce transfrontalier.",
  },
  {
    id: "3",
    nom: "Aïcha Benaïssa",
    titre: "Responsable Douanes & Logistique",
    organisation: "Groupe Logistiq",
    bio: "Expert en réglementation douanière et chaîne logistique internationale.",
  },
];

export const sessions: Session[] = [
  {
    id: "1",
    titre: "Les fondamentaux de l'export : premiers pas à l'international",
    thematique: "Export",
    date: "2026-03-15T09:00:00",
    horaire: "09:00 - 12:00",
    lieu: "Salle Conférence A - VDE",
    intervenants: [intervenants[0]],
    places: 30,
    inscrits: 24,
    presents: 0,
    statut: "publiee",
    description: "Session d'initiation aux fondamentaux de l'exportation pour les entreprises souhaitant se lancer à l'international.",
    mode: "hybride",
  },
  {
    id: "2",
    titre: "Réglementation douanière et certifications",
    thematique: "Réglementation",
    date: "2026-03-22T14:00:00",
    horaire: "14:00 - 17:00",
    lieu: "Salle Conférence B - VDE",
    intervenants: [intervenants[2]],
    places: 25,
    inscrits: 18,
    presents: 0,
    statut: "publiee",
    description: "Tout savoir sur les procédures douanières, les certifications requises et les normes internationales.",
    mode: "presentiel",
  },
  {
    id: "3",
    titre: "Stratégies de pénétration des marchés africains",
    thematique: "Marchés",
    date: "2026-04-05T09:30:00",
    horaire: "09:30 - 12:30",
    lieu: "Amphithéâtre - VDE",
    intervenants: [intervenants[1]],
    places: 50,
    inscrits: 42,
    presents: 0,
    statut: "publiee",
    description: "Analyse approfondie des marchés africains et stratégies d'entrée pour les PME.",
    mode: "hybride",
  },
  {
    id: "4",
    titre: "Financement et assurance à l'export",
    thematique: "Finance",
    date: "2026-02-20T09:00:00",
    horaire: "09:00 - 16:00",
    lieu: "Salle Conférence A - VDE",
    intervenants: [intervenants[0], intervenants[1]],
    places: 20,
    inscrits: 20,
    presents: 18,
    statut: "terminee",
    description: "Dispositifs de financement et solutions d'assurance pour sécuriser vos opérations export.",
    mode: "presentiel",
  },
  {
    id: "5",
    titre: "Marketing digital pour l'export",
    thematique: "Marketing",
    date: "2026-04-18T14:00:00",
    horaire: "14:00 - 17:00",
    lieu: "En ligne",
    intervenants: [intervenants[0]],
    places: 40,
    inscrits: 12,
    presents: 0,
    statut: "brouillon",
    description: "Utiliser le marketing digital pour développer sa présence à l'international.",
    mode: "en_ligne",
  },
];

export const participants: Participant[] = [
  {
    id: "1",
    nom: "Benali",
    prenom: "Karim",
    email: "k.benali@entreprise.com",
    telephone: "+33612345678",
    entreprise: "TechExport SAS",
    secteur: "Technologie",
    taille: "PME (10-50)",
    fonction: "Directeur Commercial",
    niveauExport: "intermediaire",
    dateInscription: "2026-02-15",
  },
  {
    id: "2",
    nom: "Laurent",
    prenom: "Sophie",
    email: "s.laurent@agriplus.fr",
    telephone: "+33698765432",
    entreprise: "AgriPlus SARL",
    secteur: "Agroalimentaire",
    taille: "TPE (<10)",
    fonction: "Gérante",
    niveauExport: "debutant",
    dateInscription: "2026-02-18",
  },
  {
    id: "3",
    nom: "Diallo",
    prenom: "Fatou",
    email: "f.diallo@textilux.com",
    telephone: "+33645678901",
    entreprise: "Textilux SA",
    secteur: "Textile",
    taille: "ETI (50-250)",
    fonction: "Responsable Export",
    niveauExport: "confirme",
    dateInscription: "2026-02-20",
  },
];

export const kpis = {
  totalSessions: sessions.length,
  sessionsAVenir: sessions.filter((s) => s.statut === "publiee").length,
  totalInscrits: sessions.reduce((acc, s) => acc + s.inscrits, 0),
  tauxPresence: 90,
  totalParticipants: participants.length,
  attestationsGenerees: 18,
};

export interface Emargement {
  id: string;
  participantId: string;
  sessionId: string;
  horodatage: string;
  mode: "qr_code" | "lien_en_ligne";
  present: boolean;
}

export const emargements: Emargement[] = [
  { id: "1", participantId: "1", sessionId: "4", horodatage: "2026-02-20T09:05:12", mode: "qr_code", present: true },
  { id: "2", participantId: "2", sessionId: "4", horodatage: "2026-02-20T09:02:45", mode: "qr_code", present: true },
  { id: "3", participantId: "3", sessionId: "4", horodatage: "2026-02-20T09:10:30", mode: "lien_en_ligne", present: true },
];

export interface Notification {
  id: string;
  type: "confirmation" | "rappel_j2" | "rappel_j1" | "post_session" | "annulation";
  destinataire: string;
  sessionTitre: string;
  canal: string;
  dateEnvoi: string;
  statut: "envoye" | "en_attente" | "echoue";
}

export const notifications: Notification[] = [
  { id: "1", type: "confirmation", destinataire: "k.benali@entreprise.com", sessionTitre: "Fondamentaux de l'export", canal: "Email + SMS", dateEnvoi: "2026-02-15T10:00:00", statut: "envoye" },
  { id: "2", type: "confirmation", destinataire: "s.laurent@agriplus.fr", sessionTitre: "Fondamentaux de l'export", canal: "Email + SMS", dateEnvoi: "2026-02-18T14:30:00", statut: "envoye" },
  { id: "3", type: "rappel_j2", destinataire: "k.benali@entreprise.com", sessionTitre: "Fondamentaux de l'export", canal: "Email", dateEnvoi: "2026-03-13T08:00:00", statut: "en_attente" },
  { id: "4", type: "rappel_j1", destinataire: "k.benali@entreprise.com", sessionTitre: "Fondamentaux de l'export", canal: "Email + SMS", dateEnvoi: "2026-03-14T08:00:00", statut: "en_attente" },
  { id: "5", type: "post_session", destinataire: "k.benali@entreprise.com", sessionTitre: "Financement export", canal: "Email", dateEnvoi: "2026-02-21T09:00:00", statut: "envoye" },
  { id: "6", type: "confirmation", destinataire: "f.diallo@textilux.com", sessionTitre: "Marchés africains", canal: "Email + SMS", dateEnvoi: "2026-02-20T16:00:00", statut: "envoye" },
  { id: "7", type: "rappel_j2", destinataire: "f.diallo@textilux.com", sessionTitre: "Réglementation douanière", canal: "Email", dateEnvoi: "2026-03-20T08:00:00", statut: "en_attente" },
];

export interface Attestation {
  id: string;
  participantNom: string;
  participantPrenom: string;
  sessionTitre: string;
  sessionDate: string;
  thematique: string;
  generee: boolean;
  dateGeneration?: string;
  envoyee: boolean;
}

export const attestations: Attestation[] = [
  { id: "1", participantNom: "Benali", participantPrenom: "Karim", sessionTitre: "Financement et assurance à l'export", sessionDate: "2026-02-20", thematique: "Finance", generee: true, dateGeneration: "2026-02-21", envoyee: true },
  { id: "2", participantNom: "Laurent", participantPrenom: "Sophie", sessionTitre: "Financement et assurance à l'export", sessionDate: "2026-02-20", thematique: "Finance", generee: true, dateGeneration: "2026-02-21", envoyee: true },
  { id: "3", participantNom: "Diallo", participantPrenom: "Fatou", sessionTitre: "Financement et assurance à l'export", sessionDate: "2026-02-20", thematique: "Finance", generee: true, dateGeneration: "2026-02-21", envoyee: false },
];

export const reportingData = {
  presenceParSession: [
    { session: "Fondamentaux", inscrits: 24, presents: 0 },
    { session: "Réglementation", inscrits: 18, presents: 0 },
    { session: "Marchés africains", inscrits: 42, presents: 0 },
    { session: "Financement", inscrits: 20, presents: 18 },
    { session: "Marketing digital", inscrits: 12, presents: 0 },
  ],
  parSecteur: [
    { name: "Technologie", value: 35 },
    { name: "Agroalimentaire", value: 22 },
    { name: "Textile", value: 18 },
    { name: "Industrie", value: 15 },
    { name: "Services", value: 10 },
  ],
  parNiveau: [
    { name: "Débutant", value: 40 },
    { name: "Intermédiaire", value: 38 },
    { name: "Confirmé", value: 22 },
  ],
  evolutionMensuelle: [
    { mois: "Oct", inscrits: 35, presents: 30 },
    { mois: "Nov", inscrits: 48, presents: 42 },
    { mois: "Déc", inscrits: 52, presents: 45 },
    { mois: "Jan", inscrits: 60, presents: 54 },
    { mois: "Fév", inscrits: 68, presents: 58 },
    { mois: "Mar", inscrits: 84, presents: 0 },
  ],
};
