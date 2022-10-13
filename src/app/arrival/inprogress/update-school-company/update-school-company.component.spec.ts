import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSchoolCompanyComponent } from './update-school-company.component';

describe('UpdateSchoolCompanyComponent', () => {
  let component: UpdateSchoolCompanyComponent;
  let fixture: ComponentFixture<UpdateSchoolCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSchoolCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSchoolCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
