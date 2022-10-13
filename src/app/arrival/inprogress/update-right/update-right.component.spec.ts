import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRightComponent } from './update-right.component';

describe('UpdateRightComponent', () => {
  let component: UpdateRightComponent;
  let fixture: ComponentFixture<UpdateRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
