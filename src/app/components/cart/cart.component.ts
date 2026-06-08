import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';
import { GuestService } from 'src/app/services/guest.service'; // Importez le service GuestService
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: any[] = [];
  cartTotal: number = 0;
  cartTotalHt: number = 0;
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!);
  userconnect = JSON.parse(localStorage.getItem("Client")!);
  userconnectcomm = JSON.parse(localStorage.getItem("Commercial")!);
  userconnectcontact = JSON.parse(localStorage.getItem("Contact")!);
adresseFacturation: string = '';
adresseLivraison: string = '';

  client_id = Number(JSON.parse(localStorage.getItem("selectedClient")!));
  contact_id = Number(JSON.parse(localStorage.getItem("selectedContact")!));
  reglement = String(JSON.parse(localStorage.getItem("reglement")!));
  selectedClient = "";
  selectedContact = "";
  selectedReglement = "";
  commandes: any;
  clients: any;
  contacts: any;
  reglements: any;
  connectedRole: string;
  formClient: FormGroup;
  formContact: FormGroup;
  tiers: any;
  clientIdByTiers: any;
  formCommande: FormGroup;
  client: any;
  contact: any;

  guests: any[] = []; 
  selectedGuest: any = null; 
  commandeType: string = 'achat'; 
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private clientService: ClientService,
    private guestService: GuestService, 
    public cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.cartItems = this.cartService.cartItems;
    this.cartTotal = this.cartService.getTotal();
  }

  ngOnInit() {
    this.getAllReglement();
    this.getClientsByComm();
    this.getContactById();
    this.loadGuests(); 
    this.commandeType = localStorage.getItem('commandeType') || 'achat';
    this.selectedGuest = JSON.parse(localStorage.getItem('selectedGuest') || 'null');

    if (JSON.parse(localStorage.getItem("role")!) == "Commercial") {
      this.connectedRole = "Commercial";
      this.getClientById();
    }
    if (JSON.parse(localStorage.getItem("role")!) == "Client") {
      this.connectedRole = "Client";
      this.getContactById();
    }
    if (JSON.parse(localStorage.getItem("role")!) == "Contact") {
      this.connectedRole = "Contact";
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
    });
    this.formContact = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

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
    });

    this.getPatchFormClient();
    this.getPatchFormContact();
    this.getContactById();
    this.getClientById();
    this.getClientByTiers();
  }

  loadGuests(): void {
    this.guestService.getGuests().subscribe(
      (data: any) => {

  
        const userCliId = Number(this.userconnectcontact?.t2_ID);
        this.guests = data.filter((guest: any) => Number(guest.cliId) === userCliId); 
      },
      (error) => {
      }
    );
  }

