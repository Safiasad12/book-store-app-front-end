import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { DataService } from 'src/app/service/data-service/data.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/service/cart-service/cart.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CustomerDetailsService } from 'src/app/service/customer-details-service/customer-details.service';

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
  showCustomerDetails: boolean = false;
  showOrderSummary: boolean = false;
  private unsubscribe$ = new Subject<void>();

  homeAddress: string = "BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore";
  workAddress: string = "BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore";

  newAddress = {
    address: '',
    city: '',
    state: '',
    type: '',
  };

  existingAddress = {
    addressId: '',
    address: '',
    city: '',
    state: '',
    type: '',
  };

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cartService: CartService,
    private customerDetailsService: CustomerDetailsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataService.cartItems$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(cartItems => {
        this.cartItems = cartItems;
        this.cdRef.detectChanges();  
      });

    this.loadSavedAddresses();  
    this.fetchCartFromBackend();
  }

  fetchCartFromBackend() {
    this.cartService.fetchCartListApiCall().subscribe({
      next: (cartRes) => {
        this.dataService.setCartFromBackend(cartRes.data?.books || []);
      },
      error: (err) => {
        console.error('Failed to fetch cart:', err);
      }
    });
  }

  updateQuantity(index: number, change: number) {
    const bookId = this.cartItems[index].bookId;
  
    if (bookId !== null) { 
      if (this.authService.isLoggedIn()) {
        this.cartService.updateBookQuantityApiCall(bookId, change).subscribe({
          next: (res: any) => {
            console.log("Quantity updated successfully:", res);
            this.dataService.updateQuantity(bookId, change); 
            this.cdRef.detectChanges();
          },
          error: (err) => console.error("Error updating quantity:", err)
        });
  
      } else {
        this.dataService.updateQuantity(bookId, change);
        this.cdRef.detectChanges();
      }
    } else {
      console.error("Error: bookId is null, cannot update quantity.");
    }
  }
  

  removeItem(index: number) {
    const bookId = this.cartItems[index].bookId;

    if (this.authService.isLoggedIn()) {  
      this.cartService.deleteCartItemApiCall(bookId).subscribe({
        next: () => {
          this.dataService.removeFromCart(bookId);
          this.cdRef.detectChanges(); 
        },
        error: (error: any) => {
          console.error('Error removing item:', error);
        }
      });
    } else {
      this.dataService.removeFromCart(bookId);
      this.cdRef.detectChanges(); 
    }
  }


  toggleEdit(index: number) {
    if (this.isEditing[index]) { 
      this.updateAddress(this.savedAddresses[index]);
    }
    this.isEditing[index] = !this.isEditing[index]; 
  }
  

  toggleAddNewAddress() {
    this.addingNewAddress = !this.addingNewAddress;
  }

  saveNewAddress() {
    if (this.newAddress.address.trim() !== '') {
      this.customerDetailsService.addNewAddress(this.newAddress).subscribe({
        next: (response) => {
          console.log('Address added successfully:', response);
  
          this.savedAddresses.push({ ...this.newAddress });
          this.isEditing.push(false);
          this.saveAddressesToLocalStorage(); 
  
          this.newAddress = { address: '', city: '', state: '', type: '' };
          this.addingNewAddress = false;
        },
        error: (err) => {
          console.error('Failed to add address:', err);
        }
      });
    }
  }


  updateAddress(address: any) {
    console.log(this.savedAddresses);
    if (!address._id) {
      console.error("Error: Address ID missing!");
      return;
    }
  
    this.customerDetailsService.updateAddress(address).subscribe({
      next: (response) => {
        console.log('Address updated successfully:', response);
        
        const index = this.savedAddresses.findIndex(addr => addr.addressId === address.addressId);
        if (index !== -1) {
          this.savedAddresses[index] = { ...address };
        }
  
        this.saveAddressesToLocalStorage();
      },
      error: (err) => {
        console.error('Failed to update address:', err);
      }
    });
  }
  
  
  

  placeOrder() {
    if (!this.authService.isLoggedIn()) {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '750px',
        disableClose: true,
      });

      dialogRef.componentInstance.loginSuccess.subscribe(() => {
        this.updateCartAfterLogin();
        this.showCustomerDetails = true;
        
      });

    } else {
      console.log("Fetching customer details...");
      
      this.customerDetailsService.getCustomerDetails().subscribe({
        next: (res) => {
          console.log("Customer details fetched successfully:", res);
  
          if (res.address && res.address.length > 0) {
            this.savedAddresses = res.address;
            this.saveAddressesToLocalStorage();  
          }
  
          this.showCustomerDetails = true;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          console.error("Failed to fetch customer details:", error);
        }
      });
    }
  }

  updateCartAfterLogin() {
    this.fetchCartFromBackend();
  }


  private loadSavedAddresses() {
    const saved = localStorage.getItem('savedAddresses');
    this.savedAddresses = saved ? JSON.parse(saved) : [];
  }


  private saveAddressesToLocalStorage() {
    localStorage.setItem('savedAddresses', JSON.stringify(this.savedAddresses));
  }


  confirmAddress() {
    this.showOrderSummary = true;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}