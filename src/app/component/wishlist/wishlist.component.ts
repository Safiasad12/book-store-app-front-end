
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/service/data-service/data.service';
import { WishlistService } from 'src/app/service/wishlist-service/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  wishlist: any[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private wishlistService: WishlistService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.dataService.wishlist$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(wishlist => {
        this.wishlist = wishlist;
        this.cdRef.detectChanges();
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

