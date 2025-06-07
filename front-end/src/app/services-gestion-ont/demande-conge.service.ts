import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DemandeConge } from '../models-gestion-ont/demande-conge';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeCongeService {
  
  baseUrl = environment.API_BASE_URL + "/demandes-conge";
  
  constructor(private http: HttpClient) {}
  
  // Créer une demande de congé
  creerDemande(demande: DemandeConge): Observable<DemandeConge> {
    return this.http.post<DemandeConge>(`${this.baseUrl}/save`, demande);
  }
  
  // Mettre à jour une demande de congé
  updateDemande(demande: DemandeConge): Observable<DemandeConge> {
    return this.http.put<DemandeConge>(`${this.baseUrl}/modifier/${demande.id}`, demande);
  }
  
  // Valider ou rejeter une demande de congé
  validerDemande(demandeId: number, approuve: boolean): Observable<DemandeConge> {
    return this.http.put<DemandeConge>(
      `${this.baseUrl}/${demandeId}/valider`, 
      null,
      { params: new HttpParams().set('approuve', approuve.toString()) }
    );
  }
  
  // Supprimer une demande de congé
  supprimerDemande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  // Récupérer l'historique des congés d'un employé
  historiqueCongesEmploye(employeId: number): Observable<DemandeConge[]> {
    return this.http.get<DemandeConge[]>(`${this.baseUrl}/historique/${employeId}`);
  }
  
  // Récupérer toutes les demandes de congé (pour admin/RH)
  toutesLesDemandes(): Observable<DemandeConge[]> {
    return this.http.get<DemandeConge[]>(`${this.baseUrl}/All`);
  }
}