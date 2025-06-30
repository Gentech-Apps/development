import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUsersPreviewDialogComponent } from './import-users-preview-dialog.component';

describe('ImportUsersPreviewDialogComponent', () => {
  let component: ImportUsersPreviewDialogComponent;
  let fixture: ComponentFixture<ImportUsersPreviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportUsersPreviewDialogComponent],
    });
    fixture = TestBed.createComponent(ImportUsersPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
