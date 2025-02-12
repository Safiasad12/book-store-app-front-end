import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private selectedBookId = new BehaviorSubject<string | null>(null);
  selectedBookId$ = this.selectedBookId.asObservable();

  handleBookId(bookId: string) {
    this.selectedBookId.next(bookId);
  }
}
