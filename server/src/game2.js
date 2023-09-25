const CARDS = require("../constants/cards").filter((el) => el.numAnswers <= 1);
const Player = require("./player");
const { EventEmitter } = require("events");
const crypto = require("crypto");
 
let timeout = 120
class Game extends EventEmitter {
  cards = CARDS;
  questions = [];
  answers = [];
  players = [];

  history = [];
  lastEpisodeResult = {};

  episode = {
    question: { text: "question" },
    answers: [],
    player_answers: [],
    player_votes: [],
    state: "answer", // Answer , Vote , Results, End
    result: {
      state: "winner", // "winner","draw","failed"
      winner: {},
      question: {},
      answer: {},
      votes: 0,
    },
  };

  constructor() {
    super();
    this.id = crypto.randomUUID();
    this.reset();
  }

  data() {
    return {
      episode: this.episode,
      history: this.history,
      lastEpisodeResult: this.lastEpisodeResult,
      players: this.players,
    };
  }

  draw(player = false) {
    let players = this.players;
    if (player) {
      players = [player];
    }
    for (let player of players) {
      if (player.hand.length < 10) {
        for (let i = player.hand.length - 1; i < 10; i++) {
          player.draw(this.answers.pop(0));
        }
      }
      player.canAnswer = true;
      player.canVote = true;
    }
  }

  addPlayer(player, callback) {
    let running = this.running;
    if (!running) {
      this.start();
    }
    const playerIds = this.playerIds;
    const index = playerIds.indexOf(player.uuid);
    console.log({index})
    if (index == -1) {
      player.reset();
      player.setOnline(true);
      this.draw(player);
      this.players.push(player);
    } else {
      
      this.players[index].setOnline(true);
      this.draw(this.players[index]);
      // this.players[index] = player
      this.players[index].online = true;
    }
    if (callback) {
      callback();
    }


  }

  start(){
    this.reset();
    this.nextEpisode()
    this.updateCounter(timeout);
    this.updateGameEmit()
  }
  removePlayer(socketId, callback) {
    const playerSockets = this.playerSockets;
    const index = playerSockets.indexOf(socketId);
    //player.draw();
    if (index == -1) {
      // this.players.push(player);
    } else {
      this.players[index].setOnline(false);
    }
    if (callback) {
      callback();
    }
    //this.updateGameEmit()
  }

  nextEpisode() {
    this.episode = {
      question: this.questions.shift(0), //[0],
      answers: [],
      complete: false,
      player_answers: [],
      player_votes: [],
      result: {
        state: "winner", // "winner","draw","failed"
        winner: {},
        question: {},
        answer: {},
        votes: 0,
      },
      state: "answer",
    };
    this.draw();

    this.updateCounter(timeout);
  }

  isEmiting = false;

  updateGameEmit() {
    if (this.isEmiting) return;
    this.isEmiting = true;

    this.emit("update-game");
    setTimeout(() => {
      this.isEmiting = false;
    }, 10);
  }

  goToVote() {
    this.episode.state = "vote";
    this.updateCounter(timeout);
  }

  goToResults() {
    this.episode.state = "results";
    let len = this.episode.answers.length;
    let maxCount = -1;
    let maxCountIdx = 0;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        if (maxCount < this.episode.answers[i].count) {
          maxCount = this.episode.answers[i].count;
          maxCountIdx = i;
        }
      }
    }
    if (maxCount > -1) {
      this.episode.result = {
        state: "winner", // "winner","draw","failed"
        winner: this.episode.answers[maxCountIdx].player,
        question: this.episode.question,
        answer: this.episode.answers[maxCountIdx],
        votes: maxCount,
      };
      this.episode.answers[maxCountIdx].player.score += 1;
      
      this.updateCounter(5);
    } else {
      this.episode.result = {
        state: "failed", // "winner","draw","failed"
        winner: {},//this.episode.answers[maxCountIdx].player,
        question:  {},//this.episode.question,
        answer: {},//,this.episode.answers[maxCountIdx],
        votes: -1,
      };
      
      this.nextEpisode();
      
    }
    this.lastEpisodeResult = this.episode.result;
    this.history.push(this.episode);
    return;
   
  }
  stepEpisodeCallback() {
    console.log('stepEpCb',this.episode.state);
    if (this.episode.state == "answer") {
      this.goToVote();
    } else if (this.episode.state == "vote") {
      this.goToResults();
    } else {
      //if(this.episode.state == "results"){
      //this.episode.state = "answer"
      this.nextEpisode();
      // this.updateCounter(timeout);
    }

    if (this.isEmiting) return;
    this.isEmiting = true;

    this.emit("step-episode");
   
    setTimeout(() => {
      this.isEmiting = false;
    }, 10);
  }
  stepEpisode() {
    console.log("will step");
    if (this.stepEpisodeCallback) {
      this.stepEpisodeCallback();
    }
  }

  counter = timeout;
  counterInterval;
  updateCounter(counter = timeout) {
    console.log("updateCounter");

    this.counter = counter;
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
    this.counterInterval = setInterval(() => {
      if (this.running) {
        console.log("updateCounter", this.counter);
        this.counter -= 1;
        if (this.counter == 0) {
          clearInterval(this.counterInterval);
          this.stepEpisode();
        }
      }
    }, 1000);
  }

  answer(player, answer) {
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log({player,answer},'answer')
    let index = this.playerIds.indexOf(player.uuid);
    player = this.players[index];
    if (this.episode.state != "answer") return player;
    if (!player.canAnswer) return player;
    player.canAnswer = false;
    player.canVote = true;
    answer = player.hand.splice(answer, 1)[0];
    console.log({ answer });
    answer.player = player;
    answer.count = 0;
    this.episode.player_answers.push(player.uuid);
    this.episode.answers.push(answer);
    return player;
  }
  vote(player, answer) {
    let index = this.playerIds.indexOf(player.uuid);
    player = this.players[index];
    if (this.episode.state != "vote") return player;
    if (!player.canVote) return player;
    player.canVote = false;
    //answer = player.hand.splice(answer,1)
    //answer.player = player
    this.episode.player_votes.push(player.uuid);
    this.episode.answers[answer].count += 1;
    return player;
  }
  reset() {
    //this.players = [];
    this.cards = CARDS;
    this.score = {};
    this.questions = this.shuffle(
      this.cards.filter((el) => el.cardType === "Q")
    );
    this.answers = this.shuffle(this.cards.filter((el) => el.cardType === "A"));
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].reset();
      for (let j = 0; j < 9; j++) {
        this.players[i].draw(this.answers.pop(0));
      }
    }
    this.nextEpisode();
  }
  shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  get sorted_answers() {
    return this.episode.player_answers.sort();
  }

  get running() {
    try {
      return this.onlinePlayers.length > 0;
    } catch (ex) {
      return false;
    }
  }

  get onlinePlayers() {
    try {
      return this.players.filter((el) => el.online);
    } catch (ex) {
      return [];
    }
  }
  get playerIds() {
    try {
      return this.players.map((el) => el.uuid);
    } catch (ex) {
      return [];
    }
  }
  get playerSockets() {
    try {
      return this.players.map((el) => el.socketId);
    } catch (ex) {
      return [];
    }
  }
}

module.exports = Game;
