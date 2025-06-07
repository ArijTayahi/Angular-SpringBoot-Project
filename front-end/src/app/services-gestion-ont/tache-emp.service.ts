// Méthodes à ajouter dans tache.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tache } from '../models-gestion-ont/tache';
import { EtatTache } from '../models-gestion-ont/etat-tache';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TacheEmpService {
  private apiUrl = environment.API_BASE_URL + '/taches'; // Ajustez selon votre configuration

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les tâches d'un employé spécifique
  tachesParEmploye(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/employe`);
  }

  // Méthode pour mettre à jour l'état d'une tâche
  updateEtat(tacheId: number, etat: EtatTache): Observable<void> {
    const params = new HttpParams().set('etat', etat);
    return this.http.put<void>(`${this.apiUrl}/${tacheId}/etat`, {}, { params });
  }

  // Les autres méthodes existantes restent inchangées...
  getAllTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.apiUrl);
  }

  // ... autres méthodes existantes
}
