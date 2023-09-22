import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  state = 'Answer';
  name = 'Pihh';
  score = 5;
  round = 6;

  question = 'I drink to forget _____?';
  totalAnswers = 0;
  totalPlayers = 6;

  cards = [
    { text: 'Alcoholism' },
    { text: 'Carlos Cruz' },
    { text: 'My wife' },
    { text: 'O zé na noite' },
    { text: 'Michael jackson' },
    { text: 'Child abuse' },
    { text: 'A defective condom' },
    { text: 'Two girls one cup' },
    { text: 'My sister' },
    { text: 'Your uncle' },
  ];

  constructor(public gameService: GameService){}
  onAnswerEvent(data: any) {
    console.log(data, 'onAnswerEvent');

    this.gameService.answer(data)
  }
  ngOnInit() {

    this.gameService.onUpdate().subscribe((data: any) => {
      try{
        console.log(data)
        this.question = data.episode.question.text
        this.totalAnswers = data.episode.player_answers.length;
        this.totalPlayers = data.players.length;
      }catch(ex){

      }
    });

    this.gameService.onUpdatePlayer().subscribe((data: any) => {
      console.log('onUpdatePlayer', typeof data, data);
      if (data && typeof data == 'object') {
        this.name = data.name;
        this.score = data.score;
        this.cards = data.hand;
      }
    });
  }
}
