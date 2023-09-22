import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-board-question',
  templateUrl: './board-question.component.html',
  styleUrls: ['./board-question.component.scss']
})
export class BoardQuestionComponent {
  @Input() question = "What is a must-have at a children's party?"
  @Input() totalAnswers = 0
  @Input() totalPlayers = 6
}
