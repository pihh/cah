import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSideMenuComponent } from './game-side-menu.component';

describe('GameSideMenuComponent', () => {
  let component: GameSideMenuComponent;
  let fixture: ComponentFixture<GameSideMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameSideMenuComponent]
    });
    fixture = TestBed.createComponent(GameSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
