import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpDeleteManagerComponent } from './pop-up-delete-manager.component';

describe('PopUpDeleteManagerComponent', () => {
  let component: PopUpDeleteManagerComponent;
  let fixture: ComponentFixture<PopUpDeleteManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpDeleteManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpDeleteManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
