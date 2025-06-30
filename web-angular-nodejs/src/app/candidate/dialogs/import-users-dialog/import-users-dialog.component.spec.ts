import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUsersDialogComponent } from './import-users-dialog.component';

describe('ImportUsersDialogComponent', () => {
  let component: ImportUsersDialogComponent;
  let fixture: ComponentFixture<ImportUsersDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportUsersDialogComponent],
    });
    fixture = TestBed.createComponent(ImportUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
