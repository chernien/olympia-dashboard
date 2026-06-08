import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

saveAdresse(commandeId: number, adresseFact: string, adresseLiv: string) {
  if (!adresseFact && !adresseLiv) return null;

  const body = {
    Commande_Id: commandeId,
    Adresse_Facturation: adresseFact,
    Adresse_Livraison: adresseLiv
  };

  return this.http.post<any>(`${environment.base_url}/api/Adresses`, body);
}

getTacod(ref: string, sref1: string, sref2: string) {
  return this.http.get(`https://localhost:7166/api/Art/tacod?reference=${ref}&sref1=${sref1}&sref2=${sref2}`);
}




  getArticle() {
    return this.http.get(`${environment.base_url}/api/Art`);
  }

 getArticle1(dos: number) {
  return this.http.get(`${environment.base_url}/api/art?dos=${dos}`);
}
  
  getArticleRemiseByRef(ref: any) {
    return this.http.get(`${environment.base_url}/api/TarRemise/${ref}`);
  }
  getArticleRemiseByRefByRemcod(ref: any, remcod: any) {
    return this.http.get(`${environment.base_url}/api/Remise/${ref}/${remcod}`);
  }
  getModeReglement() {
    return this.http.get(`${environment.base_url}/api/Art/list/reglement`);
  }
  getCategory() {
    return this.http.get(`${environment.base_url}/api/Article/category`);
  }
  getFamille(dos: number) {
  return this.http.get(`${environment.base_url}/api/Art/famille/${dos}`);
}
  getCategoryOrder() {
    return this.http.get(`${environment.base_url}/api/Article/category/order`);
  }
  getCollections() {
    return this.http.get(`${environment.base_url}/api/Article/collection`);
  }
  getSousfamilles() {
    return this.http.get(`${environment.base_url}/api/Article/sousfamille`);
  }
  getNature() {
    return this.http.get(`${environment.base_url}/api/Article/nature`);
  }
  getArticleByNature(filter: any) {
    return this.http.get(`${environment.base_url}/api/Article/nature/${filter}`);
  }
  getArticleByCategory(filter: any) {
    return this.http.get(`${environment.base_url}/api/Article/category/${filter}`);
  }
  getArticleByCollections(filter: any) {
    return this.http.get(`${environment.base_url}/api/Article/collection/${filter}`);
  }
  getArticleBySousfamilles(filter: any) {
    return this.http.get(`${environment.base_url}/api/Article/famille/${filter}`);
  }

  getArticleById(id: any) {
    return this.http.get(`${environment.base_url}/api/Art/${id}`)
  }
  getTarByRef(ref: any) {
    return this.http.get(`${environment.base_url}/api/Tar/list/${ref}`)
  }
  getSrefsByRef(ref: any) {
    return this.http.get(`${environment.base_url}/api/Tar/tarifs/${ref}`)
  }
  getCategoryByCategory(category: string) {
    return this.http.get(`${environment.base_url}/api/Article/category/${category}`);
  }
  getCommandeClient(tiers: any) {
    return this.http.get(`${environment.base_url}/api/Art/client/${tiers}/commandes`)
  }
  getCommandeCommercial(id: any) {
    return this.http.get(`${environment.base_url}/api/Art/commercial/${id}/commandes`)
  }
  getCommandeContact(tiers: any) {
    return this.http.get(`${environment.base_url}/api/Art/contact/${tiers}/contact`)
  }

  getAllArticleCommandes(id: any) {
    return this.http.get(`${environment.base_url}/api/Art/commande/${id}/articles`)
  }
  PasserCommande(id: any) {
    return this.http.get(`${environment.base_url}/api/Art/commande/${id}/articles`)
  }
  EnvoieCommande(commande: any) {
    return this.http.post(`${environment.base_url}/api/Art/commande`, commande)
  }
 getTarifBySref1Sref2Ref(
  sref1: any,
  sref2: any,
  ref: any,
  dos: any
): Observable<any[]> {

  return this.http.get<any[]>(
    `${environment.base_url}/api/Art/tarif?sref1=${sref1}&sref2=${sref2}&reference=${ref}&dos=${dos}`
  );
}
  getSref1Ref(ref: any) {
    return this.http.get(`${environment.base_url}/api/Art/sref1?reference=${ref}`)
  }
  getSref2Ref(ref: any) {
    return this.http.get(`${environment.base_url}/api/Art/sref2/${ref}`)
  }
}
