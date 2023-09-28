import { Component, EventEmitter, Input, OnInit, Output , ViewChild} from '@angular/core';
import { GameService } from 'src/app/services/game.service';

/* @ts-ignore */
import {gsap,Draggable} from "gsap/all";
import playerHandHelper from './player-hand.helper';
// don't forget to register plugins
gsap.registerPlugin( Draggable);

gsap.defaults({
  ease: "none",
});


@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
})
export class PlayerHandComponent implements OnInit {
  @ViewChild('picker') picker:any;
  @Input() cards: any[] = [];

  canAnswer = true;
  selectedCardIndex: number = 0;
  chosenCardIndex: number = -1;
  answeredCardIndex: number = -1;
  subscription: any;
  cardIndex:any = 4
  constructor(public gameService: GameService) {}
  @Output() onAnswerEvent = new EventEmitter<any>();


  ngOnInit() {
    this.subscription = this.gameService
      .getResetHandEmiter()
      .subscribe(() => this.resetHand());
  }

  ngAfterViewInit() {
    setTimeout(() => {

      playerHandHelper(gsap,Draggable,this.picker.nativeElement,this)

    },500)
  }

  onAnswer(data:any){
    this.onAnswerEvent.emit(data)
  }

  resetHand() {
    console.log('reset hand')
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
    this.discardAnswer()
    if (this.selectedCardIndex > 0) {
      this.selectedCardIndex -= 1;
    } else {
      this.selectedCardIndex = 9;
    }
  }
  nextCard() {
    this.discardAnswer()
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

  confirmAnswer(i:any) {
    if (!this.canAnswer) return;
    if (this.cardIndex !== i) return;
    this.answeredCardIndex = this.cardIndex;
    this.canAnswer = false;
    this.onAnswer(this.answeredCardIndex)
  }
  discardAnswer() {
    if (this.chosenCardIndex == -1) return;
    this.chosenCardIndex = -1;
  }
}
