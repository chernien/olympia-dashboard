import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'cartItems';
  cartItems: any[] = [];

  constructor() {
    const storedCartItems = localStorage.getItem(this.storageKey);
    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    }
  }

  private saveCartItems(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

  addToCart(product: any, quantity: number, prix: number, sref1: string, sref2: string): void {
    const existingItem = this.cartItems.find(item => item.artId === product.artId && sref1.trim() == item?.sref1?.trim() && sref2?.trim() == item?.sref2.trim());
    if (existingItem) {
      existingItem.quantite += quantity;
    } else {
      const newItem = { ...product, quantite: quantity, prix: prix+(prix*0.19), sref1: sref1, sref2: sref2 };
      this.cartItems.push(newItem);
    }
    this.saveCartItems();
  }

  removeFromCart(product: any): void {
    const index = this.cartItems.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.saveCartItems();
    }
  }


  
  updateQuantity(product: any, quantity: number): void {
    const index = this.cartItems.indexOf(product); // Utiliser l'objet produit pour trouver son index
    if (index !== -1) {
      this.cartItems[index].quantite = quantity; // Met à jour la quantité uniquement pour cet élément
      this.saveCartItems();
    }
  }
  

  

  getTotal(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.prix * item.quantite;
    }
    return total;
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartItems();
  }
}
