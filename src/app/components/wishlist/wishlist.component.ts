import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  wishlistItems: any[] = [];
  constructor(private wishlistService: WishlistService, private cartService: CartService, private snackBar: MatSnackBar) {


    this.wishlistItems = this.wishlistService.wishlistItems;

  }
  openSnackBarCart() {
    this.snackBar.open('Votre produit a été ajouté au panier avec succés!', 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['red-snackbar'],
    });
  }
  openSnackBarRemoveWishlist() {
    this.snackBar.open('Votre produit a été supprimé de la liste des envies avec succés!', 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: ['red-snackbar'],
    });
  }
  removeFromWishlist(item: any): void {
    this.wishlistService.removeFromWishlist(item);
  }

  addToCart(product: any, prix: number): void {
    this.cartService.addToCart(product, 1, prix,"","");
  }
}
