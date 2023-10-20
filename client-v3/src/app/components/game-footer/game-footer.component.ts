import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-footer',
  templateUrl: './game-footer.component.html',
  styleUrls: ['./game-footer.component.scss']
})
export class GameFooterComponent {
   @Input() isVotePageLeaving: boolean = false;
   @Input() question: string = "";
}
