import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-header',
  templateUrl: './game-header.component.html',
  styleUrls: ['./game-header.component.scss']
})
export class GameHeaderComponent {
  @Input() isAnswerSelected:any = false
  @Input() isVoteSelected:any = false
  @Input() pageMessage:any = "playerName"
  @Input() headerMessage:any = 0
  @Input() roundTime:any = "0:00"
  @Input() playerName:any = 0
  @Input() score:any = 0
  @Input() round:any = 1
}
