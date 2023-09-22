import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardQuestionComponent } from './board-question.component';

describe('BoardQuestionComponent', () => {
  let component: BoardQuestionComponent;
  let fixture: ComponentFixture<BoardQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardQuestionComponent]
    });
    fixture = TestBed.createComponent(BoardQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
