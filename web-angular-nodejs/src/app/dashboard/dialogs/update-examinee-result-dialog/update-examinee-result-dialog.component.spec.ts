import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExamineeResultDialogComponent } from './update-examinee-result-dialog.component';

describe('UpdateExamineeResultDialogComponent', () => {
  let component: UpdateExamineeResultDialogComponent;
  let fixture: ComponentFixture<UpdateExamineeResultDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateExamineeResultDialogComponent],
    });
    fixture = TestBed.createComponent(UpdateExamineeResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
