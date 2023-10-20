import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHandV2Component } from './player-hand-v2.component';

describe('PlayerHandV2Component', () => {
  let component: PlayerHandV2Component;
  let fixture: ComponentFixture<PlayerHandV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerHandV2Component]
    });
    fixture = TestBed.createComponent(PlayerHandV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
