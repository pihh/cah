import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-player-hand-v2',
  templateUrl: './player-hand-v2.component.html',
  styleUrls: ['./player-hand-v2.component.scss']
})
export class PlayerHandV2Component {

  @Input() hand: any[] = []
  @Input() canAnswer: boolean = true;
  @Input() selectedCardIndex: number = -1;
  @Output() onSelectionChange = new EventEmitter();
  @Output() onAnswer = new EventEmitter();

  get cards() {
    let cards: any[] = []
    try {
      cards = this.hand.slice(0, 10)
    } catch (e) {

      cards = Array(10).fill({}).map((el: any, id: any) => {
        return { text: "Card_" + id, id: id }
      })
    }

    return cards;
  }

  public cardsTimeline: any[] = new Array(10).fill({}).map((el: any, id: any) => {

    // return {
    //   translateX: -800 + id* 175,
    //   translateY: 5*Math.pow(Math.abs(4-id),2),//5*Math.pow(id,2) ,
    //   rotateZ: id-4
    // }
    return {
      translateX: id * 200,
      translateY: 4 * id,//5*Math.pow(id+1,2),
      rotateZ: id
    }

  })


  public getCardTimelineTransform(index: any) {
    let transform = "none"


    const totalTranslateX = 2000;


    const totalRotateZ = 10
    const totalDistancePercentageX = this.totalDistancePercentageX

    const indexDist = Math.pow(Math.abs(index - totalDistancePercentageX * 10) * 4, 1.35)

    const translateX = this.cardsTimeline[index].translateX - totalDistancePercentageX * totalTranslateX
    // const translateY = Math.abs(this.cardsTimeline[index].translateY - ( totalDistancePercentageX* 10*4))
    const translateY = indexDist
    const rotateZ = this.cardsTimeline[index].rotateZ - totalDistancePercentageX * totalRotateZ
    transform = `translate3d(${translateX}px, ${translateY}px, 0px) rotateZ(${rotateZ}deg)`

    if (this.direction == "y" && Math.round(this.totalDistancePercentageX * 10) == index) {
      // console.log(this.direction ,this.isSelectingCard,  Math.round(this.totalDistancePercentageX * 10), index,translateY,this.distanceY)
      const scalePercentage = Math.max(0, Math.min(100, this.distanceY)) / 250 // 0 -> 250 //Math.min(this.distanceY)
      let scale = 1 + scalePercentage * 0.4
      let totalTranslateY = Math.max(-300, Math.min(translateY - this.distanceY, 0))
      if (!this.isSelectingCard) {
        transform = `translate3d(${translateX}px, ${totalTranslateY}px, 0px) rotateZ(${rotateZ}deg) scale(${scale})`
      } else {
        if (this.isEnteringCard) {

          totalTranslateY = 600
          scale = 1
        } else {
          totalTranslateY += - window.innerHeight - 300;
          scale = 1.4


        }

        transform = `translate3d(${translateX}px, ${totalTranslateY}px, 0px) rotateZ(${rotateZ}deg) scale(${scale})`
      }
      if (totalTranslateY <= -100 && !this.isCardSelected && !this.isSelectingCard) {
        this.onCardSelectionChangeEmit(true);
      }
      if (this.isCardSelected && totalTranslateY > -100 && !this.isSelectingCard) {
        this.onCardSelectionChangeEmit(false);
      }
    }
    if (this.direction == "y" && Math.round(this.totalDistancePercentageX * 10) == index - 1) {
      transform = `translate3d(${translateX + Math.min(40, this.distanceY / 10)}px, ${translateY}px, 0px) rotateZ(${rotateZ}deg)`
    }
    if (this.direction == "y" && Math.round(this.totalDistancePercentageX * 10) == index + 1) {
      transform = `translate3d(${translateX - Math.min(40, this.distanceY / 10)}px, ${translateY}px, 0px) rotateZ(${rotateZ}deg)`
    }

    return transform
  }

