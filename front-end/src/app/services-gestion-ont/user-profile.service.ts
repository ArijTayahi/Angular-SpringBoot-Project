import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private baseUrl = environment.API_BASE_URL + '/profilUser';
  constructor(private http: HttpClient) {}

  getCurrentUserProfile(): Observable<ProfilUserDto> {
    return this.http.get<ProfilUserDto>(`${this.baseUrl}/getprofil`)
  }

  updateUserProfile(profile: ProfilUserDto): Observable<ProfilUserDto> {
    return this.http.put<ProfilUserDto>(`${this.baseUrl}/update`, profile)
  }
}

export interface ProfilUserDto {
  id: number
  nom: string
  prenom: string
  tlf: string
  adresse: string
  email: string
  avatar: string
}
