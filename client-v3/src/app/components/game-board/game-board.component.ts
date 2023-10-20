import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent {
  @Input() question:any = ""
  @Input() submited:any = false
  @Input() n_submissions:any = 0
  @Input() n_players:any = 6

  get n_missing_submissions(){
    return this.n_players-this.n_submissions
  }
}
