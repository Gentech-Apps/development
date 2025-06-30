import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplatePreviewDialogComponent } from './email-template-preview-dialog.component';

describe('EmailTemplatePreviewDialogComponent', () => {
  let component: EmailTemplatePreviewDialogComponent;
  let fixture: ComponentFixture<EmailTemplatePreviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailTemplatePreviewDialogComponent],
    });
    fixture = TestBed.createComponent(EmailTemplatePreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
