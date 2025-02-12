import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private httpService: HttpService) { }


  fetchAllBooksApiCall(){
    return this.httpService.getApiCall("http://localhost:3000/api/v1/book/")
  }

  fetchBookByIdApiCall(bookId: string){
    return this.httpService.getApiCall("http://localhost:3000/api/v1/book/"+bookId)
  }

}


