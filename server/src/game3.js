const crypto = require("crypto");
const CARDS = require("../constants/cards").filter((el) => el.numAnswers <= 1);
const Player = require("./player2");

const { EventEmitter } = require("events");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

class GameManager {
  PlayersByIndex = [];
  PlayersById = {};
  PlayersBySocket = {};
  Players = []

  constructor() {}

  getPlayer(id){
    let player = this.Player.filter(el => {
      el.uuid === id || el.socketId === id 
    })[0]
    return player
  }
  updatePlayerById(player) {
    let uuid = player.uuid;
    let index = player.index;
    let socketId = player.socketId;
    this.PlayersById[uuid] = player;
    this.PlayersBySocket[socketId] = player;
    this.PlayersByIndex[index] = player;
  }

  deletePlayer(socketId) {
    let player = this.PlayersBySocket[socketId];
    console.log(
      "remove player",
      player.uuid,
      socketId,
      Object.keys(this.PlayersBySocket)
    );
    if (player) {
      /*
      let index = player.index;
      let uuid = player.uuid;
      this.PlayersByIndex.splice(index, 1);
      delete this.PlayersById[uuid];
      delete this.PlayersBySocket[socketId];
      this.PlayersByIndex = this.PlayersByIndex.filter(function () {
        return true;
      });
      for (let i = 0; i < this.PlayersByIndex.length; i++) {
        player = this.PlayersByIndex[i];
        uuid = player.uuid;
        socketId = player.socketId;
        this.PlayersBySocket[socketId].index = i;
        this.PlayersById[uuid].index = i;
      }
      */
     player= this.PlayersById[player.uuid];
     player.setOnline(false)
     this.updatePlayerById(player)
    }
  }

  removePlayer(socketId) {
    let player = this.PlayersBySocket[socketId];
    let uuid = player.uuid;

    player = this.PlayersById[uuid];
    player.setOnline(false);

    this.updatePlayerById(player);
 
  }

  registerPlayer(socketId, uuid, username) {

    if (!uuid || uuid == "undefined" || uuid.length==0) uuid = crypto.randomUUID();
    if (!username || username == "undefined" || username.length==0) {
      username = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      });
    }

    let isNewPlayer = false;
    let player = new Player(username, uuid, socketId);
    let index = this.PlayersByIndex.length;
    let oldSocketId = socketId;

    // Register new player

    if (uuid in this.PlayersById == false) {
      player.index = index;
      player.reset();

      this.PlayersById[uuid] = player;
      this.PlayersBySocket[socketId] = player;
      this.PlayersByIndex.push(player);
      isNewPlayer = true;
    } else {
      player = this.PlayersById[uuid];
      index = player.index;
      oldSocketId = player.socketId;
      // console.log({ player });
      player.setSocketId(socketId);
      player.setUsername(username);

      delete this.PlayersBySocket[oldSocketId];

      this.PlayersById[uuid] = player;
      this.PlayersByIndex[index] = player;
      this.PlayersBySocket[socketId] = player;
      isNewPlayer=false
    }
    this.updatePlayerById(player);
    return {
      isNewPlayer,
      player: this.PlayersById[uuid],
    };
  }

  get onlinePlayers() {
    try {
      return this.PlayersByIndex.filter((player) => player.online);
    } catch (e) {
      return [];
    }
  }

  get players() {
    return this.PlayersByIndex;
  }
}

class Game extends EventEmitter {
  // Settings
  timeout = 120;

  // Deck cards
  cards = CARDS;
  questions = [];
  answers = [];

  // Game players
  players = [];

  // Game history and results
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

  manager = new GameManager();
  action = "init"
  constructor() {
    super();
    this.id = crypto.randomUUID();
    this.reset();
  }

  registerPlayer(socketId, uuid, username) {
    const { isNewPlayer, player } = this.manager.registerPlayer(
      socketId,
      uuid,
      username
    );
    console.log({isNewPlayer, player});
    return player
    /*
    const { isNewPlayer, player } = this.manager.registerPlayer(
      socketId,
      uuid,
      username
    );
    
    if (isNewPlayer) {
      console.info("register",player.uuid);
      this.emit("register-player", {
        connection: player.uuid,
        socketId: player.socketId,
        username: player.username,
        player,
      });
    } else {
      console.info("connected",player.uuid);
      this.addPlayer(player);
      this.emit("connected", {
        connection: player.connection,
        socketId: player.socketId,
        username: player.username,
        player:player.player,
      });

      player.update = "join"
      this.manager.updatePlayerById(player);
      this.emit("update-player", this.manager.PlayersById[player.uuid]);
      //this.action = "remove-player"
      
      this.emit("update-game", this.data());
   
    }
    */
    
  }

