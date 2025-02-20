import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { BookContainerComponent } from './component/book-container/book-container.component';
import { BookDetailsComponent } from './component/book-details/book-details.component';
import { CartComponent } from './component/cart/cart.component';
import { WishlistComponent } from './component/wishlist/wishlist.component';
import { LoginComponent } from './component/login/login.component';


const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },

  { 
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'books',
        component: BookContainerComponent
      },
      {
        path: 'book-details/:id',
        component: BookDetailsComponent
      },
      {
        path: 'cart',
        component: CartComponent
      },
      {
        path: 'wishlist',
        component: WishlistComponent
      }
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
