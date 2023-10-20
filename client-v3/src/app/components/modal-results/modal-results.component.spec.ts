import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResultsComponent } from './modal-results.component';

describe('ModalResultsComponent', () => {
  let component: ModalResultsComponent;
  let fixture: ComponentFixture<ModalResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalResultsComponent]
    });
    fixture = TestBed.createComponent(ModalResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
