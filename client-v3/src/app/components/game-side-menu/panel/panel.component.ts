import { Component, Input } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-side-menu-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {

  constructor(public gameService: GameService) {
    console.log(this.gameService)
  }
  @Input() isSideMenuOpen: boolean = false;

  get username() {
    try {
      return this.gameService.username;
    } catch (ex) {
      return ""
    }
  }
  get id() {
    try {
      return this.gameService.connection;
    } catch (ex) {
      return ""
    }
  }
  get score() {
    try {
      return this.gameService.score;
    } catch (ex) {
      return "Not found"
    }
  }
  get onlinePlayers() {
    try {
      return this.gameService.game.players
    } catch (e) {
      return []
    }
  }

  get gameHistory() {
    try {
      return this.gameService.game.history
    } catch (e) {
      return []
    }
  }

  public getGameResult(i: any) {
    try {
      if (this.gameHistory[i].result.state === "failed") {
        return "red"
      } else if (this.gameHistory[i].result.state === "winner") {
        return "green"
      } else {
        return "transparent"
      }
    } catch (ex) {
      return "transparent"
    }
  }
}
