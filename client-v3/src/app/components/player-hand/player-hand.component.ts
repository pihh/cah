import { Component } from '@angular/core';

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss']
})
export class PlayerHandComponent {
  title = 'cards-against-humanity-angular-tests';


  public cards: any[] = [
    { text: "card" },
    { text: "card" },
    { text: "card" },
    { text: "card" },
    { text: "card" },
    { text: "card" },
    { text: "card" },
    { text: "card" },
    { text: "card" },
    { text: "card" },
  ].map((el: any, id: any) => {
    return { text: el.text + '_' + id, id: id }
  })

  get cardsBackDisplay() {
    try {
      return new Array(this.cards.length - 2).fill(0)
    } catch (ex) {
      return new Array(8).fill(0)
    }
  }
  public onSwipeLeft() {
    console.log('swipe left');
  }

  public onSwipeRight() {
    console.log('swipe right');
  }


  public cardIndex = 0;
  public cardNextIndex = 0

  get cardText() {
    return this.cards[this.cardIndex].text
  }

  setCardNextIndex() {
    let cardNextIndex = this.cardIndex + 1
    cardNextIndex = cardNextIndex % this.cards.length
    if (this.directionPanX < 0) {
      cardNextIndex = this.cardIndex - 1
      if (this.cardIndex == 0) {
        cardNextIndex = this.cards.length - 1
      }
    }

    this.cardNextIndex = cardNextIndex
  }

  get cardNextText() {
    return this.cards[this.cardNextIndex].text
  }

  get isNavigatingClass() {
    return this.isPanNavigating ? 'transitioning' : ''
  }


  get isNavigatingSpeed() {
    if (this.isPanNavigating) {
      return `all ${this.panNavigationTimeout}ms`;
    } else {
      return 'all 0ms';
    }
  }

  public isPanning = false;
  public isPanNavigating = false;
  public isPanReseting = false;
  public panNavigationTimeout = 0;
  public currentPanX = 0;
  public initialPanX = 0;
  public directionPanX = 1;
  public currentPanY = 0;
  public initialPanY = 0;
  public directionPanY = 1;
  public isShakingClass = ""

  get cardTopTransform() {
    try {

      let transform = `translate3d(${this.currentPanX}px,${this.currentPanY}px,0px)`

      if (this.isPanReseting) {
        transform += ' scale(0.9)'
      }
      return transform;
    } catch (ex) {
      return `translate(none)`
    }
  }

  get cardNextTransform() {
    try {

      let transform = `scale(1)`

      if (this.isPanReseting) {
        transform += ' scale(1.05)'
      }
      return transform;
    } catch (ex) {
      return `scale(1)`
    }
  }

  get playerHandCardIndex(){
    if(this.isPanNavigating){
      return this.cardNextIndex
    }else{
      return this.cardIndex
    }
  }

  public onPanStart($event: any) {
    if (this.isPanning || this.isPanNavigating) return;

    this.isPanning = true;
    this.isPanReseting = false;

    this.initialPanX = $event.deltaX
    this.initialPanY = $event.deltaY

    this.currentPanX = 0;
    this.currentPanY = 0;

    this.directionPanX = 0;
    this.directionPanY = 0;
    // console.log('onPanStart',{$event},$event.deltaX)
  }
  public onPan($event: any) {
    if (!this.isPanning || this.isPanNavigating) return;

    this.currentPanX = $event.deltaX - this.initialPanX
    this.currentPanY = $event.deltaY - this.initialPanY

    this.directionPanX = Math.sign(this.currentPanX);
    this.directionPanY = Math.sign(this.currentPanY);

    this.setCardNextIndex()

    if (Math.abs(this.currentPanX) >= 300) {
      this.currentPanX = Math.min(300, Math.max(-300, this.currentPanX))
      if (this.directionPanX == 1 && this.cardIndex == 9 || this.directionPanX == -1 && this.cardIndex == 0) {
        this.isShakingClass = "shaking"
      }
    } else {
      this.isShakingClass = ""
    }
    // console.log('onPan',$event.deltaX, this.currentPanX)
  }

  public onPanEnd($event: any) {
    if (!this.isPanning || this.isPanNavigating) return;

    this.isPanning = false;
    this.isPanNavigating = true;

    this.isShakingClass = ""
    if (Math.abs(this.currentPanX) >= 200) {
      if (this.directionPanX == 1 && this.cardIndex == 9 || this.directionPanX == -1 && this.cardIndex == 0) {
        this.resetCard()
      } else {
        this.navigateCard()
      }
    } else {
      this.resetCard()
    }

  }

  public navigateCard() {

    let timeout = Math.abs(this.currentPanX);
    this.panNavigationTimeout = timeout
    this.currentPanX = 0;
    this.currentPanY = 0;
    this.isPanReseting = true;
    setTimeout(() => {
      this.cardIndex = this.cardNextIndex
      this.setCardNextIndex()
      this.isPanNavigating = false
      this.isPanReseting = false;
      this.panNavigationTimeout = 0
    }, timeout)
  }

  public resetCard() {
    let timeout = Math.abs(this.currentPanX);
    this.isPanReseting = false;
    this.panNavigationTimeout = timeout
    this.currentPanX = 0;
    this.currentPanY = 0;
    setTimeout(() => {
      this.isPanNavigating = false
      this.isPanReseting = false;
      this.panNavigationTimeout = 0
    }, timeout)
  }
}
