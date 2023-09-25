const CARDS = require("../constants/cards").filter(el => el.numAnswers <=1);
const Player = require("./player");
class Game {
  running = false;

  cards = CARDS;
  players = [];
  score = {};

  questions = [];
  question = {};
  answers = [];

  episode = {};
  history = [];

  constructor() {}

  getPlayerId(uuid){
    let index = -1;
    for(let i = 0; i < this.players.length; i++) {
      if(this.players[i].uuid === uuid){
        return i
      }
    }
    return index
  }

  getPlayer(uuid){
    let index = -1;
    for(let i = 0; i < this.players.length; i++) {
      if(this.players[i].uuid === uuid){
        return this.players[i]
      }
    }
    return index
  }
  addPlayer(uuid,name,socketId) {
    //if (this.running) return;
    //const player = new Player(uuid);
    let foundPlayer = new Player(uuid,name,socketId);
    let hasPlayer = false;
    for(let i = 0; i < this.players.length; i++) {
        if(this.players[i].uuid === uuid){
          foundPlayer = this.players[i]
          foundPlayer.socketId = socketId
          hasPlayer = true
          break;
        }
    }
    foundPlayer.active=true
    if(this.running){
      this.draw(foundPlayer)
    }
    if(!hasPlayer){
      this.players.push(foundPlayer);
    } 

    return foundPlayer
  }

  get ranking() {
    try {
      return this.players.sort((a, b) => b.score - a.score);
    } catch (ex) {
      return this.players;
    }
  }

  reset(){
    this.cards = CARDS
    this.score = {}
    this.questions = this.shuffle(
      this.cards.filter((el) => el.cardType === 'Q')
    );
    this.answers = this.shuffle(this.cards.filter((el) => el.cardType === 'A'));
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].reset();
      for (let j = 0; j < 9; j++) {
        this.players[i].draw(this.answers.pop(0));
      }
    }
  }

  start() {
    this.reset();
    this.step();
    this.running = true;
  }

  draw(player=false) {
    let players = this.players
    if (player){
      players = [player]      
    }
    for (let player of players) {
      if(player.hand.length< 10){
        for(let i = player.hand.length-1 ; i <10; i++){
          player.draw(this.answers.pop(0));
        }
      }
      player.canAnswer = true;
      player.canVote = true;
    }
  }

  step() {
    this.draw();
    this.episode = {
      question: this.questions.shift(0),//[0],
      answers: [],
      complete: false,
      player_answers: [],
      player_votes: [],
      result: [],
      state: 'answer'
    };

    return this.episode;
  }

  answer(data){
    console.log(this.players)
    let {uuid,idx} = data

    let player = this.players[this.getPlayerId(uuid)]
    let answer = player.answer(idx);
    if(answer){
      if (this.episode.player_answers.indexOf(uuid) > -1) return;
      this.episode.player_answers.push(uuid);
      answer.score = 0;
      answer.player = player
      this.episode.answers.push(answer);
      if(this.episode.player_answers.length == this.players.filter(el=>el.active).length){
        this.episode.state = "vote"
      }
      return true
    }
    return false;  
  }

  vote(data){
    let {uuid,idx} = data
    let player = this.players[this.getPlayerId(uuid)]
    let vote = player.vote();
    if(vote){
      if (this.episode.player_votes.indexOf(uuid) > -1) return;
      this.episode.player_votes.push(uuid);
      this.episode.answers[idx].score += 1
      if(this.episode.player_votes.length == this.players.filter(el=>el.active).length){
        this.episode.state = "complete"
      }
      return true
    }
    return false;  
  }

  async endEpisode() {
    let bestAnswer = false;
    let bestScore = -1;
    for (let a in this.episode.answers) {
      let answer = this.episode.answers[a];
      let score = answer.score;
      if (score > bestScore) {
        bestScore = score;
        bestAnswer = answer;
      }
    }

    for(let i = 0 ; i < this.players.length; i++){
      let player = this.players[i];
      if(player.uuid === bestAnswer.player.uuid){
        this.players[i].score +=1
      }
    }

    //this.players[bestAnswer.player.id].score += 1;
    //this.updateScore();
    this.episode.state= "done"
    this.episode.result = {
      answer: bestAnswer,
      player: bestAnswer.player,
      question: this.episode.question,
    };
    //await this.readCard('Question')
    //await this.readCard(this.episode.result.question.text)
    //await this.readCard('Winner')
    //await this.readCard(this.episode.result.answer.text)
    this.history.push(this.episode);

    return bestAnswer.player
    //this.step();
  }
  /*
  start() {
    this.running = true;

    this.cards = CARDS;
    /*
        this.score = {};
        this.questions = this.shuffle(
          this.cards.filter((el) => el.cardType === 'Q')
        );
        this.answers = this.shuffle(this.cards.filter((el) => el.cardType === 'A'));
        for (let i = 0; i < this.players.length; i++) {
          this.players[i].reset();
          for (let j = 0; j < 9; j++) {
            this.players[i].draw(this.answers.pop(0));
          }
        }
    
        this.step();
      }
        

  addPlayer(uuid) {
    if (this.running) return;
    //const player = new Player(uuid);
    let foundPlayer = new Player(uuid);;
    for(let i = 0; i < this.players.length; i++) {
        if(this.players[i].uuid === uuid){
          foundPlayer = this.players[i]
          break;
        }
    }

    return foundPlayer
  }

  getPlayerId(uuid){
    let index = -1;
    for(let i = 0; i < this.players.length; i++) {
      if(this.players[i].uuid === uuid){
        return i
      }
    }
    return index
  }
  setPlayerName(data){
    let {uuid,name} = data;
    let playerIndex = this.getPlayerId(uuid)
    this.players[playerIndex].name = name
    
  }
  */

  shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }
}
module.exports = Game;
