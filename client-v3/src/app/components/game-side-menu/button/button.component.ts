import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-side-menu-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() isSideMenuOpen:boolean = false;
  @Output() onToggleSideMenuEvent:any = new EventEmitter();
  public toggleSideMenu(){
    this.onToggleSideMenuEvent.emit()
  }
}
