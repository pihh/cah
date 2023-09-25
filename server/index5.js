const app = require("express")();
const httpServer = require("http").createServer(app);

const Game = require("./src/game3");
const crypto = require("crypto");
const Player = require("./src/player2");
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});
const port = process.env.PORT || 3000;


const GameServer = new Game();

let lastGameServerUpdate = "";

const playerUpdates = []

GameServer.on("update-player", (data) => {
  // console.log(data.socketId,socket.id)
  console.log('update-player',data.uuid)
  data.updateId = crypto.randomUUID()
  data.players = GameServer.manager.PlayersByIndex.length
  io.to(data.socketId).emit("update-player", data);
});

GameServer.on("update-game", (data) => {
  if (data && data.updateId != lastGameServerUpdate) {
    
    lastGameServerUpdate = data.updateId;
    io.emit("update-game", data);
  }
});

io.on('connection', (socket) => {
  const firstConnection = socket.handshake.query.connection ? false : true;
  const socketUuid = socket.handshake.query.connection  || ""; //|| false; //crypto.randomUUID();
  const username = socket.handshake.query.username || ""; //|| false; //uniqueNamesGenerator(config)
  const socketId = socket.id;

  socket.on('disconnect', () =>{
    console.log("disconnected", socket.id);
    if(socket.id in GameServer.manager.PlayersBySocket){
      let player = GameServer.manager.PlayersBySocket[socket.id];
      player = GameServer.manager.PlayersById[player.uuid];
      player.setOnline(false);
      GameServer.manager.updatePlayerById(player.uuid)
    }
    GameServer.action = 'disconnect'
    io.emit('update-game',GameServer.data())

  
  })
  socket.on('join',function(){
    console.log('join',)
    let player = GameServer.manager.PlayersByIndex.filter(el => el.socketId === socket.id)[0]
    
    if(player){
      GameServer.addPlayer(player);

    }
  })
  
  socket.on('register-player',function(data){
    console.log('register-player', data)
    let player = GameServer.registerPlayer(socket.id,data.connection,data.username);
    io.to(socket.id).emit('connected',player);

  })

  socket.on("answer", (data) => {
    console.log({data})
    //let { uuid, idx } = data;
    //console.log(uuid,idx)
    let uuid = GameServer.manager.PlayersBySocket[socket.id].uuid
    if (GameServer.answer(uuid,data)) {
      //updateGame()
      io.to(socket.id).emit(
        "update-player",
        GameServer.manager.PlayersById[uuid]
      );
      io.emit('update-game',GameServer.data())
    }

  });

  socket.on("vote", (data) => {
    let uuid = GameServer.manager.PlayersBySocket[socket.id].uuid
    if (GameServer.vote(uuid,data)) {
      // updateGame()
      io.to(socket.id).emit(
        "update-player",
        GameServer.manager.PlayersById[uuid]
      );
      
      io.emit('update-game',GameServer.data())
    }
  });
  socket.on("forceDisconnect", function () {
    
    GameServer.manager.deletePlayer(socket.id);
    socket.disconnect();
    /*
    for(let key of Object.keys(Players)){
      let _player = Players[key];
      if(_player.uuid == socket.id){
        delete Players[key]
      }
    }
    */
  });
  
})

