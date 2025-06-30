import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivePreviewDialogComponent } from './drive-preview-dialog.component';

describe('DrivePreviewDialogComponent', () => {
  let component: DrivePreviewDialogComponent;
  let fixture: ComponentFixture<DrivePreviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrivePreviewDialogComponent],
    });
    fixture = TestBed.createComponent(DrivePreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
