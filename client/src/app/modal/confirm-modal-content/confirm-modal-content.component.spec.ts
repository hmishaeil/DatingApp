import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalContentComponent } from './confirm-modal-content.component';

describe('ConfirmModalContentComponent', () => {
  let component: ConfirmModalContentComponent;
  let fixture: ComponentFixture<ConfirmModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmModalContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
