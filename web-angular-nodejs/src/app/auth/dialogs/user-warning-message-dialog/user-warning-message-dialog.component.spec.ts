import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWarningMessageDialogComponent } from './user-warning-message-dialog.component';

describe('UserWarningMessageDialogComponent', () => {
  let component: UserWarningMessageDialogComponent;
  let fixture: ComponentFixture<UserWarningMessageDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserWarningMessageDialogComponent],
    });
    fixture = TestBed.createComponent(UserWarningMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