/*
let lastGameServerUpdate = "";

const playerUpdates = []


// OUTCOMING
GameServer.on("register-player", (data) => {
  //if(player && data.uuid === player.uuid) {
    // console.log('reg-p',data.socketId,socket.id)
    // console.log('reg-p',firstConnection,socket.id,data.connection,socketUuid)
  io.to(data.socketId).emit("register-player", {
    connection: data.connection,
    socketId: data.socketId,
    username:data.username,
    player:data.player,
  });
  //}
});
GameServer.on("connected", (data) => {
  //console.log("connected", data);
  //if(data.uuid === player.uuid) {

  io.to(data.socketId).emit("connected", {
    connection: data.uuid,
    socketId: data.socketId,
    username: data.username,
    player: data,
  });
  //}
});

GameServer.on("update-player", (data) => {
  // console.log(data.socketId,socket.id)
  console.log('update-player',data.uuid)
  data.updateId = crypto.randomUUID()
  data.players = GameServer.manager.PlayersByIndex.length
  io.to(data.socketId).emit("update-player", data);
});

GameServer.on("update-game", (data) => {
  if (data && data.updateId != lastGameServerUpdate) {
    //console.log("update-game", data);
    lastGameServerUpdate = data.updateId;
    io.emit("update-game", data);
  }
});

io.on("connection", (socket) => {
  const firstConnection = socket.handshake.query.connection ? false : true;
  const socketUuid = socket.handshake.query.connection  || ""; //|| false; //crypto.randomUUID();
  const username = socket.handshake.query.username || ""; //|| false; //uniqueNamesGenerator(config)
  const socketId = socket.id;
  console.log(socket.handshake.query)
  let player = GameServer.registerPlayer(socketId, socketUuid, username);
  
  console.log(socket.id,socket.handshake.query,firstConnection)

  

  // INCOMING 
  socket.on("update-player", (data) => {
    let { uuid, username } = data;
    let player = GameServer.manager.PlayersById[uuid]
    player.socketId = socket.id;
    player.username = username;
    player.online = true;
    GameServer.manager.updatePlayerById(player)
    io.to(socket.id).emit('connected',{
      connection: player.uuid,
      socketId: player.socketId,
      username: player.username,
      player: player,
    })
    io.to(player.socketId).emit('update-player', player);
    io.emit('update-game')
    /*
    if (uuid in this.PlayersById == false) {

      let player = this.GameServer.manager.PlayersById[uuid]
      player.socketId = socket.id;
      player.online = true;
      player.username = username;
      this.PlayersById[uuid] = player;
    }
    ª/
    // if (GameServer.answer(data)) {
    //   //updateGame()
    //   io.to(socket.id).emit(
    //     "update-player",
    //     GameServer.manager.PlayersById[uuid]
    //   );
    //   io.emit('update-game',GameServer.data())
    // }
*
  });
  socket.on("answer", (data) => {
    let { uuid, idx } = data;
    if (GameServer.answer(data)) {
      //updateGame()
      io.to(socket.id).emit(
        "update-player",
        GameServer.manager.PlayersById[uuid]
      );
      io.emit('update-game',GameServer.data())
    }

  });

  // socket.on("voice", function (data) {
  //   var newData = data.split(";");
  //   newData[0] = "data:audio/ogg;";
  //   newData = newData[0] + newData[1];

  //   for (const id in socketsStatus) {
      
  //     if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
  //       io.to(id).emit("voice-message", newData);
  //   }
  // });

  socket.on("vote", (data) => {
    let { uuid, idx } = data;
    if (GameServer.vote(data)) {
      // updateGame()
      io.to(socket.id).emit(
        "update-player",
        GameServer.manager.PlayersById(uuid)
      );
      
      io.emit('update-game',GameServer.data())
    }
  });
  socket.on("forceDisconnect", function () {
    
    GameServer.manager.deletePlayer(socket.id);
    socket.disconnect();
    /*
    for(let key of Object.keys(Players)){
      let _player = Players[key];
      if(_player.uuid == socket.id){
        delete Players[key]
      }
    }
    *
  });

  socket.on("disconnect", () => {
    
    console.log("disconnected", socket.id);
    if(socket.id in GameServer.manager.PlayersBySocket){
      let player = GameServer.manager.PlayersBySocket[socket.id];
      player = GameServer.manager.PlayersById[player.uuid];
      player.setOnline(false);
      GameServer.manager.updatePlayerById(player.uuid)
    }
    GameServer.action = 'disconnect'
    io.emit('update-game',GameServer.data())

  })

})
 */

httpServer.listen(port, () => console.log(`listening on port ${port}`));
