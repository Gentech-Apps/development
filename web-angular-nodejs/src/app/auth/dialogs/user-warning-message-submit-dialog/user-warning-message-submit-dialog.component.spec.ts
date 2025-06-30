import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWarningMessageSubmitDialogComponent } from './user-warning-message-submit-dialog.component';

describe('UserWarningMessageSubmitDialogComponent', () => {
  let component: UserWarningMessageSubmitDialogComponent;
  let fixture: ComponentFixture<UserWarningMessageSubmitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserWarningMessageSubmitDialogComponent],
    });
    fixture = TestBed.createComponent(UserWarningMessageSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
