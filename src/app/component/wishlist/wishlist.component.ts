import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  
  wishlist: any[] = [
    {
      id: '1',
      title: "Don't Make Me Think",
      author: "Steve Krug",
      price: 1500,
      originalPrice: 2000,
      image: "assets/dont-make-me-think.jpg" // Replace with actual image URL
    },
    {
      id: '2',
      title: "React Material-UI",
      author: "Cookbook",
      price: 780,
      originalPrice: 1000,
      image: "assets/react-material-ui.jpg" // Replace with actual image URL
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  removeFromWishlist(bookId: string) {
    this.wishlist = this.wishlist.filter(book => book.id !== bookId);
  }
}
