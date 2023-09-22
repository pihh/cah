import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHandComponent } from './player-hand.component';

describe('PlayerHandComponent', () => {
  let component: PlayerHandComponent;
  let fixture: ComponentFixture<PlayerHandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerHandComponent]
    });
    fixture = TestBed.createComponent(PlayerHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
