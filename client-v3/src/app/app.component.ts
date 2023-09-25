import { Component } from '@angular/core';
import { GameService } from './services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client-v3';
  resultQuestion = "What is a must-have at a children's party?"
  resultAnswer = "Carlos Cruz"

  transitionToVotePageSubscription: any;
  transitionToGamePageSubscription: any;

  gameUpdateSubscription: any;
  playerUpdateSubscription: any;

  player: any = {
    hand:[]
  }
  constructor(public gameService: GameService, public router: Router) {
    this.isFirstTime()
  }


  public isFirstTime(){
    const username = this.gameService.username;
    const uuid = this.gameService.connection;
    if(username == "" || uuid == ""){
      this.router.navigate(['/game']);
      return true
    }
    return false;
  }

  ngOnInit() {

    this.transitionToVotePageSubscription = this.gameService
      .getTransitionToVotePageEmiter()
      .subscribe(() => this.enterVotePage());

    this.transitionToGamePageSubscription = this.gameService
      .getTransitionToGamePageEmiter()
      .subscribe(() => this.enterResultPage());


    /*

    this.gameService.onAudio().subscribe((data:any)=>{
      // console.log('onAudio', { data });
      var audio = new Audio(data);
      audio.play();
    })
    */
    let state = ''

    this.gameService.onUpdate().subscribe((data: any) => {
      let canRedirect = true
      if(this.router.url == "/login") {
        canRedirect = false
      }
      try{
        // console.log('onUpdate', { data ,state:data.episode.state});
        if(data.episode.state !==state){
          state = data.episode.state;
          try{
            this.resultQuestion = data.history[data.history.length - 1].result.question.text
            this.resultAnswer = data.history[data.history.length - 1].result.answer.text
          }catch(ex){

          }
          if(state === 'vote'){
            if(canRedirect){
              this.enterVotePage()
            }
          }else if(state ==="results"){
            if(canRedirect){
              this.enterResultPage()
            }
          }else{
            if(canRedirect){
              this.router.navigate(['/game']);
            }
          }
        }
      }catch(ex){
        console.warn(ex)
      }
    });

    this.gameService.onUpdatePlayer().subscribe((data: any) => {
      try{

        if(typeof data =="object" && data){
          this.player = data
        }
      }catch(ex){

      }
    });


  }

  // Enter results page animation
  resultShowing = false;
  resultEnter = false;
  resultLeave = false;
  resultHidden = true;

  enterResultPage() {

    if (this.transitioning) return;
    this.transitioning = true;
    this.resultShowing = true;

    setTimeout(() => {
      this.resultLeave = false;
      this.resultEnter = true;

    }, 10);
    setTimeout(() => {

      this.resultHidden = false;
    }, 500);
    setTimeout(() => {
      this.router.navigate(['/game']);
    }, 1500);
    setTimeout(() => {
      this.leaveResultPage();
    }, 5000);
  }
  leaveResultPage() {
    this.resultShowing = true;
    this.resultLeave = true;
    this.resultEnter = false;
    this.resultHidden = true;
    setTimeout(() => {
      this.transitioning = false;
      this.resultShowing = false;
      this.resultLeave = false;
      this.resultEnter = false;
    }, 500);
  }

  // Enter votes page animation
  transitionVoteShowing = false;
  transitionVoteEnter = false;
  transitionVoteLeave = false;
  transitioning = false;
  enterVotePage() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.transitionVoteShowing = true;
    setTimeout(() => {
      this.transitionVoteLeave = false;
      this.transitionVoteEnter = true;
      // console.log('enterVotePage');
    }, 1);
    setTimeout(() => {
      this.router.navigate(['/vote']);
    }, 2500);
    setTimeout(() => {
      this.leaveVotePage();
    }, 2000);
  }

  leaveVotePage() {
    this.transitionVoteShowing = true;
    this.transitionVoteLeave = true;
    this.transitionVoteEnter = false;
    setTimeout(() => {

      this.transitioning = false;
      this.transitionVoteShowing = false;
      this.transitionVoteLeave = false;
      this.transitionVoteEnter = false;
    }, 1000);
  }

  ngOnDestroy() {
    this.transitionToVotePageSubscription.unsubscribe();
    this.transitionToGamePageSubscription.unsubscribe();
  }
}
