
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface DemandeCongeDto {
  id?: number;
  dateDebut: Date;
  dateFin: Date;
  type: string;
  statut?: string;
  nombreJoursOuvres?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeCongeEmpService {
  private apiUrl = environment.API_BASE_URL +'/demandes-conge';

  constructor(private http: HttpClient) { }

  /**
   * Créer une nouvelle demande de congé
   * Utilise l'endpoint POST /save avec getCurrentUser() automatique côté backend
   */
  creerDemande(demande: DemandeCongeDto): Observable<DemandeCongeDto> {
    return this.http.post<DemandeCongeDto>(`${this.apiUrl}/save`, demande);
  }

  /**
   * Récupérer l'historique des congés de l'employé connecté
   * Utilise l'endpoint GET /historique/{employeId} avec getCurrentUser() automatique
   */
  historiqueConges(): Observable<DemandeCongeDto[]> {
    // L'employeId sera automatiquement récupéré via getCurrentUser() côté backend
    return this.http.get<DemandeCongeDto[]>(`${this.apiUrl}/historique/0`);
  }

  /**
   * Supprimer une demande de congé (seulement si EN_ATTENTE)
   * Utilise l'endpoint DELETE /{id}
   */
  supprimerDemande(demandeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${demandeId}`);
  }

  /**
   * Modifier une demande de congé existante (seulement si EN_ATTENTE)
   * Utilise l'endpoint PUT /modifier/{id}
   */
  modifierDemande(demandeId: number, demande: DemandeCongeDto): Observable<DemandeCongeDto> {
    return this.http.put<DemandeCongeDto>(`${this.apiUrl}/modifier/${demandeId}`, demande);
  }

  /**
   * Valider/Rejeter une demande (pour les managers - optionnel pour l'employé)
   * Utilise l'endpoint PUT /{demandeId}/valider
   */
  validerDemande(demandeId: number, approuve: boolean): Observable<DemandeCongeDto> {
    const params = new HttpParams().set('approuve', approuve.toString());
    return this.http.put<DemandeCongeDto>(`${this.apiUrl}/${demandeId}/valider`, {}, { params });
  }

  /**
   * Récupérer toutes les demandes (pour les managers - optionnel)
   * Utilise l'endpoint GET /All
   */
  toutesLesDemandes(): Observable<DemandeCongeDto[]> {
    return this.http.get<DemandeCongeDto[]>(`${this.apiUrl}/All`);
  }
}