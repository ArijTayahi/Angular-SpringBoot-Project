import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Direction } from '../models-gestion-ont/direction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  baseUrl = environment.API_BASE_URL+ "/directions"


  constructor(private http: HttpClient) {}


  // Créer une direction
  createDirection(direction: Direction): Observable<Direction> {
    return this.http.post<Direction>(`${this.baseUrl}/create`, direction);
  }


  // Mettre à jour une direction
  updateDirection(direction: Direction): Observable<Direction> {
    return this.http.put<Direction>(`${this.baseUrl}/update`, direction);
  }


  // Supprimer une direction
  deleteDirection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }


  // Récupérer une direction par ID
  getDirectionById(id: number): Observable<Direction> {
    return this.http.get<Direction>(`${this.baseUrl}/getdirecteur/${id}`);
  }


  // Récupérer toutes les directions
  getAllDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>(`${this.baseUrl}/All`);
  }


  // Rechercher des directions par titre
  searchDirection(titre: string): Observable<Direction[]> {
    return this.http.get<Direction[]>(`${this.baseUrl}/search`, {
      params: { titre }
    });
  }
}






