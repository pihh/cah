import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  state = 'Vote';
  name = 'Pihh';
  score = 5;
  round = 6;

  question = 'I drink to forget _____?';
  totalAnswers = 0;
  totalPlayers = 6;

  answers :any[]= [
    // { text: 'Alcoholism' },
    // { text: 'Carlos Cruz' },
    // { text: 'My wife' },
    // { text: 'O zé na noite' },
    // { text: 'Michael jackson' },
    // { text: 'Child abuse' },
    // { text: 'A defective condom' },
    // { text: 'Two girls one cup' },
    // { text: 'My sister' },
    // { text: 'Your uncle' },
  ];

  constructor(public gameService: GameService) {}
  subscription:any;
  ngOnInit() {
    this.subscription = this.gameService
      .getResetHandEmiter()
      .subscribe(() => this.resetHand());

    this.gameService.onUpdate().subscribe((data: any) => {
      try{
        console.log(data)
        this.answers = data.episode.answers
        //this.question = data.episode.question.text
        //this.totalAnswers = data.episode.player_answers.length;
        //this.totalPlayers = data.players.length;
      }catch(ex){

      }
    });
  }

  resetHand() {
    this.canVote = true;
    this.chosenAnswerIndex = -2;
    this.selectedAnswerIndex = -1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();


  }

  canVote = true;
  selectedAnswerIndex = -1;
  chosenAnswerIndex = -2;
  voteAnswer(i:any){
    if(!this.canVote)return
    if(this.selectedAnswerIndex > -1) return;

    this.selectedAnswerIndex = i;
  }


  confirmAnswer(i:any){
    if(!this.canVote)return
    if(this.selectedAnswerIndex ==  i){
      this.chosenAnswerIndex = i;
      this.canVote = false;
      this.gameService.vote(i)
    }else{
      this.chosenAnswerIndex = -1;
      this.selectedAnswerIndex = -1
    }
  }
  discardAnswer(i:any){
    if(!this.canVote)return
    if(this.selectedAnswerIndex <0)return
    setTimeout(()=>{
      this.chosenAnswerIndex = -1;
      this.selectedAnswerIndex = -1
    },1)
  }
}
