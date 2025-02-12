import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { BookCardComponent } from './component/book-card/book-card.component';
import { BookContainerComponent } from './component/book-container/book-container.component';
import { BookDetailsComponent } from './component/book-details/book-details.component';
import { CartComponent } from './component/cart/cart.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BookCardComponent,
    BookContainerComponent,
    BookDetailsComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
