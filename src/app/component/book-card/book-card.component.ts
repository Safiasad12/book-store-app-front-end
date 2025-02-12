import { Component, Input } from '@angular/core';
import { DataService } from 'src/app/service/data-service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {

  @Input() book: any;

  constructor(private dataService: DataService, private router: Router) {}


  handleClickBook(){
     this.dataService.handleBookId(this.book._id);
     this.router.navigate(['/dashboard/book-details']);
  }



}


