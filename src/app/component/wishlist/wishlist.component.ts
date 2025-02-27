
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data-service/data.service';
import { WishlistService } from 'src/app/service/wishlist-service/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  
  wishlist: any[] = [];

  constructor(private wishlistService: WishlistService, private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchWishlist();
  }

  fetchWishlist() {
    this.wishlistService.fetchWishListApiCall().subscribe({
      next: (response) => {
        if (response?.data?.books) {
          this.wishlist = response.data.books;  
          this.dataService.updateWishlist(this.wishlist);
          console.log("Wishlist fetched successfully", this.wishlist);
        } else {
          console.error("Unexpected API response structure:", response);
        }
      },
      error: (error) => {
        console.error("Error fetching wishlist", error);
      }
    });
  }

  removeFromWishlist(index: number) {
    const bookId = this.wishlist[index].bookId;

    this.wishlistService.deleteBookFromWishListApiCall(bookId).subscribe({
      next: () => { 
        console.log(`Book removed from wishlist: ${bookId}`);
        
        this.wishlist.splice(index, 1);
      },
      error: (error) => { 
        console.error("Error removing book from wishlist", error);
      }
    });
  }
}

