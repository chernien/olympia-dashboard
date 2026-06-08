import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnyFn } from '@ngrx/store/src/selector';
import { ArticleService } from 'src/app/services/article.service';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!)
  userconnect = JSON.parse(localStorage.getItem("Client")!)
  userconnectcomm = JSON.parse(localStorage.getItem("Commercial")!)
  client_id = Number(JSON.parse(localStorage.getItem("selectedClient")!))
  reglement = String(JSON.parse(localStorage.getItem("reglement")!))

  role = JSON.parse(localStorage.getItem("role")!).toString()
  connectedRole: string
  formClient: FormGroup;
  formCommande: FormGroup;
  cartItems: any[] = [];
  cartTotal: number = 0;
  reglements: any
  client:any
  constructor(private formBuilder: FormBuilder, private articleService: ArticleService, private clientService: ClientService, private cartService: CartService, private router: Router) {
    this.cartItems = this.cartService.cartItems;
    this.cartTotal = this.cartService.getTotal();

  }

  ngOnInit() {
    this.getAllReglement()
    if (this.role == "Commercial") {
      this.connectedRole = "Commercial"
      this.getClientById()

    }
    if (this.role == "Client") {
      this.connectedRole = "Client"
    }
    this.formClient = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      companyName: ['', Validators.required],
      townCity: ['', Validators.required],
      postcode: ['', Validators.required],
      streetAddress: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.formCommande = this.formBuilder.group({
      clientId: ['', Validators.required],
      artid: ['', Validators.required],
      atyintitule: ['', Validators.required],
      artdesignation: ['', Validators.required],
      artsousfamille: ['', Validators.required],
      artnature: ['', Validators.required],
      artcategorie: ['', Validators.required],
      artcollection: ['', Validators.required],
      artisdefautfam: ['', Validators.required],
      atfprix: ['', Validators.required],
      quantite: ['', Validators.required]
    })
    this.getPatchFormClient()
  }
  getPatchFormClient() {
    this.formClient.patchValue({
      firstName: this.userconnect?.firstName,
      lastName: this.userconnect?.lastName,
      country: this.userconnect?.country,
      companyName: this.userconnect?.companyName,
      townCity: this.userconnect?.townCity,
      postcode: this.userconnect?.postcode,
      streetAddress: this.userconnect?.streetAddress,
      phone: this.userconnect?.phone,
      email: this.userconnect?.email,
      password: this.userconnect?.password
    })

  }
  getAllReglement() {
    this.articleService.getModeReglement().subscribe(
      (res: any) => {
        this.reglements = res
      }
    )
  }
  getPatchFormCommande() {
    this.formCommande.patchValue({
      clientId: this.userconnect?.clientId,
      lastName: this.userconnect?.lastName,
      country: this.userconnect?.country,
      companyName: this.userconnect?.companyName,
      townCity: this.userconnect?.townCity,
      postcode: this.userconnect?.postcode,
      streetAddress: this.userconnect?.streetAddress,
      phone: this.userconnect?.phone,
      email: this.userconnect?.email,
      password: this.userconnect?.password
    })

  }
  updateQuantity(product: any): void {
    this.cartService.updateQuantity(product, product?.quantity);
  }
  removeFromCart(item: any): void {
    this.cartService.removeFromCart(item);
    this.cartTotal = this.cartService.getTotal();
  }
  getTotalProduct(item: any): number {
    let total = 0;
    total += item.prix * item.quantite;

    return total;
  }
  clearCart(): void {
    this.cartService.clearCart();
    this.cartTotal = this.cartService.getTotal();
  }
  getClientById(){
    this.clientService.getClientByCliId(this.client_id).subscribe(
      (res:any)=>{
        this.client=res
      }
    )
  }

  passerCommande() {
    const articles = this.cartItems.map(cartItem => {
      return {
        ...cartItem // Remplacez la valeur de quantite par la valeur de quantity
      };
    });

    // Supprimez la propriété "quantity" de chaque objet dans la liste d'articles mise à jour

    let commandeDto: any = {
      clientId: this.client_id,
      tiers: this.userconnectcomm?.tiers,
      cE4: '1',
      reglement:this.reglement,
      articles: articles
    };
    this.articleService.EnvoieCommande(commandeDto)
      .subscribe(
        (response: any) => {
          // Traitement en cas de succès
          this.router.navigateByUrl('/home/account')
          Swal.fire({
            icon: 'success',
            text: 'Commande passée avec succès !'
          })
        },
        (error: any) => {
          // Traitement en cas d'erreur
          console.error('Erreur lors de la passation de la commande :', error);
        }
      );
  }
  passerCommandeClient() {
    const articles = this.cartItems.map(cartItem => {
      return {
        ...cartItem // Remplacez la valeur de quantite par la valeur de quantity
      };
    });

    // Supprimez la propriété "quantity" de chaque objet dans la liste d'articles mise à jour

    let commandeDto: any = {
      clientId: this.userconnect.clI_ID,
      tiers: this.userconnect?.tiers,
      cE4: '1',
      reglement:this.reglement,
      articles: articles
    };
    this.articleService.EnvoieCommande(commandeDto)
      .subscribe(
        (response: any) => {
          // Traitement en cas de succès
          this.router.navigateByUrl('/home/account')
          Swal.fire({
            icon: 'success',
            text: 'Commande passée avec succès !'
          })
        },
        (error: any) => {
          // Traitement en cas d'erreur
          console.error('Erreur lors de la passation de la commande :', error);
        }
      );
  }
}
