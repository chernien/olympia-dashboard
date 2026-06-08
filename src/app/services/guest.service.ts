import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) { }

  getGuests(): Observable<any> {
    return this.http.get(`${environment.base_url}/api/Guest`);
  }

  getGuestById(id: number): Observable<any> {
    return this.http.get(`${environment.base_url}/api/Guest/${id}`);
  }

  createGuest(guest: any): Observable<any> {
    return this.http.post(`${environment.base_url}/api/Guest`, guest);
  }

  deleteGuest(id: number): Observable<any> {
    return this.http.delete(`${environment.base_url}/api/Guest/${id}`);
  }

}