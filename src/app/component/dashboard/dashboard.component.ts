import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


  constructor(private router: Router) {}

  handleDashBoardBtnClick(action: string){
    if(action==="cart"){
      this.router.navigate(['/dashboard/cart']);
    }
    if(action==="book"){
      this.router.navigate(['/dashboard/books']);
    } 
  }

  handleLogOutBtnClick(){
    localStorage.clear();
    this.router.navigate(['']);
  }
}
