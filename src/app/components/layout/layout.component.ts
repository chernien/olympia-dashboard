import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from 'src/app/services/article.service';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';
import { GuestService } from 'src/app/services/guest.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'layout-list',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  categories: any
  collections: any
  natures: any
  familles: any
  products: any
  searchText = ""
  selectedProducts: any
  commandeType: string = 'achat'; 
  guests: any[] = []; 
  selectedGuest: any = null; 

  selectedCategories: string[] = [];
  selectedCollections: string[] = [];
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!)
  userconnect = JSON.parse(localStorage.getItem("Client")!)
  userconnectcomm = JSON.parse(localStorage.getItem("Commercial")!)
  userconnectcontact = JSON.parse(localStorage.getItem("Contact")!)
  commandes: any
  clients: any
  contacts:any
  selectedClient = ""
  selectedContact = ""
  guestSearchTerm: string = '';
  filteredGuests: any[] = []; 
  isRedAchatButton = false;


  constructor(private articleService: ArticleService,private clientService:ClientService, private guestService: GuestService
    , private cartService: CartService, private wishlistService: WishlistService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loadGuests();
    this.getAllProducts()
    this.getCategory()
    this.getClientsByComm()
    this.getContactsByClient()
    
const contact = JSON.parse(localStorage.getItem('Contact') || '{}');

console.log('DOS connecté :', contact?.dos);

this.isRedAchatButton =
  Number(contact?.dos) === 6 ||
  Number(contact?.dos) === 1;

    
    if(this.userconnectcomm)
    Swal.fire({
      icon: 'info',
      text: 'Veuillez choisir le client pour passer votre commande !'
    })
    if(this.userconnect)
      Swal.fire({
        icon: 'info',
        text: 'Veuillez choisir le contact pour passer votre commande !'
      })
  }

clearGuestSearch(): void {
  this.guestSearchTerm = '';
  this.filterGuests();
}

