import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AccountClientComponent } from './components/account-client/account-client.component';
import { CartComponent } from './components/cart/cart.component';
import { CategoryComponent } from './components/category/category.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProductDefaultComponent } from './components/product/product-default/product-default.component';
import { ProductExtendedComponent } from './components/product/product-extended/product-extended.component';
import { ShopColumns2Component } from './components/shop/shop-columns2/shop-columns2.component';
import { ShopColumns3Component } from './components/shop/shop-columns3/shop-columns3.component';
import { ShopColumns4Component } from './components/shop/shop-columns4/shop-columns4.component';
import { ShopListComponent } from './components/shop/shop-list/shop-list.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AuthGuard } from './guards/auth.guard';
import { GlobalComponent } from './components/global/global.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { GuestComponent } from './components/guest/guest.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  
  {
    path: 'home', canActivate: [AuthGuard], component: HomeComponent, children: [
      { path: '', component: LayoutComponent },
      { path: 'global', component: GlobalComponent },
      { path: 'shop-list', component: ShopListComponent },
      { path: 'shop-2columns', component: ShopColumns2Component },
      { path: 'shop-3columns', component: ShopColumns3Component },
      { path: 'shop-4columns', component: ShopColumns4Component },
      { path: 'product/:id', component: ProductDefaultComponent },
      { path: 'product-extended', component: ProductExtendedComponent },
      { path: 'cart',  component: CartComponent },
      { path: 'account', component: AccountClientComponent },
      { path: 'wishlist',  component: WishlistComponent },
      /*{ path: 'checkout',  component: CheckoutComponent },*/
      { path: 'category/:category', component: CategoryComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'administration', component: AdministrationComponent },
      { path: 'password-manager', component: PasswordManagerComponent },
      { path: 'guest', component: GuestComponent }


    ]
  },
  { path: '**', component: NotFoundComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
