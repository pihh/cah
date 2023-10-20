import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-modal-splash',
  templateUrl: './modal-splash.component.html',
  styleUrls: ['./modal-splash.component.scss']
})
export class ModalSplashComponent {
  @Input() active: boolean = true;
  @Input() hidding: boolean = false;
  @Input() hidden: boolean = false;
  @Input() complete: boolean = false;
  @Input() loading: boolean = true;

  @Output() onJoinEvent = new EventEmitter<any>()

  public username:string = "";
  public pristine: boolean = true;


  constructor(public gameService:GameService){}

  // Subscriptions
  public initSubscription:any;
  ngOnInit() {
    this.pristine = false;
    this.loading = !this.gameService.identified
    this.initSubscription = this.gameService.onInit().subscribe((data:any)=>{
      this.loading = !this.gameService.identified;
      this.username = this.gameService.username;

    })
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe()
  }

  // Getters
  get isHidden() {
    let result = true;
    if (this.complete) return result;
    if (this.pristine) return result;
    try {
      if (this.hidding || this.hidden) {
        result = false;
      }
    } catch (ex) {
    }
    return result
  }

  // Actions
  public join(){
    console.log(this.username)
    this.gameService.setAndUpdateUsername(this.username);
    this.gameService.join()
    this.onJoin()
  }

  public onJoin() {
    this.onJoinEvent.emit();
  }
}
