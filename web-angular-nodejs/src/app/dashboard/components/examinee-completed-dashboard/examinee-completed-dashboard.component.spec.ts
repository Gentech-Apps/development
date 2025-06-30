import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineeCompletedDashboardComponent } from './examinee-completed-dashboard.component';

describe('ExamineeCompletedDashboardComponent', () => {
  let component: ExamineeCompletedDashboardComponent;
  let fixture: ComponentFixture<ExamineeCompletedDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamineeCompletedDashboardComponent],
    });
    fixture = TestBed.createComponent(ExamineeCompletedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
