import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalControlsComponent } from './modal-controls.component';

describe('ModalControlsComponent', () => {
  let component: ModalControlsComponent;
  let fixture: ComponentFixture<ModalControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalControlsComponent]
    });
    fixture = TestBed.createComponent(ModalControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
