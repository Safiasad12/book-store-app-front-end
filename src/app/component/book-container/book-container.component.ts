import { Component } from '@angular/core';
import { BookService } from 'src/app/service/book-service/book.service';

@Component({
  selector: 'app-book-container',
  templateUrl: './book-container.component.html',
  styleUrls: ['./book-container.component.scss']
})
export class BookContainerComponent {


  bookList: any[] = [];

  // books = [
  //   { title: 'Book 1', author: 'Author 1' },
  //   { title: 'Book 2', author: 'Author 2' },
  //   { title: 'Book 3', author: 'Author 3' },
  //   { title: 'Book 1', author: 'Author 1' },
  //   { title: 'Book 2', author: 'Author 2' },
  //   { title: 'Book 3', author: 'Author 3' },
  //   { title: 'Book 1', author: 'Author 1' },
  //   { title: 'Book 2', author: 'Author 2' },
  //   { title: 'Book 3', author: 'Author 3' },
  //   { title: 'Book 1', author: 'Author 1' },
  //   { title: 'Book 2', author: 'Author 2' },
  //   { title: 'Book 3', author: 'Author 3' },
  // ];

  constructor(private bookService: BookService) { }

  ngOnInit() {  
    this.bookService.fetchAllBooksApiCall().subscribe({
      next: (res: any) => {
        console.log(res);
        this.bookList=res.data.books;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}

