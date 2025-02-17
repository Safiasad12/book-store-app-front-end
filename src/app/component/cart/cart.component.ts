import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data-service/data.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems:any[] = [];
  homeIsEditing: boolean = false;
  workIsEditing: boolean = false;
  homeAddress: string = "BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore";
  workAddress: string = "BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore";

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

  // customer = {
  //   fullName: 'Safi Siddiqui',
  //   mobileNumber: '6232665729',
  //   addresses: {
  //     {
  //       type: 'HOME',
  //       details: 'BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore'
  //     },
  //     {
  //       type: 'WORK',
  //       details: 'BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore',
  //       city: 'Bengaluru',
  //       state: 'Karnataka'
  //     },
  //   }
  // };

  toggleEdit(action:string) {
    // event.preventDefault(); // Prevent default anchor behavior
    if(action==='home'){
      this.homeIsEditing = !this.homeIsEditing;
    }
    if(action==='work'){
      this.workIsEditing = !this.workIsEditing;
    }
   
  }
  
}
