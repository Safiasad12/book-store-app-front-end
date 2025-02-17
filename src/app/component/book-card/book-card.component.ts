import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {

  @Input() book: any;

  constructor(private router: Router) {}


  handleClickBook(){
     this.router.navigate(['/dashboard/book-details/', this.book._id]);
  }



}


