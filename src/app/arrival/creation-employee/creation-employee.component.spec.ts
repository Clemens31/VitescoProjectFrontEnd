import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationEmployeeComponent } from './creation-employee.component';

describe('CreationEmployeeComponent', () => {
  let component: CreationEmployeeComponent;
  let fixture: ComponentFixture<CreationEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
