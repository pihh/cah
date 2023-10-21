import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { getCardVisibility, getTranslate } from 'src/app/animations/pan';
import { PLAYER } from 'src/app/data/game.data';

/**
 * @TODO
 *
 */

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss']
})
export class PlayerHandComponent {
  @ViewChild("playerHandSlider") playerHandSlider!: ElementRef;
  @Input() handHidden:any = true
  @Input() player:any = PLAYER
  @Input() gameState:any = ""

  public onAnswerPanStart($event:any,i:any){

  }
  public onAnswerPanMove($event:any){}
  public onAnswerPanEnd($event:any){}
  public onAnswerSwipe($event:any){}
  public getAnswerTranslate(i: number) {
    return getTranslate(this, "answer", i);
  }

  public getAnswerVisibility(i: number) {
    return getCardVisibility(this, 'answer', i)
  }
}
