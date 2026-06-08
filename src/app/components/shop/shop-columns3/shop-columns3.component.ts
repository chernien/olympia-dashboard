import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from 'src/app/services/article.service';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-columns3',
  templateUrl: './shop-columns3.component.html',
  styleUrls: ['./shop-columns3.component.css']
})
export class ShopColumns3Component {
  categories: any
  collections: any
  natures: any
  familles: any
  products: any
  selectedProducts: any
  searchText = ""
  selectedCategories: string[] = [];
  selectedCollections: string[] = [];
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!)
  userconnect = JSON.parse(localStorage.getItem("Client")!)
  userconnectcomm = JSON.parse(localStorage.getItem("Commercial")!)
  commandes: any
  clients: any
  selectedClient = ""
  constructor(private articleService: ArticleService,private clientService : ClientService ,private cartService: CartService, private wishlistService: WishlistService, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.getAllProducts()
    this.getCategory()
    this.getClientsByComm()

    if(this.userconnectcomm)
    Swal.fire({
      icon: 'info',
      text: 'Veuillez choisir le client pour passer votre commande !'
    })
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
  getAllProducts() {
    this.articleService.getArticle().subscribe(
      (res: any) => {
        this.products = res
        this.selectedProducts = this.products
      }
    )
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
  getClientsByComm() {
    this.clientService.getClientByComm(this.userconnectcomm?.tiers).subscribe(
      (res: any) => {
        this.clients = res
      })
  }
  onSelectedClient() {
    localStorage.setItem("selectedClient", JSON.stringify(this.selectedClient))
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
      // Vérifier si la catégorie du produit est présente dans les catégories sélectionnées
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
      // Vérifier si la catégorie du produit est présente dans les catégories sélectionnées
      return this.selectedCollections.includes(product.artcollection);
    });
  }

}