  data() {
    let updateId = crypto.randomUUID();
    //console.log({p:this.manager.onlinePlayers,l:this.manager.onlinePlayers.length})
    let state = this.episode.state;
    console.log({state})
    if(state =="answer"){
      if(this.sorted_answers.toString() == this.manager.onlinePlayers.map(el=>el.uuid).sort().toString()){
        this.stepEpisode()
      }
    }
    if(state =="vote"){
      if(this.sorted_votes.toString() == this.manager.onlinePlayers.map(el=>el.uuid).sort().toString()){
        this.stepEpisode()
      }
    }
    return {
      episode: this.episode,
      history: this.history,
      lastEpisodeResult: this.lastEpisodeResult,
      players: this.manager.onlinePlayers,
      updateId,
      action:this.action
    };
  }

  draw(player = false) {
    // console.log("draw");
    let players = this.manager.onlinePlayers;
    if (player) {
      players = [this.manager.PlayersById[player.uuid]];
    }

    for (player of players) {
      if (player.hand.length < 10) {
        for (let i = player.hand.length - 1; i < 10; i++) {
          player.draw(this.answers.pop(0));
        }
      }
      player.canAnswer = true;
      player.canVote = true;
      player.update = "draw"
      this.manager.updatePlayerById(player);
      this.emit("update-player", this.manager.PlayersById[player.uuid]);
    }
  }

  addPlayer(player, callback) {
    // console.log("add player");
    let running = this.running;

    this.manager.PlayersById[player.uuid].setOnline(true);
    this.manager.PlayersById[player.uuid].game = this.id;
    this.draw(this.manager.PlayersById[player.uuid]);
    //console.log('add player',this.manager.PlayersById[player.uuid]);

    if (!running) {
      this.start();
    } else {
      this.action = "add-player"
      this.emit("update-game", this.data());
    }

  }

  start() {
    this.reset();
    this.nextEpisode();
    this.updateCounter(this.timeout);
    //this.updateGameEmit();
    // console.log("start game");
    this.action = "start-game"
    this.emit("update-game", this.data());
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

    this.updateCounter(this.timeout);
  }

  isEmiting = false;

  updateGameEmit() {
    /*
    if (this.isEmiting) return;
    this.isEmiting = true;

    this.emit("update-game");
    setTimeout(() => {
      this.isEmiting = false;
    }, 10);
    */
  }

  goToVote() {
    this.episode.state = "vote";
    this.updateCounter(this.timeout);
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
        winner: {}, //this.episode.answers[maxCountIdx].player,
        question: {}, //this.episode.question,
        answer: {}, //,this.episode.answers[maxCountIdx],
        votes: -1,
      };

      this.nextEpisode();
    }
    this.lastEpisodeResult = this.episode.result;
    this.history.push(this.episode);
    return;
  }
  stepEpisodeCallback() {
    // console.log("stepEpCb", this.episode.state);
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
    // console.log("will step");
    if (this.stepEpisodeCallback) {
      this.stepEpisodeCallback();
    }
  }

  counterInterval;
  updateCounter(counter = this.timeout) {
    //console.log("updateCounter");

    this.counter = counter;
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
    this.counterInterval = setInterval(() => {
      if (this.running) {
        //console.log("updateCounter", this.counter);
        this.counter -= 1;
        if (this.counter == 0) {
          clearInterval(this.counterInterval);
          this.stepEpisode();
        }
      }
    }, 1000);
  }

  answer(uuid, answer) {

    let player = this.manager.PlayersById[uuid]//
    let index = player.index
    // player = this.players[index];
    if (this.episode.state != "answer") return player;
    if (!player.canAnswer) return player;
    player.canAnswer = false;
    player.canVote = true;
    answer = player.hand.splice(answer, 1)[0];
    // console.log({ answer });
    answer.player = player;
    answer.count = 0;
    this.episode.player_answers.push(player.uuid);
    this.episode.answers.push(answer);
    return player;
  }
  vote(uuid, answer) {
    let player = this.manager.PlayersById[uuid]//
    let index = player.index
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

    for (let i = 0; i < this.manager.players.length; i++) {
      this.manager.players[i].reset();
      this.manager.updatePlayerById(this.manager.players[i]);
    }

    for (let i = 0; i < this.manager.onlinePlayers.length; i++) {
      //this.manager.onlinePlayers[i].reset();
      for (let j = 0; j < 9; j++) {
        this.manager.onlinePlayers[i].draw(this.answers.pop(0));
      }
      this.manager.updatePlayerById(this.manager.onlinePlayers[i]);
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

  get sorted_votes() {
    return this.episode.player_votes.sort();
  }

  get running() {
    try {
      return this.manager.onlinePlayers.length > 0;
    } catch (ex) {
      return false;
    }
  }

  get onlinePlayers() {
    try {
      return this.manager.onlinePlayers; //.filter((el) => el.online);
    } catch (ex) {
      return [];
    }
  }
  get playerIds() {
    try {
      return this.manager.players.map((el) => el.uuid);
    } catch (ex) {
      return [];
    }
  }
  get playerSockets() {
    try {
      return this.manager.players.map((el) => el.socketId);
    } catch (ex) {
      return [];
    }
  }
}

module.exports = Game;
