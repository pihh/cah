import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSplashComponent } from './modal-splash.component';

describe('ModalSplashComponent', () => {
  let component: ModalSplashComponent;
  let fixture: ComponentFixture<ModalSplashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSplashComponent]
    });
    fixture = TestBed.createComponent(ModalSplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
