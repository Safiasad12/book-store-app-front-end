import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { BookContainerComponent } from './component/book-container/book-container.component';
import { BookDetailsComponent } from './component/book-details/book-details.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'books',
        component: BookContainerComponent
      },
      {
        path: 'book-details',
        component: BookDetailsComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
