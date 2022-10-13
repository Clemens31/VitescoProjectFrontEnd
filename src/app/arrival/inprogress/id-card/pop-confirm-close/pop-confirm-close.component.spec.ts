import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopConfirmCloseComponent } from './pop-confirm-close.component';

describe('PopConfirmCloseComponent', () => {
  let component: PopConfirmCloseComponent;
  let fixture: ComponentFixture<PopConfirmCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopConfirmCloseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopConfirmCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
