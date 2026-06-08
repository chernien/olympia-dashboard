import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private storageKey = 'wishlistItems';
  wishlistItems: any[] = [];

  constructor() {
    const storedWishlistItems = localStorage.getItem(this.storageKey);
    if (storedWishlistItems) {
      this.wishlistItems = JSON.parse(storedWishlistItems);
    }
  }

  private saveWishlistItems(): void {
    // Enregistrer les données du panier dans le local storage
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlistItems));
  }

  addToWishlist(product: any, quantity: number): void {
    const existingItem = this.wishlistItems.find(item => item.artId === product.artId);
    if (existingItem) {
      existingItem.quantite += quantity;
    } else {
      const newItem = { ...product, quantite: quantity };
      this.wishlistItems.push(newItem);
    }
    this.saveWishlistItems();
  }

  removeFromWishlist(product: any): void {
    const index = this.wishlistItems.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.wishlistItems.splice(index, 1);
      this.saveWishlistItems();
    }
  }



  clearCart(): void {
    this.wishlistItems = [];
    this.saveWishlistItems();
  }
}
