import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-header',
  templateUrl: './game-header.component.html',
  styleUrls: ['./game-header.component.scss']
})
export class GameHeaderComponent {
  @Input() isAnswerSelected:any = false
  @Input() isVoteSelected:any = false
  @Input() isSideMenuOpen:any = false
  @Input() pageMessage:any = "playerName"
  @Input() headerMessage:any = 0
  @Input() roundTime:any = "0:00"
  @Input() playerName:any = 0
  @Input() score:any = 0
  @Input() round:any = 1
  @Output() onToggleSideMenuEvent:any = new EventEmitter<any>()


  public toggleSideMenu(){
    this.onToggleSideMenuEvent.emit()
    //this.isSideMenuOpen = !this.isSideMenuOpen
  }
}
