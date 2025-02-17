import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private httpService: HttpService) { }


  fetchAllBooksApiCall(page: number, pageSize: number){
    return this.httpService.getApiCall(`http://localhost:3000/api/v1/book?page=${page}&limit=${pageSize}`)
  }

  fetchBookByIdApiCall(bookId: string){
    return this.httpService.getApiCall("http://localhost:3000/api/v1/book/"+bookId)
  }

}


