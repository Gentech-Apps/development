import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineeDashboardComponent } from './examinee-dashboard.component';

describe('ExamineeDashboardComponent', () => {
  let component: ExamineeDashboardComponent;
  let fixture: ComponentFixture<ExamineeDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamineeDashboardComponent],
    });
    fixture = TestBed.createComponent(ExamineeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
