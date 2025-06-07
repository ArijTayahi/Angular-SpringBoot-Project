import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SoldeConge } from '../models-gestion-ont/demande-conge';
import { Observable } from 'rxjs';
import { Inputsoldedto } from '../models-gestion-ont/inputsolde';
import { SoldeCongeDto } from '../models-gestion-ont/SoldeCongeDto';

@Injectable({
  providedIn: 'root'
})
export class SoldeCongeService {
  
  baseUrl = environment.API_BASE_URL + "/solde-conge";
  
  constructor(private http: HttpClient) {}
  
  // Créer un solde pour un employé
creerSoldee(input: Inputsoldedto): Observable<SoldeCongeDto> {
    return this.http.post<SoldeCongeDto>(`${this.baseUrl}/Initialiser-solde`, input);
  }
  
  // Consulter le solde d'un employé pour une année donnée
  consulterSolde(employeId: number, annee: number): Observable<SoldeConge> {
    return this.http.get<SoldeConge>(`${this.baseUrl}/${employeId}/${annee}`);
  }
  
  // Obtenir l'historique des soldes d'un employé
  historiqueSoldes(employeId: number): Observable<SoldeConge[]> {
    return this.http.get<SoldeConge[]>(`${this.baseUrl}/historique/${employeId}`);
  }
  
  // Modifier manuellement un solde
  modifierSolde(soldeId: number, nouveauSoldeDisponible: number): Observable<SoldeConge> {
    return this.http.put<SoldeConge>(
      `${this.baseUrl}/${soldeId}`,
      null,
      { params: new HttpParams().set('nouveauSoldeDisponible', nouveauSoldeDisponible.toString()) }
    );
  }
}