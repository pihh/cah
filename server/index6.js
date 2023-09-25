const app = require("express")();
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});
const port = process.env.PORT || 3000;

// const Game = require("./src/game3");
const GameManager = require("./src/game4")
const Game = new GameManager()

Game.on('update-player', function(data){
  console.log('manager event -> update-player', data)
  try{

    io.to(data.player.socketId).emit('update-player',data)
  }catch(ex){
    // ...
  }
})

Game.on('update-game', function(data){
  console.log('manager event -> update-game', data)
  try{

    io.emit('update-game',data)
  }catch(ex){
    // ...
  }
})

io.on('connection', (socket) => {
  console.log('new connection',socket.id);

  socket.on('handshake', (data)=> {
    const player = Game.playerManager.registerPlayer(data.uuid,data.username,socket.id)
    console.log('handshake', data);
    io.to(socket.id).emit("identified", player);

  })

  socket.on('join', (data)=> {
    const player = Game.playerManager.getPlayer(socket.id)
    console.log('join', player);
    Game.join(player)
  })

  socket.on('update-username',(data)=>{
    const player = Game.playerManager.getPlayer(socket.id)
    console.log('update-username', player);
    Game.updateUsername(player,data)
  })

  socket.on('answer', (data)=> {
    const player = Game.playerManager.getPlayer(socket.id)
    console.log('answer', data);
    Game.answer(player,data)
    //io.to(socket.id).emit("identified", player);

  })

  socket.on('vote', (data)=> {
    const player = Game.playerManager.getPlayer(socket.id)
    console.log('vote', data);
    Game.vote(player,data)


  })

  socket.on("disconnect", () => {
    
    console.log("disconnected", socket.id);
    let player = Game.playerManager.getPlayer(socket.id)
    if(player){
      Game.leave(player)//.online = false;
    }
   
  })

});

httpServer.listen(port, () => console.log(`listening on port ${port}`));
