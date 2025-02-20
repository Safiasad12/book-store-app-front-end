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

    book: any ={}
    bookId: string | null = null;
    name: string = "";
    author: string = "";
    price: number = 0;
    details: string = "";
    image: string = "";
    quantity: number = 1;
    inCart: boolean = false;
    inWishlist: boolean = false;
    outOfStock: boolean = false;
    
    constructor(private bookService: BookService, private route: ActivatedRoute, private dataService: DataService) {}

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
            this.quantity=res.quantity
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    }

    addToCart() {
      this.inCart = true;
      this.dataService.addToCart(this.book);    
    }

    addToWishlist(){
      this.inWishlist = true;
      this.dataService.addToWishlist(this.book);
    }
  }
