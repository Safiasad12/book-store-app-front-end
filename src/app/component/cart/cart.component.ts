import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data-service/data.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems:any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
    this.dataService.updateCart(this.cartItems);
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.dataService.updateCart(this.cartItems);
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.dataService.updateCart(this.cartItems);
  }

  customer = {
    fullName: 'Poonam Yadav',
    mobileNumber: '81678954778',
    addresses: [
      {
        type: 'WORK',
        details: 'BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore',
        city: 'Bengaluru',
        state: 'Karnataka'
      },
      {
        type: 'HOME',
        details: 'BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore'
      }
    ]
  };
  
}