  public onTransitioning(index: any) {
    if (this.direction == "y" && Math.round(this.totalDistancePercentageX * 10) == index) {
      // console.log(this.direction ,this.isSelectingCard,  Math.round(this.totalDistancePercentageX * 10), index,translateY,this.distanceY)

      if (this.isSelectingCard) {

        if (this.isEnteringCard) {
          return true
        }
        return false;

      }
      return false;
    }
    return false;
  }

  public onCardSelectionChangeEmit(state: boolean = false) {
    this.isCardSelected = state
    this.onSelectionChange.emit(this.isCardSelected)
  }
  public onSelectCard(index: any) {
    console.log(index)
  }


  public isPanning = false;
  public distanceX = 0;
  public distanceY = 0;
  public totalDistanceX = 2000;
  public lastPanX = 0;
  public lastPanY = 0;
  public sessionDistanceX = 0;
  public direction = "";
  public firstMovement = false;
  public isCardSelected = false;


  get clampedDistanceX() {
    return Math.min(Math.max(0, this.distanceX), this.totalDistanceX)
  }

  get totalDistancePercentageX() {
    return this.clampedDistanceX / this.totalDistanceX
  }


  public onPanStart($event: any) {
    if (this.isPanning || this.isTransitioning) return;
    this.isPanning = true;
    this.lastPanX = $event.deltaX
    this.lastPanY = $event.deltaY
    this.distanceY = 0;
    this.onCardSelectionChangeEmit(false)

    this.firstMovement = false;
    console.log('onPanStart')
  }

  public onPan($event: any) {
    if (!this.isPanning || this.isTransitioning) return;

    let deltaX = this.lastPanX - $event.deltaX
    let deltaY = this.lastPanY - $event.deltaY
    if (!this.firstMovement) {
      this.firstMovement = true;
      if (!this.canAnswer) {
        this.direction = "x"
      } else {

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          this.direction = 'x'
        } else {
          this.direction = 'y'
        }
      }
      // console.log('first_move', { direction: this.direction, distanceY: this.distanceY })
    }
    this.lastPanX = $event.deltaX
    this.lastPanY = $event.deltaY
    if (this.direction == "x") {

      this.distanceX += deltaX
    } else {
      this.distanceY += deltaY
      // console.log(this.distanceY)

    }

  }
  public onPanEnd($event: any) {
    if (!this.isPanning || this.isTransitioning) return;

    this.isPanning = false;
    this.firstMovement = false;

    if (this.direction == "x") {
      let idx = Math.round(this.totalDistancePercentageX * 10)
      this.distanceX = idx * 200
      //this.totalDistanceX = this.totalDistanceX/10
    } else {
      console.log(this.canAnswer, this.isCardSelected)
      if (this.isCardSelected && this.canAnswer) {

        this.onAnswerEvent()
        return
      } else {
        this.distanceY = 0
        this.onCardSelectionChangeEmit(false)

      }
    }
    this.direction = ""
  }

  public isEnteringCard: boolean = false;
  public isSelectingCard: boolean = false;
  get isTransitioning() {
    return this.isEnteringCard || this.isSelectingCard
  }

  public onAnswerEvent() {
    this.onCardSelectionChangeEmit(true)
    let idx = Math.round(this.totalDistancePercentageX * 10)
    this.onAnswer.emit(idx);

    this.direction = 'y'

    this.isSelectingCard = true;

    this.distanceY += window.innerHeight + 300

    setTimeout(() => {

      this.isEnteringCard = true;
      this.distanceY = 600;

      setTimeout(() => {


        this.isSelectingCard = false
        this.isEnteringCard = true;
        this.distanceY = 0

        setTimeout(() => {

          this.direction = ''
          this.isSelectingCard = false
          this.isEnteringCard = false;
          this.onCardSelectionChangeEmit(false)
        }, 300)
      }, 1)
    }, 999)
  }

}
