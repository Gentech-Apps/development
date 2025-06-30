import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailTemplateDialogComponent } from './add-email-template-dialog.component';

describe('AddEmailTemplateDialogComponent', () => {
  let component: AddEmailTemplateDialogComponent;
  let fixture: ComponentFixture<AddEmailTemplateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmailTemplateDialogComponent],
    });
    fixture = TestBed.createComponent(AddEmailTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
