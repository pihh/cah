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

  transitionToVotePageSubscription: any;
  transitionToGamePageSubscription: any;

  gameUpdateSubscription: any;
  playerUpdateSubscription: any;

  player: any = {
    hand:[]
  }
  constructor(public gameService: GameService, public router: Router) {}

  resultQuestion = "What is a must-have at a children's party?"
  resultAnswer = "Carlos Cruz"

  ngOnInit() {
    this.transitionToVotePageSubscription = this.gameService
      .getTransitionToVotePageEmiter()
      .subscribe(() => this.enterVotePage());

    this.transitionToGamePageSubscription = this.gameService
      .getTransitionToGamePageEmiter()
      .subscribe(() => this.enterResultPage());

    console.log({
      enterResultPage: this.enterResultPage,
      enterVotePage: this.enterVotePage,
      self: this,
    });

    this.gameService.startGame()
    this.gameService.onInit().subscribe((data: any) => {
      console.log('onInit', { data });
    });
    let state = ''

    this.gameService.onUpdate().subscribe((data: any) => {
      console.log('onUpdate', { data ,state:data.episode.state});
      try{
        if(data.episode.state !==state){
          state = data.episode.state;
          try{
            this.resultQuestion = data.history[data.history.length - 1].result.question.text
            this.resultAnswer = data.history[data.history.length - 1].result.answer.text
          }catch(ex){

          }
          if(state === 'vote'){
            this.enterVotePage()
          }else if(state ==="complete"){
            this.enterResultPage()
          }
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
    console.log('enter result page"');
    if (this.transitioning) return;
    this.transitioning = true;
    this.resultShowing = true;
    this.gameService.endEpisode()
    setTimeout(() => {
      this.resultLeave = false;
      this.resultEnter = true;
      this.gameService.step()
      console.log('enterResultPage');
      //debugger;
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
      console.log('enterVotePage');
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
