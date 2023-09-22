import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
})
export class PlayerHandComponent implements OnInit {

  @Input() cards: any[] = [];

  canAnswer = true;
  selectedCardIndex: number = 0;
  chosenCardIndex: number = -1;
  answeredCardIndex: number = -1;
  subscription: any;

  constructor(public gameService: GameService) {}
  @Output() onAnswerEvent = new EventEmitter<any>();
  ngOnInit() {
    this.subscription = this.gameService
      .getResetHandEmiter()
      .subscribe(() => this.resetHand());
  }

  onAnswer(data:any){
    this.onAnswerEvent.emit(data)
  }

  resetHand() {
    this.selectedCardIndex = 0;
    this.canAnswer = true;
    this.selectedCardIndex = 0;
    this.chosenCardIndex = -1;
    this.answeredCardIndex = -1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  get prevCardIndex(): number {
    if (this.selectedCardIndex > 0) {
      return this.selectedCardIndex - 1;
    } else {
      return 9;
    }
  }

  get nextCardIndex(): number {
    if (this.selectedCardIndex < 9) {
      return this.selectedCardIndex + 1;
    } else {
      return 0;
    }
  }

  get prevPrevCardIndex() {
    if (this.prevCardIndex > 0) {
      return this.prevCardIndex - 1;
    } else {
      return 9;
    }
  }

  get nextNextCardIndex(): number {
    if (this.nextCardIndex < 9) {
      return this.nextCardIndex + 1;
    } else {
      return 0;
    }
  }

  prevCard() {
    if (this.selectedCardIndex > 0) {
      this.selectedCardIndex -= 1;
    } else {
      this.selectedCardIndex = 9;
    }
  }
  nextCard() {
    if (this.selectedCardIndex < 9) {
      this.selectedCardIndex += 1;
    } else {
      this.selectedCardIndex = 0;
    }
  }

  selectCard() {
    if (!this.canAnswer) return;
    this.chosenCardIndex = this.selectedCardIndex;
  }

  confirmAnswer() {
    if (!this.canAnswer) return;
    if (this.chosenCardIndex == -1) return;
    this.answeredCardIndex = this.chosenCardIndex;
    this.canAnswer = false;
    this.onAnswer(this.answeredCardIndex)
  }
  discardAnswer() {
    if (this.chosenCardIndex == -1) return;
    this.chosenCardIndex = -1;
  }
}
