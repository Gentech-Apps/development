import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationClosedComponent } from './registration-closed.component';

describe('RegistrationClosedComponent', () => {
  let component: RegistrationClosedComponent;
  let fixture: ComponentFixture<RegistrationClosedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationClosedComponent],
    });
    fixture = TestBed.createComponent(RegistrationClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