filterGuests() {
  if (!this.guestSearchTerm) {
      this.filteredGuests = [...this.guests];
      return;
  }
  
  const searchTerm = this.guestSearchTerm.toLowerCase();
  this.filteredGuests = this.guests.filter(guest => 
      (guest.nom && guest.nom.toLowerCase().includes(searchTerm)) ||
      (guest.prenom && guest.prenom.toLowerCase().includes(searchTerm)) ||
      (guest.tel && guest.tel.includes(this.guestSearchTerm))
  );
}
  shouldShowGuestList(): boolean {
    if (!this.userconnectcontact) {
      console.log('shouldShowGuestList: userconnectcontact est null ou undefined');
      return false;
    }
    
    const allowedEmails = [
      's.sousse@olympiacompany.com',
      's.bouhjar@olympiacompany.com',
      's.msaken@olympiacompany.com',
      's.gabes@olympiacompany.com'
    ];
    
    const userEmail = this.userconnectcontact.email.trim().toLowerCase();
    const result = allowedEmails.includes(userEmail);
    
    return result;
  }


  isCommercialContact(): boolean {
  const contact = this.userconnectcontact;

  if (!contact || !contact.tiers) {
    return false;
  }

  return contact.tiers.trim().startsWith('COM');
}

  openSnackBarCart() {
    this.snackBar.open('Votre produit a été ajouté au panier avec succés!', 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['red-snackbar'],
    });
  }
  
  openSnackBarWishlist() {
    this.snackBar.open('Votre produit a été ajouté a la liste des envies avec succés!', 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: ['red-snackbar'],
    });
  }
  
  isLocalStorageSelectedClient(): boolean {
    return !!window.localStorage.getItem('selectedClient');
  }
  
  isLocalStorageSelectedContact(): boolean {
    return !!window.localStorage.getItem('selectedContact');
  }
  
  /* getAllProducts() {
    this.articleService.getArticle().subscribe(
      (res: any) => {
        this.products = res
        this.selectedProducts = this.products
      }
    )
  } */

    canShowVenteButton(): boolean {

  const contact = JSON.parse(localStorage.getItem("Contact") || "{}");
  const dos = Number(contact?.dos);

  // 🔥 cacher vente pour DOS 1 et 6
  return dos !== 1 && dos !== 6;
}

 getAllProducts() {

  const contact = JSON.parse(localStorage.getItem("Contact") || "{}");
  const dos = contact?.dos;

  if (!dos) {
    console.error("DOS introuvable dans localStorage");
    return;
  }

  this.articleService.getArticle1(dos).subscribe(
    (res: any) => {
      this.products = res;
      this.selectedProducts = this.products;
    },
    (err) => {
      console.error("Erreur API articles :", err);
    }
  );
}

  
  onCommandeTypeChange() {
    localStorage.setItem('commandeType', this.commandeType);
    if (this.commandeType !== 'vente' && !this.shouldShowGuestList()) {
      localStorage.removeItem('selectedGuest');
    }
  }
  setCommandeType(type: string): void {
    this.commandeType = type;
    this.onCommandeTypeChange();
  }
  
  onGuestChange() {
    localStorage.setItem('selectedGuest', JSON.stringify(this.selectedGuest));
  }
  
  loadGuests(): void {
    if (this.userconnectcontact) {
      this.guestService.getGuests().subscribe(
        (data: any) => {
          console.log("guest:", data)
          const userCliId = Number(this.userconnectcontact?.t2_ID);
          this.guests = data.filter((guest: any) => Number(guest.cliId) === userCliId);
          this.filteredGuests = [...this.guests];
        },
        (error) => {
          console.error('Erreur lors du chargement des invités', error);
        }
      );
    }
  }
  
  getClientsByComm() {
    this.clientService.getClientByComm(this.userconnectcomm?.tiers).subscribe(
      (res: any) => {
        this.clients = res
      })
  }
  
  getContactsByClient() {
    this.clientService.getClientByContact(this.userconnect?.tiers).subscribe(
      (res: any) => {
        this.contacts = res
        console.log("Résultats des contacts :", this.contacts);
      })
  }
  
  onSelectedClient() {
    localStorage.setItem("selectedClient", JSON.stringify(this.selectedClient))
  }
  
  onSelectedContact() {
    localStorage.setItem("selectedContact", JSON.stringify(this.selectedContact))
  }
  
 getCategory() {

  const contact = JSON.parse(localStorage.getItem("Contact") || "{}");
  const dos = contact?.dos;

  if (!dos) {
    console.error("DOS introuvable dans localStorage");
    return;
  }

  this.articleService.getFamille(dos).subscribe(
    (res: any) => {

      this.categories = res.sort(
        (a: any, b: any) => a.lib.localeCompare(b.lib)
      );

    },
    (err) => {
      console.error("Erreur API familles :", err);
    }
  );
}

  addToWishlist(product: any): void {
    this.wishlistService.addToWishlist(product, 1);
  }
  
  getNatures() {
    this.articleService.getNature().subscribe(
      (res: any) => {
        this.natures = res;
      }
    )
  }
  
  getCollections() {
    this.articleService.getCollections().subscribe(
      (res: any) => {
        this.collections = res;
      }
    )
  }
  
  getFamilles() {
    this.articleService.getSousfamilles().subscribe(
      (res: any) => {
        this.familles = res;
      }
    )
  }
  
  onCategoryChange(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    else {
      this.selectedCategories.push(category);
    }
    this.filterProducts()
  }
  
  filterProducts() {
    if (this.selectedCategories?.length == 0) {
      this.getAllProducts()
    }
    this.selectedProducts = this.products.filter((product: any) => {
      return this.selectedCategories.includes(product?.fam0001);
    });
  }
  
  onCollectionChange(collection: string) {
    if (this.selectedCollections.includes(collection)) {
      this.selectedCollections = this.selectedCollections.filter(c => c !== collection);
    }
    else {
      this.selectedCollections.push(collection);
    }
    this.filterProductsColection()
  }
  
  filterProductsColection() {
    if (this.selectedCollections?.length == 0) {
      this.getAllProducts()
    }
    this.selectedProducts = this.products.filter((product: any) => {
      return this.selectedCollections.includes(product.artcollection);
    });
  }
}