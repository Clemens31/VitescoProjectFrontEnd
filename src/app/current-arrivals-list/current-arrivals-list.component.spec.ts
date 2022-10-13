import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentArrivalsListComponent } from './current-arrivals-list.component';

describe('CurrentArrivalsListComponent', () => {
  let component: CurrentArrivalsListComponent;
  let fixture: ComponentFixture<CurrentArrivalsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentArrivalsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentArrivalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
