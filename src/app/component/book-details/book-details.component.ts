import { Component } from '@angular/core';
import { BookService } from 'src/app/service/book-service/book.service';
import { DataService } from 'src/app/service/data-service/data.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent {

  bookId: string | null = null;
  name: string = "";
  author: string = "";
  price: number = 0;
  details: string = "";
  image: string = "";
  inCart: boolean = true;

  constructor(private dataService: DataService, private bookService: BookService) { }

  ngOnInit() {
    this.dataService.selectedBookId$.subscribe((id) => {
      this.bookId = id;
    })

    if (this.bookId) {
      this.bookService.fetchBookByIdApiCall(this.bookId).subscribe({
        next: (res: any) => {
          this.name=res.data.bookName;
          this.author=res.data.author;
          this.price=res.data.price;
          this.details=res.data.description;
          this.image=res.data.bookImage;
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }
}
