import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { DataService } from 'src/app/service/data-service/data.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/service/cart-service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: any[] = [];
  isEditing: boolean[] = [];
  savedAddresses: any[] = [];
  addingNewAddress: boolean = false;
  homeAddress: string = "BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore";
  workAddress: string = "BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore";
  newAddress = {
    address: '',
    city: '',
    state: '',
    type: '',
  };

  constructor(private dataService: DataService, private authService: AuthService, private dialog: MatDialog, private cartService: CartService) { }

  ngOnInit() {
    this.cartItems = this.dataService.getCartItems(); 
  
    this.cartService.fetchCartListApiCall().subscribe({
      next: (cartRes) => {
        this.cartItems = cartRes.data?.books || [];
        this.dataService.updateCart(this.cartItems); 
      },
      error: (err) => {
        console.error('Failed to fetch cart:', err);
      }
    });
  }

  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
    this.dataService.updateCart(this.cartItems);
    this.cartItems = [...this.cartItems]; 
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.dataService.updateCart(this.cartItems);
      this.cartItems = [...this.cartItems]; 
    }
  }

  removeItem(index: number) {
    this.dataService.removeFromCart(this.cartItems[index]._id);
    this.cartItems = this.cartItems.filter((_, i) => i !== index); 
  }

  toggleEdit(index: number) {
    if (this.isEditing[index] === undefined) {
      this.isEditing[index] = false;
    }
    this.isEditing[index] = !this.isEditing[index];
  }

  toggleAddNewAddress() {
    this.addingNewAddress = !this.addingNewAddress;
  }

  saveNewAddress() {
    if (this.newAddress.address.trim() !== '') {
      this.savedAddresses.push({ ...this.newAddress });
      this.isEditing.push(false);
      this.newAddress.address = '';
      this.addingNewAddress = false;
    }
  }

  placeOrder() {
    if (!this.authService.isLoggedIn()) {
      this.dialog.open(LoginComponent, {
        width: '750px',
        disableClose: true,
      });
    } else {
      console.log("Order placed successfully!");
      localStorage.removeItem('cartItems'); 
      this.dataService.updateCart([]); 
    }
  }
}
