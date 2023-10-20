import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonVoiceMessageComponent } from './button-voice-message.component';

describe('ButtonVoiceMessageComponent', () => {
  let component: ButtonVoiceMessageComponent;
  let fixture: ComponentFixture<ButtonVoiceMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonVoiceMessageComponent]
    });
    fixture = TestBed.createComponent(ButtonVoiceMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
