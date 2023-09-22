import { Component, Input } from '@angular/core';
import { subscribeOn } from 'rxjs';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() state:any = ''
  @Input() name:any = ''
  @Input() score:any = 0
  @Input() countdown:any = 120
  @Input() round:any = 0

  countdown_:any = 120;

  constructor(public gameService: GameService) {
    setInterval(()=>{
      if(this.countdown_ >0){
        this.countdown_-=1;
      }
    },1000)
  }


  subscription:any;
  ngOnInit() {
    this.subscription = this.gameService
      .getResetHandEmiter()
      .subscribe(() => this.resetCounter());
  }

  resetCounter() {
    this.countdown = 120
    this.countdown_ = 120
  }

  get countdownClass(){
    let countdownClass = ''
    try{
      if(this.countdown_ <= 30){
        countdownClass = 'text-danger'
      }
      return countdownClass
    }catch(ex){
      return countdownClass
    }
  }

  get countdown__(){
    try{
      const minutes = Math.floor(this.countdown_/60)
      let seconds = `${this.countdown_%60}`
      if(seconds.length <2){
        seconds = '0'+seconds
      }
      return `${minutes}:${seconds}`
    }catch(ex){
      return '2:00'
    }
  }
}
