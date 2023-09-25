const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});
const { uniqueNamesGenerator, adjectives, colors, animals } = require( 'unique-names-generator');

const config = {
  dictionaries: [adjectives, colors, animals]
}

const Player = require("./src/player2");
const Game = require("./src/game2")
const port = process.env.PORT || 3000;


const Players = {}
const RegisterPlayer = function(id,username){
  if(!Players[id]){
    Players[id]= new Player(username,id);
  }
  Players[id].username = username;
  return Players[id]
}
const GameServer = new Game()
let isEmiting = false


io.on("connection", (socket) => {
  const firstConnection = socket.handshake.query.connection ? false : true;
  const socketUuid = socket.handshake.query.connection || socket.id;
  const username = socket.handshake.query.username || uniqueNamesGenerator(config)
  const socketId = socket.id;
  let player = RegisterPlayer(socketUuid,username);
  player.socketId = socketId;
  
  GameServer.on("step-episode", () => {
    if (isEmiting) return;
    //console.log("step episode");
    isEmiting = true;
    // io.emit("update-game", { game: GameServer });
    io.emit("update-game", GameServer.data() );
    if(GameServer.episode.state ==="answer"){
      for(let i = 0 ; i < GameServer.onlinePlayers.length ; i++){
        io.to(GameServer.onlinePlayers[i].socketId).emit('update-player', GameServer.onlinePlayers[i])
      }
    }
    setTimeout(() => {
      isEmiting = false;
    }, 10);
  });

  socket.on('answer',(data)=>{
    console.log('onAnswer', socket.id,data, GameServer.players,GameServer.playerSockets,GameServer.playerIds)
    let playerIdx = GameServer.playerSockets.indexOf(socket.id);
    let player = GameServer.players[playerIdx];
    player = GameServer.answer(player,data)
    
    io.to(socket.id).emit('update-player',player)

    console.log(GameServer.episode.player_answers.sort().toString(),GameServer.onlinePlayers.map(el=>el.uuid).sort().toString())
    if(GameServer.episode.state =="answer"){
      if(GameServer.episode.player_answers.sort().toString() == GameServer.onlinePlayers.map(el=>el.uuid).sort().toString()) {
        GameServer.stepEpisode()
      }
    }else{

      io.emit('update-game', GameServer.data())
    }
    //console.log('answers',GameServer.episode.player_answers )

  })

  socket.on('vote',(data)=>{
    let playerIdx = GameServer.playerSockets.indexOf(socket.id);
    let player = GameServer.players[playerIdx];
    player = GameServer.vote(player,data)
    
    io.to(socket.id).emit('update-player',player)

    console.log(GameServer.episode.player_votes.sort().toString(),GameServer.onlinePlayers.map(el=>el.uuid).sort().toString())
    if(GameServer.episode.state =="vote"){
      if(GameServer.episode.player_votes.sort().toString() == GameServer.onlinePlayers.map(el=>el.uuid).sort().toString()) {
        GameServer.stepEpisode()
      }
    }else{

      io.emit('update-game', GameServer.data())
    }

  })
  // Connection
  console.log({socketUuid,username})

  if(firstConnection){
    io.to(socket.id).emit('register', {
      connection: socketUuid,
      socketId:socketId,
      username,
      player 
    })
  }else{
  
    GameServer.addPlayer(player)
    console.log('addPlayer',GameServer.players.length, player.uuid)
    
    io.to(socket.id).emit('connected', {
      connection: socketUuid,
      socketId:socketId,
      username,
      player
    })
    io.emit('update-game',GameServer.data())
    io.to(socket.id).emit('update-player',player)
  }

  // Disconnect
  socket.on("forceDisconnect", function () {
    for(let key of Object.keys(Players)){
      let _player = Players[key];
      if(_player.uuid == socket.id){
        delete Players[key]
      }
    }
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    
    console.log("disconnected", socket.id);

    /*
    for(let key of Object.keys(Players)){
      let _player = Players[key];
      if(_player.socketId == socket.id){
        Players[key].setOnline(false);
      }
    }
    for(let i = 0 ; i < GameServer.players.length; i++){
      let _player = GameServer.players[i];
      if(_player.socketId == socket.id){
        _player.setOnline(false);
        GameServer.removePlayer(_player);
      }
    }*/
    GameServer.removePlayer(socket.id)

    io.emit('update-game',GameServer.data())
 
  })
})
    //io.emit("update-game", { game: simpleStringify(GameServer) });
   
    /*
    const sockets = [...io.sockets.sockets.keys()];
    for (let i = 0; i < sockets.length; i++) {
      try {

        console.log(sockets[i],socket.id)
        //io.to(sockets[i]).emit('update-game',{game:GameServer})
      } catch (ex) {
        console.log(ex);
      }
    }
    *
  });
})
/*
const Game = require("./src/game2");
const Player = require("./src/player2");

const Players = {};

const GameServer = new Game();
GameServer.reset();
/*
const Games = {};
const CardsAgainstHumanity = new Game();

Games[CardsAgainstHumanity.id] = CardsAgainstHumanity;
*

function simpleStringify (object){
  // stringify an object, avoiding circular structures
  // https://stackoverflow.com/a/31557814
  var simpleObject = {};
  for (var prop in object ){
      if (!object.hasOwnProperty(prop)){
          continue;
      }
      if(prop == "counterInterval"){
        continue;
      }
      

      if (typeof(object[prop]) == 'function'){
          continue;
      }
      simpleObject[prop] = object[prop];
  }
  return JSON.parse(JSON.stringify(simpleObject)); // returns cleaned up JSON
};

isEmiting = false;
io.on("connection", (socket) => {
  const firstConnection = socket.handshake.query.connection ? false : true;
  const socketUuid = socket.handshake.query.connection || socket.id;
  const username = socket.handshake.query.username || "Random Player";
  const socketId = socket.id;

  console.log("Connected", socketId, socketUuid);

  
  GameServer.on("step-episode", () => {
    if (isEmiting) return;
    console.log("step episode");
    isEmiting = true;
    // io.emit("update-game", { game: GameServer });
    io.emit("update-game", { game: simpleStringify(GameServer) });
    setTimeout(() => {
      isEmiting = false;
    }, 10);
  });
  GameServer.on("update-game", () => {
    if (isEmiting) return;
    console.log("update-game");
    isEmiting = true;
    // io.emit("update-game", { game: GameServer });
    io.emit("update-game", { game: simpleStringify(GameServer) });
    setTimeout(() => {
      isEmiting = false;
    }, 10);
  });
  

  if (firstConnection) {
    io.to(socket.id).emit("ping", {
      socketId: socket.id,
      connection: socketUuid,
      username,
    });
  } else {
    if (!Players[socketUuid]) {
      Players[socketUuid] = new Player(username, socketUuid);
    }
    Players[socketUuid].setSocketId(socket.id);
    Players[socketUuid].setOnline(true);

    io.to(socket.id).emit("connected", {
      socketId: socket.id,
      connection: socketUuid,
      username,
    });

    Players[socketUuid].join(GameServer);
    
    console.log({Players,g:GameServer.onlinePlayers.length})
    //console.log(Players[socketUuid])
    io.to(socketId).emit("update-player", Players[socketUuid]);
    //console.log('players',GameServer.players)
    io.emit("update-game", { game: simpleStringify(GameServer) });
    /*
    setTimeout(() => {
      //io.emit("update-game", { game: GameServer });
    }, 1);
    *
  }

  socket.on("forceDisconnect", function () {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    for (let uuid of Object.keys(Players)) {
      if (Players[uuid].socketId == socket.id) {
        GameServer.removePlayer(Players[uuid]);
        Players[uuid].setOnline(false)
      }
    }
    io.emit("update-game", { game: simpleStringify(GameServer) });
   
    /*
    const sockets = [...io.sockets.sockets.keys()];
    for (let i = 0; i < sockets.length; i++) {
      try {

        console.log(sockets[i],socket.id)
        //io.to(sockets[i]).emit('update-game',{game:GameServer})
      } catch (ex) {
        console.log(ex);
      }
    }
    *
  });
  /*
  if (!Players[socketUuid]) {
    Players[socketUuid] = {
      uuid: socketUuid,
      mute: false,
    };
  }

  Players[socketUuid].online = true;
  Players[socketUuid].socketId = socketId;

  let player;
  let newPlayer = true;
  for (let i = 0; i < CardsAgainstHumanity.players.length; i++) {
    player = CardsAgainstHumanity.players[i];
    if (player.uuid == socketUuid) {
      newPlayer = false;
      player.active = true;
      player.name = name;
      
      break;
    }
  }
  player = CardsAgainstHumanity.addPlayer(socketUuid, name, socketId);
  player.socketId = socketId
  if (!CardsAgainstHumanity.running) {
    CardsAgainstHumanity.start();
    CardsAgainstHumanity.draw(player)
  }

  io.to(socket.id).emit("init", {
    socketId: socket.id,
    uuid: socketUuid,
    game: CardsAgainstHumanity,
  });

  setTimeout(() => {
    io.to(socketId).emit("update-player", player);
  }, 1);
  io.emit("update", { game: CardsAgainstHumanity });

  /*
  socketsStatus[socket.id] = {
    online: true,
    mute: false,
    uuid: socketUuid
  };

  setTimeout(() => {
    io.to(socket.id).emit("init", {
      uuid: socket.id,
      game: CardsAgainstHumanity,
    });
  }, 1);

  function updateGame(){
    if(!CardsAgainstHumanity.episode){
      CardsAgainstHumanity.step()
    }
    io.emit("update", { game: CardsAgainstHumanity });
  }

  socket.on('add-player',(data)=>{
    let { uuid, name } = data;
    let hasPlayer = false;
    let player;
    for(let i =0; i < CardsAgainstHumanity.players.length;i++){
      player = CardsAgainstHumanity.players[i]
      if(player.uuid === uuid){
        player.active = true;
        player.name = name
        hasPlayer = true;
        break
      }
    }
    if(!hasPlayer){
      player = CardsAgainstHumanity.addPlayer(uuid, name, socket.id);
      
    }
    if(!CardsAgainstHumanity.running){
      CardsAgainstHumanity.start()
    }
    setTimeout(() => {
      io.to(player.socketId).emit("update-player", player);
    }, 1);
    io.emit("update", { game: CardsAgainstHumanity });
 

  })
  /*
 

  setTimeout(() => {
    io.to(socket.id).emit("init", {
      uuid: socket.id,
      game: CardsAgainstHumanity,
    });
  }, 1);

  socket.on("add-player", (message) => {
    let { uuid, name } = message;
    let player = CardsAgainstHumanity.addPlayer(uuid, name, socket.id);

  })


  console.log("a user connected", socket.id);



  

  socket.on("add-player", (message) => {
    let { uuid, name } = message;
    let player = CardsAgainstHumanity.addPlayer(uuid, name, socket.id);
    if (CardsAgainstHumanity.players.length == 1) {
      CardsAgainstHumanity.start();
      for (let player of CardsAgainstHumanity.players) {
        //console.log(player.socketId,JSON.parse(JSON.stringify(player)))
        io.to(player.socketId).emit(
          "update-player",
          JSON.parse(JSON.stringify(player))
        );
      }
      //io.emit("update", { game: CardsAgainstHumanity });
    }
    updateGame()

    setTimeout(() => {
      io.to(socket.id).emit("update-player", player);
    }, 1);
  });

  socket.on("start-game", () => {
    CardsAgainstHumanity.start();

    for (let player of CardsAgainstHumanity.players) {
      //console.log(player.socketId,JSON.parse(JSON.stringify(player)))
      io.to(player.socketId).emit(
        "update-player",
        JSON.parse(JSON.stringify(player))
      );
    }
    updateGame()
  });
  
  socket.on("answer", (data) => {
    let { uuid, idx } = data;
    if (CardsAgainstHumanity.answer(data)) {
      updateGame()
      io.to(socket.id).emit(
        "update-player",
        CardsAgainstHumanity.getPlayer(uuid)
      );
    }

  });

  socket.on("voice", function (data) {
    var newData = data.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    for (const id in socketsStatus) {
      
      if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
        io.to(id).emit("voice-message", newData);
    }
  });

  socket.on("vote", (data) => {
    let { uuid, idx } = data;
    if (CardsAgainstHumanity.vote(data)) {
      updateGame()
      io.to(socket.id).emit(
        "update-player",
        CardsAgainstHumanity.getPlayer(uuid)
      );
    }
  });

  socket.on("end-episode", () => {
    let player = CardsAgainstHumanity.endEpisode();
    updateGame()
    io.to(player.socketId).emit(
      "update-player",
      CardsAgainstHumanity.getPlayer(player.uuid)
    );
  });

  socket.on("step", () => {
    CardsAgainstHumanity.step();
    for (let player of CardsAgainstHumanity.players) {
      //console.log(player.socketId,JSON.parse(JSON.stringify(player)))
      io.to(player.socketId).emit(
        "update-player",
        JSON.parse(JSON.stringify(player))
      );
    }
    updateGame()
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!", socket.id);
    delete socketsStatus[socketId];
    for (let i = 0; i < CardsAgainstHumanity.players.length; i++) {
      if (CardsAgainstHumanity.players[i].socketId == socket.id) {
        CardsAgainstHumanity.players[i].active = false;
        try {
          //CardsAgainstHumanity.players.splice(i,1)
          if (
            CardsAgainstHumanity.episode.player_answers.length ==
            CardsAgainstHumanity.players.filter((el) => el.active).length
          ) {
            CardsAgainstHumanity.episode.state = "vote";
          }
          if (
            CardsAgainstHumanity.episode.player_votes.length ==
            CardsAgainstHumanity.players.filter((el) => el.active).length
          ) {
            CardsAgainstHumanity.episode.state = "complete";
          }
          io.emit("update", { game: CardsAgainstHumanity });
          console.log("found the fucker", socket.id);
          break;
        } catch (ex) {}
      }
    }
  });
});
*/

httpServer.listen(port, () => console.log(`listening on port ${port}`));
