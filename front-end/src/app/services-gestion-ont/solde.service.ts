import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { SoldeCongeDto } from '../models-gestion-ont/SoldeCongeDto';
import { Inputsoldedto } from '../models-gestion-ont/inputsolde';

@Injectable({
  providedIn: 'root'
})
export class SoldeService {
  private baseUrl = environment.API_BASE_URL + '/solde-conge';

  constructor(private http: HttpClient) { }
  
  creerSolde(employeId: number, annee: number, soldeInitial: number): Observable<SoldeCongeDto> {
    const url = `${this.baseUrl}/${employeId}/${annee}/${soldeInitial}`;
    return this.http.get<SoldeCongeDto>(url);
  }
    creerSoldee(input: Inputsoldedto): Observable<SoldeCongeDto> {
    return this.http.post<SoldeCongeDto>(`${this.baseUrl}/Initialiser-solde`, input);
  }
}
