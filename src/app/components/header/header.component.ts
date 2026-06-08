import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from 'src/app/services/article.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  categories: any
  cartItems: any[] = [];
  wishlistItems: any[] = [];
  cartTotal: number = 0;
  cartTotalTtc: number = 0;
  tarifs: any
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!)
  userconnect = JSON.parse(localStorage.getItem("Client")!)
  isAdmin: boolean = false;
  logoUrl: string = "../../../assets/olympia.jpg";
  userconnectcontact = JSON.parse(localStorage.getItem("Contact")!)
  userconnectcomm = JSON.parse(localStorage.getItem("Commercial")!)

  constructor(private articleService: ArticleService, private cartService: CartService, private wishlistService: WishlistService, private snackBar: MatSnackBar) {

    this.cartItems = this.cartService.cartItems;
    this.wishlistItems = this.wishlistService.wishlistItems;
    this.cartTotal = this.cartService.getTotal();


  }
  ngOnInit() {
    this.checkAdmin(); 
    this.loadLogoBasedOnDos();


  }

  loadLogoBasedOnDos() {

  // récupérer le user connecté peu importe son type
  const contact = JSON.parse(localStorage.getItem("Contact") || "null");
  const client = JSON.parse(localStorage.getItem("Client") || "null");
  const commercial = JSON.parse(localStorage.getItem("Commercial") || "null");

  // récupérer DOS
  const dos =
    contact?.dos ??
    client?.dos ??
    commercial?.dos;

  console.log("DOS connecté :", dos);

  // changer logo selon DOS
  if (Number(dos) === 1 || Number(dos) === 6) {

    this.logoUrl = "../../../assets/leonardo.png";

  } else {

    this.logoUrl = "../../../assets/olympia.jpg";

  }
}
  checkAdmin() {
    const email = this.userconnectcontact?.email?.trim().toLowerCase();
    this.isAdmin = email === 'mail@gmail.com'; 

  }
  logout() {
    localStorage.clear();
    window.location.href = "https://storeolympia.com";
}

 isCommercialContact(): boolean {
  const contact = JSON.parse(localStorage.getItem("Contact")!);

  if (!contact || !contact.tiers) {
    return false;
  }

  return contact.tiers.trim().startsWith('COM');
}

  openSnackBarRemoveCart() {
    this.snackBar.open('Votre produit a été supprimé au panier avec succés!', 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['red-snackbar']
    });
  }

  getTotal() {
    this.cartTotal = this.cartService.getTotal();
  }
  removeFromCart(item: any): void {
    this.cartService.removeFromCart(item);
    this.cartTotal = this.cartService.getTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartTotal = this.cartService.getTotal();
  }

  getCategory() {
    this.articleService.getCategory().subscribe(
      (res: any) => {
        this.categories = res;
      }
    )
  }
}
