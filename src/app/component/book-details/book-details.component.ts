import { Component } from '@angular/core';
import { BookService } from 'src/app/service/book-service/book.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data-service/data.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent {
  
  book: any = {};
  bookId: string | null = null;
  name: string = "";
  author: string = "";
  price: number = 0;
  details: string = "";
  image: string = "";
  quantity: number = 1;
  inWishlist: boolean = false;
  outOfStock: boolean = false;

  constructor(
    private bookService: BookService, 
    private route: ActivatedRoute, 
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id');
    });

    if (this.bookId) {
      this.bookService.fetchBookByIdApiCall(this.bookId).subscribe({
        next: (res: any) => {
          this.name = res.data.bookName;
          this.author = res.data.author;
          this.price = res.data.price;
          this.details = res.data.description;
          this.image = res.data.bookImage;
          this.outOfStock = res.data.quantity === 0;
          this.book = res.data;
          this.quantity = res.data.quantity;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  addToCart() {
    this.dataService.addToCart(this.book);    
  }

  addToWishlist() {
    this.inWishlist = true;
    this.dataService.addToWishlist(this.book);
  }

  inCart(): boolean {
    if (!this.bookId) return false;
    return this.dataService.getCartItems().some((item: any) => item._id === this.bookId);
  }

  getCartQuantity(): number {
    if (!this.bookId) return 0;
    const bookInCart = this.dataService.getCartItems().find((item: any) => item._id === this.bookId);
    return bookInCart ? bookInCart.quantity : 0;
  }

  updateQuantity(change: number) {
    if (this.bookId) {
      this.dataService.updateQuantity(this.bookId, change);
    }
  }
}
