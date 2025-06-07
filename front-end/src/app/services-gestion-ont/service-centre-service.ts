import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Listeservicedto, ServiceCentre } from '../models-gestion-ont/service-centre';

@Injectable({
  providedIn: 'root'
})
export class ServiceCentreService {

 baseUrl = environment.API_BASE_URL+ "/services-centres"


  constructor(private http: HttpClient) {}


  // Créer une direction
  createServiceCentre(serviceCentre: ServiceCentre): Observable<ServiceCentre> {
    return this.http.post<ServiceCentre>(`${this.baseUrl}/create`, serviceCentre);
  }


  // Mettre à jour une direction
  updateServiceCentre(serviceCentre: ServiceCentre): Observable<ServiceCentre> {
    return this.http.put<ServiceCentre>(`${this.baseUrl}/update`,serviceCentre);
  }


  // Supprimer une direction
  deleteServiceCentre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }


  // Récupérer une direction par ID
  getServiceCentreById(id: number): Observable<ServiceCentre> {
    return this.http.get<ServiceCentre>(`${this.baseUrl}/getbyid/${id}`);
  }


  // Récupérer toutes les directions
  getAllServicesCentres(): Observable<Listeservicedto[]> {
    return this.http.get<Listeservicedto[]>(`${this.baseUrl}/All`);
  }


  // Rechercher des directions par titre
  searchServiceCentre(titre: string): Observable<Listeservicedto[]> {
    return this.http.get<Listeservicedto[]>(`${this.baseUrl}/getServiceCentre`, {
      params: { titre }
    });
  }
}
