import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAnswersComponent } from './board-answers.component';

describe('BoardAnswersComponent', () => {
  let component: BoardAnswersComponent;
  let fixture: ComponentFixture<BoardAnswersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardAnswersComponent]
    });
    fixture = TestBed.createComponent(BoardAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
