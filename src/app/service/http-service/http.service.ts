import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

 
  getApiCall(url: string, header: any = {}){
    return this.httpClient.get(url, {headers: header})
  }
}
