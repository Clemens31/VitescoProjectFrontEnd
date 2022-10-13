import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateArrivalComponent } from './update-arrival.component';

describe('UpdateArrivalComponent', () => {
  let component: UpdateArrivalComponent;
  let fixture: ComponentFixture<UpdateArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateArrivalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
