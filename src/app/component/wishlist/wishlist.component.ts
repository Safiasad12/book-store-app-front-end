import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data-service/data.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  
  wishlist: any[] = []

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.wishlist$.subscribe(items => {
      this.wishlist = items;
    });
  }

  removeFromWishlist(index: number) {
    this.dataService.removeFromWishlist(this.wishlist[index]._id);
  }
}