passerCommandeContact(): void {
  // 🛡️ Protection double-clic / double-tap
  if (this.isSubmitting) return;

  if (this.cartItems.length === 0) {
    Swal.fire({
      icon: 'error',
      text: 'Votre panier est vide. Ajoutez des produits avant de passer commande.'
    });
    return;
  }

  Swal.fire({
    title: 'Confirmation',
    text: 'Voulez-vous vraiment passer cette commande ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, confirmer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {

      // 🔒 Verrouiller immédiatement après confirmation
      this.isSubmitting = true;

      const commandeType = localStorage.getItem('commandeType') || 'achat';
      const guestItem = localStorage.getItem('selectedGuest');
      const selectedGuest = guestItem ? JSON.parse(guestItem) : null;

      const articles = this.cartItems.map(cartItem => ({
        ...cartItem,
        quantite: cartItem.quantite || 1,
        eche: cartItem.eche ? 1 : 0
      }));

      const type = commandeType === 'vente' ? '2' : '1';

      let guestId;
      if (commandeType === 'vente') {
        guestId = selectedGuest?.id;
      } else {
        const allowedEmails = [
          's.sousse@olympiacompany.com',
          's.bouhjar@olympiacompany.com',
          's.msaken@olympiacompany.com',
          's.gabes@olympiacompany.com'
        ];
        const userEmail = this.userconnectcontact?.email?.trim().toLowerCase();
        guestId = allowedEmails.includes(userEmail) ? selectedGuest?.id : this.userconnectcontact?.t2_ID;
      }

      if ((commandeType === 'vente' && !selectedGuest) ||
          (commandeType === 'achat' && guestId === selectedGuest?.id && !selectedGuest)) {
        Swal.fire({
          icon: 'error',
          text: 'Veuillez sélectionner un invité pour passer cette commande.'
        });
        // 🔓 Déverrouiller si validation échoue
        this.isSubmitting = false;
        return;
      }

      const contact = JSON.parse(localStorage.getItem("Contact")!);
      const dos = contact?.dos;

      const commandeDto: any = {
        clientId: this.clientIdByTiers,
        contactId: this.userconnectcontact?.t2_ID,
        tiers: this.userconnectcontact?.tiers,
        cE4: '1',
        reglement: this.reglement,
        articles: articles,
        type: type,
        guestId: guestId,
        dos: dos,
        etb: contact.etb?.trim(),
        depot: contact.depot?.trim(),
      };

      this.articleService.EnvoieCommande(commandeDto).subscribe(
        (response: any) => {
          const commandeId = response?.commande_Id;

          this.cartService.clearCart();
          this.cartTotal = this.cartService.getTotal();
          this.router.navigateByUrl('/home/account');
          Swal.fire({
            icon: 'success',
            text: 'Commande passée avec succès !'
          });

          localStorage.removeItem('commandeType');
          localStorage.removeItem('selectedGuest');

          const adresseFact = this.adresseFacturation?.trim() || '';
          const adresseLiv = this.adresseLivraison?.trim() || '';

          if (commandeId && (adresseFact || adresseLiv)) {
            const save$ = this.articleService.saveAdresse(commandeId, adresseFact, adresseLiv);
            if (save$) {
              save$.subscribe({
                next: (res) => console.log('✅ Adresse sauvegardée !', res),
                error: (err) => {
                  console.error('❌ Erreur adresse :', err);
                  Swal.fire({
                    icon: 'warning',
                    text: 'Commande passée, mais erreur lors de la sauvegarde de l\'adresse.'
                  });
                }
              });
            }
          }

          // 🔓 Déverrouiller après succès (navigation a déjà eu lieu)
          this.isSubmitting = false;
        },
        (error: any) => {
          console.error('Erreur lors de la passation de la commande :', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la passation de la commande.',
            footer: error.message || 'Veuillez réessayer plus tard.'
          });

          // 🔓 Déverrouiller en cas d'erreur pour permettre une nouvelle tentative
          this.isSubmitting = false;
        }
      );

    } else {
      Swal.fire({
        icon: 'info',
        title: 'Commande annulée',
        text: 'Vous avez annulé la commande.'
      });
    }
  });
}


  openSnackBarRemoveCart() {
    this.snackBar.open('Votre produit a été supprimé du panier avec succès !', 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['red-snackbar'],
    });
  }
  onQuantityChange(event: Event, product: any): void {
    const newQuantity = +(event.target as HTMLInputElement).value; 
    if (newQuantity > 0 && newQuantity <= 5000) {
      this.cartService.updateQuantity(product, newQuantity);
      this.cartTotal = this.cartService.getTotal();
    } else {
      (event.target as HTMLInputElement).value = product.quantite;
    }
  }
  
  get reversedCartItems() {
    return [...this.cartItems].reverse();
  }
  
  updateQuantity(product: any): void { 
    this.cartService.updateQuantity(product, product?.quantite);
    this.cartTotal = this.cartService.getTotal();
  }
  

  removeFromCart(item: any): void {
    this.cartService.removeFromCart(item);
    this.cartTotal = this.cartService.getTotal();
  }

  getTotalProduct(item: any): number {
    let total = 0;
    total += item.atfprix * item.quantity;
    return total + total * 0.19;
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartTotal = this.cartService.getTotal();
    window.location.href = "https://storeolympia/home/cart";
  }

  getClientsByComm() {
    this.clientService.getClientByComm(this.userconnectcomm?.tiers).subscribe(
      (res: any) => {
        this.clients = res;
      });
  }
  getContactsByComm() {
    this.clientService.getClientByContact(this.userconnectcontact?.tiers).subscribe(
      (res: any) => {
        this.contacts = res;
      });
      console.log(this.userconnectcontact?.tiers);
  }

  onSelectedClient() {
    localStorage.setItem("selectedClient", JSON.stringify(this.selectedClient));
  }
  onSelectedContacts() {
    localStorage.setItem("selectedContact", JSON.stringify(this.selectedContact));
  }

  onChangeReglement(event: any) {
    this.selectedReglement = event.target.value;
    localStorage.setItem("reglement", JSON.stringify(this.selectedReglement));
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
    });
  }
  getPatchFormContact() {
    this.formContact.patchValue({
      firstName: this.userconnectcontact?.t2_ID,
      lastName: this.userconnectcontact?.lastName

    });
  }

  getAllReglement() {
    this.articleService.getModeReglement().subscribe(
      (res: any) => {
        this.reglements = res;
      }
    );
  }

  getClientById() {
    this.clientService.getClientByCliId(this.client_id).subscribe(
      (res: any) => {
        this.client = res;
      }
    );
    console.log(this.client_id);
  }
  getClientByTiers() {
    this.clientService.getClientByCliTiers(this.userconnectcontact?.tiers).subscribe(
      (res: any) => {
        this.tiers = res;
        this.clientIdByTiers = res.clI_ID;
        console.log(this.tiers);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }
  
  getContactById() {
    this.clientService.getContactById(this.contact_id).subscribe(
      (res: any) => {
        this.contact = res;
      }
    );
    console.log(this.contact_id);

  }


  /*passerCommandeContact() {
    const articles = this.cartItems.map(cartItem => {
      return { ...cartItem };
    });

    let commandeDto: any = {
      clientId: this.clientIdByTiers,
      contactId:this.userconnectcontact?.t2_ID,
      tiers: this.userconnectcontact?.tiers,
      cE4: '1',
      reglement: this.reglement,
      articles: articles
    };

    this.articleService.EnvoieCommande(commandeDto)
      .subscribe(
        (response: any) => {
          this.router.navigateByUrl('/home/account');
          Swal.fire({
            icon: 'success',
            text: 'Commande passée avec succès !'
          });
        },
        (error: any) => {
          console.error('Erreur lors de la passation de la commande :', error);
        }
      );
  }*/
  passerCommande() {
    const articles = this.cartItems.map(cartItem => {
      return { ...cartItem };
    });

    let commandeDto: any = {
      clientId: this.client_id,
      contactId:this.contact_id,
      tiers: this.client?.tiers,
      cE4: '1',
      reglement: this.reglement,
      articles: articles
    };

    this.articleService.EnvoieCommande(commandeDto)
      .subscribe(
        (response: any) => {
          this.router.navigateByUrl('/home/account');
          Swal.fire({
            icon: 'success',
            text: 'Commande passée avec succès !'
          });
        },
        (error: any) => {
          console.error('Erreur lors de la passation de la commande :', error);
        }
      );
  }

  passerCommandeClient() {
    const articles = this.cartItems.map(cartItem => {
      return { ...cartItem };
    });

    let commandeDto: any = {
      clientId: this.userconnect.clI_ID,
      contactId: this.contact_id ,
      tiers: this.userconnect?.tiers,
      cE4: '1',
      reglement: this.reglement,
      articles: articles
    };

    this.articleService.EnvoieCommande(commandeDto)
      .subscribe(
        (response: any) => {
          this.router.navigateByUrl('/home/account');
          Swal.fire({
            icon: 'success',
            text: 'Commande passée avec succès !'
          });
        },
        (error: any) => {
          console.error('Erreur lors de la passation de la commande :', error);
        }
      );
  }
}
