import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ShopListComponent } from './components/shop/shop-list/shop-list.component';
import { ShopColumns2Component } from './components/shop/shop-columns2/shop-columns2.component';
import { ShopColumns3Component } from './components/shop/shop-columns3/shop-columns3.component';
import { ShopColumns4Component } from './components/shop/shop-columns4/shop-columns4.component';
import { ProductDefaultComponent } from './components/product/product-default/product-default.component';
import { ProductExtendedComponent } from './components/product/product-extended/product-extended.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';
import { AccountClientComponent } from './components/account-client/account-client.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductPipe } from './pipes/product.pipe';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SrefPipe } from './pipes/sref.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ProduitPipe } from './pipes/produit.pipe';
import { GlobalComponent } from './components/global/global.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { GuestComponent } from './components/guest/guest.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    ShopListComponent,
    ShopColumns2Component,
    ShopColumns3Component,
    ShopColumns4Component,
    ProductDefaultComponent,
    ProductExtendedComponent,
    WishlistComponent,
    CartComponent,
    AccountClientComponent,
    CheckoutComponent,
    ContactUsComponent,
    AboutUsComponent,
    LoginComponent,
    RegisterComponent,
    ProductPipe,
    NotFoundComponent,
    SrefPipe,
    ProduitPipe,
    GlobalComponent,
    AdministrationComponent,
    PasswordManagerComponent,
    GuestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
