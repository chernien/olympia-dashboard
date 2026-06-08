import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticleService } from 'src/app/services/article.service';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.css']
})
export class GlobalComponent {
  categories: any;
  collections: any;
  natures: any;
  familles: any;
  products: any;
  selectedProducts: any;
  selectedCategories: string[] = [];
  selectedCollections: string[] = [];
  searchText = "";
  tars: any;
  tarifs: any;
  sref1: any;
  sref2: any;
  selectedSref1: any;
  selectedSref2: any;
  remise: any;
  remiseCli: any;
  client: any;
  qty = 1;
  filteredDataToSearch: any[] = [];
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!);
  userconnect = JSON.parse(localStorage.getItem("Client")!);
  userconnectcomm = JSON.parse(localStorage.getItem("Commercial")!);
  role = JSON.parse(localStorage.getItem("role")!);
  client_id = Number(JSON.parse(localStorage.getItem("selectedClient")!));
  selectedClient = "";
  commandes: any;
  clients: any;

  showDetails: boolean = false; // New variable to track if details should be displayed
  activeProductId: number | null = null; // To keep track of selected product

  public beComponentForm: FormGroup = new FormGroup({
    slct_cntrl: new FormControl("")
  });

  tarifForm: FormGroup = this.formBuilder.group({
    ref: ['', Validators.required],
    sref1: ['', Validators.required],
    sref2: ['', Validators.required]
  });

  @ViewChild('bottomElement') bottomElement!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllProducts();
    this.getCategory();
    this.getClientsByComm();

    if (this.userconnectcomm) {
      Swal.fire({
        icon: 'info',
        text: 'Veuillez choisir le client pour passer votre commande !'
      });
    }

    this.scrollToTop();
    this.getProductById(this.route.snapshot.paramMap.get('id'));
    this.getClientById();
  }

  toggleProductDetails(productId: number): void {
    this.showDetails = !this.showDetails;
    this.activeProductId = this.showDetails ? productId : null;
  }

  scrollToBottom(): void {
    this.bottomElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getProductById(id: any) {
    this.articleService.getArticleById(id).subscribe((res: any) => {
      this.products = res;
      this.selectedProducts = this.products;
      this.getTarByRef();
      this.getSrefs1ByRef();
      this.getSrefs2ByRef();
      if (this.userconnectcomm) {
        this.getArticleRemiseByRefByRemcod(this.client?.remcod);
        this.getTarRemiseByRef();
      }
      if (this.userconnect) {
        this.getArticleRemiseByRefByRemcod(this.userconnect?.remcod);
        this.getTarRemiseByRef();
      }
    });
  }

  getTarByRef() {
    this.articleService.getTarByRef(this.products.ref).subscribe((res: any) => {
      this.tars = res;
    });
  }

  getTarRemiseByRef() {
    this.articleService.getArticleRemiseByRef(this.products.ref).subscribe(
      (res: any) => {
        this.remise = res;
      },
      (err: any) => {
        this.remise = { rem0001: 0 };
      }
    );
  }

  getSrefs1ByRef() {
    this.articleService.getSref1Ref(this.products.ref).subscribe((res: any) => {
      this.sref1 = res;
    });
  }

  getSrefs2ByRef() {
    this.articleService.getSref2Ref(this.products.ref).subscribe((res: any) => {
      this.sref2 = res;
    });
  }

  getClientById() {
    this.clientService.getClientByCliId(this.client_id).subscribe((res: any) => {
      this.client = res;
    });
  }

  getArticleRemiseByRefByRemcod(remcod: any) {
    this.articleService.getArticleRemiseByRefByRemcod(this.products?.ref, remcod).subscribe(
      (res: any) => {
        this.remiseCli = res;
      },
      (err: any) => {
        this.remiseCli = { rem0001: 0 };
      }
    );
  }

 getTarifBySref1Sref2Ref(): void {

  if (!this.selectedSref1) {
    this.selectedSref1 = "";
  }

  if (!this.selectedSref2) {
    this.selectedSref2 = "";
  }

  const ref = this.products.ref;

  // 🔥 récupération du DOS depuis localStorage
  const contact = JSON.parse(localStorage.getItem("Contact")!);
  const dos = contact?.dos;

  this.articleService
    .getTarifBySref1Sref2Ref(
      this.selectedSref1,
      this.selectedSref2,
      ref,
      dos
    )
    .subscribe(
      (response: any) => {

        this.tarifs = response;

      },
      (error: any) => {

        console.error("pas de sref selectionnés");

      }
    );
}

  addToCart(product: any, prix: number, sref1: any, sref2: any): void {
    const remiseValue = this.remiseCli?.rem0001 > this.remise?.rem0001 ? this.remiseCli?.rem0001 : this.remise?.rem0001;
    this.cartService.addToCart(product, this.qty, prix - (prix * (remiseValue / 100)), sref1, sref2);
  }

  addToWishlist(product: any): void {
    this.wishlistService.addToWishlist(product, 1);
  }

  openSnackBarCart() {
    this.snackBar.open('Votre produit a été ajouté au panier avec succès!', 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['red-snackbar'],
    });
  }

  openSnackBarWishlist() {
    this.snackBar.open('Votre produit a été ajouté à la liste des envies avec succès!', 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: ['red-snackbar'],
    });
  }

  getAllProducts() {
    this.articleService.getArticle().subscribe((res: any) => {
      this.products = res;
      this.selectedProducts = this.products;
    });
  }

  getClientsByComm() {
    this.clientService.getClientByComm(this.userconnectcomm?.tiers).subscribe((res: any) => {
      this.clients = res;
    });
  }

  onSelectedClient() {
    localStorage.setItem("selectedClient", JSON.stringify(this.selectedClient));
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

  onCategoryChange(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    } else {
      this.selectedCategories.push(category);
    }
    this.filterProducts();
  }

  filterProducts() {
    if (this.selectedCategories?.length == 0) {
      this.getAllProducts();
    }
    this.selectedProducts = this.products.filter((product: any) => {
      return this.selectedCategories.includes(product?.fam0001);
    });
  }

  onCollectionChange(collection: string) {
    if (this.selectedCollections.includes(collection)) {
      this.selectedCollections = this.selectedCollections.filter(c => c !== collection);
    } else {
      this.selectedCollections.push(collection);
    }
    this.filterProductsCollection();
  }

  filterProductsCollection() {
    if (this.selectedCollections?.length == 0) {
      this.getAllProducts();
    }
    this.selectedProducts = this.products.filter((product: any) => {
      return this.selectedCollections.includes(product.artcollection);
    });
  }

  isLocalStorageSelectedClient(): boolean {
    return !!window.localStorage.getItem('selectedClient');
  }
}

