import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { EtatTache } from '../models-gestion-ont/etat-tache';
import { Tache, Tachesempdto } from '../models-gestion-ont/tache';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private baseUrl = environment.API_BASE_URL + '/taches';

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les tâches
   */
  getAllTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.baseUrl);
  }

  /**
   * Crée une nouvelle tâche
   */
  /*eateTache(tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(this.baseUrl, tache);
  }*/
   saveTache(dto: Tachesempdto): Observable<Tache> {
    return this.http.post<Tache>(`${this.baseUrl}/savetachetoemp`, dto);
  }

  /**
   * Met à jour une tâche existante
   */
  updateTache(id: number, tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${this.baseUrl}/${id}`, tache);
  }

  /**
   * Supprime une tâche
   */
  deleteTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/delete`);
  }

  /**
   * Récupère les tâches d'un employé spécifique
   */
  getTachesByEmploye(employeId: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.baseUrl}/employe/${employeId}`);
  }

  /**
   * Met à jour l'état d'une tâche
   */
  updateEtat(tacheId: number, etat: EtatTache): Observable<void> {
    const params = new HttpParams().set('etat', etat);
    return this.http.put<void>(`${this.baseUrl}/${tacheId}/etat`, {}, { params });
  }

  /**
   * Affecte une tâche à plusieurs employés
   */
  affecterTacheAEmployes(tacheId: number, employeIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${tacheId}/affecter`, employeIds);
  }

  // Mise à jour du service pour inclure la méthode nécessaire
  // Dans tache.service.ts, ajoutez:
  
  
  
}