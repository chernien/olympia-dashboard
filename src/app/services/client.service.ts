import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {


  constructor(private http: HttpClient) { }


  getClients() {
    return this.http.get(`${environment.base_url}/api/Auth`);
  }
  getRoleContact() {
    return this.http.get(`${environment.base_url}/api/Auth/RoleContact`);
  }
  getClientById(username: any) {
    return this.http.get(`${environment.base_url}/api/Auth/${username}`);
  }
  getClientByCliId(id: any) {
    return this.http.get(`${environment.base_url}/api/Cli/${id}`);
  }
  getClientByCliTiers(tiers: any) {
    return this.http.get(`${environment.base_url}/api/Cli/tiers/${tiers}`);
  }
  getContactById(id: any) {
    return this.http.get(`${environment.base_url}/api/Cli/contact/${id}`);
  }
  getClientByComm(ref: any) {
    return this.http.get(`${environment.base_url}/api/Cli/client/comm/${ref}`);
  }
  getClientByContact(tiers: any) {
    return this.http.get(`${environment.base_url}/api/Cli/client/contact/${tiers}`);
  }
  saveClient(client: any) {
    return this.http.post(`${environment.base_url}/api/Auth`, client);
  }
  Login(LoginRequest: any) {
    return this.http.post(`${environment.base_url}/api/Auth/login
    `, LoginRequest)
  }
  Login2(LoginRequest: any) {
    return this.http.post(`${environment.base_url}/api/Auth/login/comm
    `, LoginRequest)
  }
  LoginT2(LoginRequest: any) {
    return this.http.post(`${environment.base_url}/api/Auth/login/contact
    `, LoginRequest)
  }
  changePassword(changePasswordRequest: any) {
    return this.http.put(`${environment.base_url}/api/Auth/change-password`, changePasswordRequest, {
      responseType: 'text' 
    });
  }
  
}
