
import { EtatTache } from './etat-tache';

export interface Tache {
    id: number;
    titre: string;
    description: string;
    dateEcheance: Date;
    etatTache: EtatTache;
    employeIds?: number[]; // IDs des employés assignés à cette tâche
}

export interface Tachesempdto {
    tache: Tache
    idEmps: number[];
  }