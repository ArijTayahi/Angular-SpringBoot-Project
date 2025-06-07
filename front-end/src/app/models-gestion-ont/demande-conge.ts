// Enum pour le statut des demandes de congé
export enum StatutDemande {
    EN_ATTENTE = 'EN_ATTENTE',
    APPROUVEE = 'APPROUVEE',
    REJETEE = 'REJETEE'
}

// Enum pour le type de congé
export enum TypeConge {
    ANNUEL = 'ANNUEL',
    MALADIE = 'MALADIE',
    EXCEPTIONNEL = 'EXCEPTIONNEL',
    MATERNITE = 'MATERNITE',
    FORMATION = 'FORMATION',
    SANS_SOLDE='SANS_SOLDE',
    PAYE='PAYE',
}

// Interface pour l'employé (minimale, à adapter selon votre modèle)
export interface Employe {
    id: number;
    nom?: string;
    prenom?: string;
}

// Interface pour la demande de congé
export interface DemandeConge {
    id: number;
    dateDebut: Date | string;
    dateFin: Date | string;
    statut: StatutDemande;
    type: TypeConge;
    employe?: Employe;
    pieceJustificative?: string;
}



export interface DemandeCongesave {
    id: number;
    dateDebut: Date | string;
    dateFin: Date | string;
    statut: StatutDemande;
    type: TypeConge;
   
   
}

// Interface pour le solde de congé
export interface SoldeConge {
    id: number;
    soldeDisponible: number;
    soldePris: number;
    annee: number;
    employe?: Employe;
}