import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookContainerComponent } from './book-container.component';

describe('BookContainerComponent', () => {
  let component: BookContainerComponent;
  let fixture: ComponentFixture<BookContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookContainerComponent]
    });
    fixture = TestBed.createComponent(BookContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
