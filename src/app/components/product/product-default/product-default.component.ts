import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';


@Component({
  selector: 'app-product-default',
  templateUrl: './product-default.component.html',
  styleUrls: ['./product-default.component.css']
})
export class ProductDefaultComponent {
  products: any
  product: any
  tars: any
  qty = 1
  tarifs: any
  sref1: any
  sref2: any
  tar: any
  tacod: string = '';

  selectedSref1: any;
  selectedSref2: any;
  tarifForm: FormGroup
  searchText = ""
  searchText2 = ""
  remise: any
  remiseCli: any
  filteredDataToSearch: any[] = [];
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")!)
  userconnect = JSON.parse(localStorage.getItem("Client")!)
  userconnectcomm = JSON.parse(localStorage.getItem("Commercial")!)
  role = JSON.parse(localStorage.getItem("role")!)
  client_id = Number(JSON.parse(localStorage.getItem("selectedClient")!))
client:any
reversedTarifs: any[] = [];

  public beComponentForm: FormGroup = new FormGroup({
    slct_cntrl: new FormControl("")
  });
  @ViewChild('bottomElement') bottomElement!: ElementRef;


  constructor(private formBuilder: FormBuilder, private articleService: ArticleService,private clientService:ClientService, private route: ActivatedRoute, private cartService: CartService, private wishlistService: WishlistService, private snackBar: MatSnackBar) { }
  ngOnInit() {

    this.scrollToTop()
    this.getProductById(this.route.snapshot.paramMap.get('id'));
    this.getClientById()
    this.tarifForm = this.formBuilder.group({

      ref: ['', Validators.required],
      sref1: ['', Validators.required],
      sref2: ['', Validators.required]

    })
  }
  scrollToBottom(): void {
    this.bottomElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  getProductById(id: any) {
    this.articleService.getArticleById(id).subscribe(
      (res: any) => {
        this.product = res
        this.getTarByRef()
        this.getSrefs1ByRef()
        this.getSrefs2ByRef()
        // this.getTarRemiseByRef()
        if(this.userconnectcomm){
          this.getArticleRemiseByRefByRemcod(this.client?.remcod)
          this.getTarRemiseByRef()

        }
        if(this.userconnect)
        this.getArticleRemiseByRefByRemcod(this.userconnect?.remcod)
        this.getTarRemiseByRef()

      }
    )
  }
  getTarByRef() {
    this.articleService.getTarByRef(this.product.ref).subscribe(
      (res: any) => {
        this.tars = res
      })
  }
  getTarRemiseByRef() {
    this.articleService.getArticleRemiseByRef(this.product.ref).subscribe(
      (res: any) => {
        this.remise = res
      }, (err: any) => {
        this.remise = { rem0001: 0 }
      }
    )
  }

  getSrefs1ByRef() {
    this.articleService.getSref1Ref(this.product.ref).subscribe(

      (res: any) => {

        this.sref1 = res


      })
  }
  
  selectOption(option: any) {
    this.selectedSref1 = option;
  }



  getSrefs2ByRef() {
    this.articleService.getSref2Ref(this.product.ref).subscribe(
      (res: any) => {
        this.sref2 = res
      })

  }
  getClientById(){
    this.clientService.getClientByCliId(this.client_id).subscribe(
      (res:any)=>{
        this.client=res
      }
    )
  }

  getArticleRemiseByRefByRemcod(remcod:any) {

    this.articleService.getArticleRemiseByRefByRemcod(this.product?.ref,remcod).subscribe(
      (res: any) => {
        this.remiseCli = res
      }
      , (err: any) => {
        this.remiseCli = { rem0001: 0 }
      })

  }
 getTarifBySref1Sref2Ref(): void {

  if (!this.selectedSref1) {
    this.selectedSref1 = "";
  }

  if (!this.selectedSref2) {
    this.selectedSref2 = "";
  }

  const ref = this.product.ref;

  // 🔥 récupération du DOS
  const contact = JSON.parse(localStorage.getItem("Contact")!);
  const dos = contact?.dos;

  this.articleService
    .getTarifBySref1Sref2Ref(
      this.selectedSref1,
      this.selectedSref2,
      ref,
      dos
    )
    .subscribe((response: any[]) => {

      this.tarifs = response.filter(
        tar => tar.conf?.trim() === ''
      );

      console.log(this.tarifs);

    });
}
 isCommercialContact(): boolean {
  const contact = JSON.parse(localStorage.getItem("Contact")!);

  if (!contact || !contact.tiers) {
    return false;
  }

  return contact.tiers.trim().startsWith('COM');
}

  addToCart(product: any, prix: number, sref1: any, sref2: any): void {
    if (this.remiseCli?.rem0001 > this.remise?.rem0001) {
      this.cartService.addToCart(product, this.qty, prix - (prix * (this.remiseCli?.rem0001 / 100)), sref1, sref2);
    } else {
      this.cartService.addToCart(product, this.qty, prix - (prix  * (this.remise?.rem0001 / 100)), sref1, sref2);
    }
  }

  addToWishlist(product: any): void {
    this.wishlistService.addToWishlist(product, this.qty);
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

}
