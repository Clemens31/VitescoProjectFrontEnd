import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateArrivalComponent } from './popup-update-arrival.component';

describe('PopupUpdateArrivalComponent', () => {
  let component: PopupUpdateArrivalComponent;
  let fixture: ComponentFixture<PopupUpdateArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupUpdateArrivalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupUpdateArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
