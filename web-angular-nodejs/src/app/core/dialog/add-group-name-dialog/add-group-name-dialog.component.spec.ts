import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupNameDialogComponent } from './add-group-name-dialog.component';

describe('AddGroupNameDialogComponent', () => {
  let component: AddGroupNameDialogComponent;
  let fixture: ComponentFixture<AddGroupNameDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddGroupNameDialogComponent],
    });
    fixture = TestBed.createComponent(AddGroupNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
