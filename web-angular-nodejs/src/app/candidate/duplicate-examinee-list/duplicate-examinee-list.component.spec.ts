import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateExamineeListComponent } from './duplicate-examinee-list.component';

describe('DuplicateExamineeListComponent', () => {
  let component: DuplicateExamineeListComponent;
  let fixture: ComponentFixture<DuplicateExamineeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DuplicateExamineeListComponent],
    });
    fixture = TestBed.createComponent(DuplicateExamineeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
