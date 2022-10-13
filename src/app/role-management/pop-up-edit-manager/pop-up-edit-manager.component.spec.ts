import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpEditManagerComponent } from './pop-up-edit-manager.component';

describe('PopUpEditManagerComponent', () => {
  let component: PopUpEditManagerComponent;
  let fixture: ComponentFixture<PopUpEditManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpEditManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpEditManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
