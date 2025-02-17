import { Component } from '@angular/core';
import { BookService } from 'src/app/service/book-service/book.service';

@Component({
  selector: 'app-book-container',
  templateUrl: './book-container.component.html',
  styleUrls: ['./book-container.component.scss']
})
export class BookContainerComponent {

  bookList: any[] = [];
  currentPage: number = 1;
  pageSize: number = 12; 
  totalBooks: number = 0; 
  pagesToShow: (number | string)[] = []; 

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.bookService.fetchAllBooksApiCall(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        console.log(res);
        this.bookList = res.data.books; 
        this.totalBooks = res.data.totalBooks;
        this.updatePagination();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalBooks / this.pageSize);
  }

  updatePagination() {
    let pages: (number | string)[] = [];

    if (this.totalPages <= 7) {
      pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      pages = [1, 2, '...', this.totalPages - 1, this.totalPages];
      
      if (this.currentPage > 3 && this.currentPage < this.totalPages - 2) {
        pages = [1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', this.totalPages];
      }
    }
    this.pagesToShow = pages;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchBooks();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchBooks();
    }
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.fetchBooks();
    }
  }
}
