const cards = require("./constants/cards");
const Game = require("./src/game");
const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

const port = process.env.PORT || 3000;

const CardsAgainstHumanity = new Game();

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  
  setTimeout(()=>{
    io.to(socket.id).emit("init", {uuid:socket.id,game:CardsAgainstHumanity});
  },1)

  socket.on("add-player", (message) => {
    let {uuid,name} = message 
    let player = CardsAgainstHumanity.addPlayer(uuid,name,socket.id)

    io.emit('update', {game:CardsAgainstHumanity})
    setTimeout(()=>{
        io.to(socket.id).emit('update-player', player)
    },1)
  });

  socket.on('start-game', ()=>{
    CardsAgainstHumanity.start()
    for(let player of CardsAgainstHumanity.players){
        //console.log(player.socketId,JSON.parse(JSON.stringify(player)))
        io.to(player.socketId).emit('update-player', JSON.parse(JSON.stringify(player)))
    }
    io.emit('update',{game:CardsAgainstHumanity})
  })

  socket.on('answer', (data)=>{
    let {uuid,idx} = data
    if(CardsAgainstHumanity.answer(data)){
        io.emit('update',{game:CardsAgainstHumanity})
        io.to(socket.id).emit('update-player', CardsAgainstHumanity.getPlayer(uuid))
    }
    /*for(let player of CardsAgainstHumanity.players){
        console.log(player.socketId,JSON.parse(JSON.stringify(player)))
        io.to(player.socketId).emit('update-player', JSON.parse(JSON.stringify(player)))
    }
    io.emit('update',{game:CardsAgainstHumanity})
    */
  })

  socket.on('vote', (data)=>{
    let {uuid,idx} = data
    if(CardsAgainstHumanity.vote(data)){
        io.emit('update',{game:CardsAgainstHumanity})
        io.to(socket.id).emit('update-player', CardsAgainstHumanity.getPlayer(uuid))
    }

  })

  socket.on('end-episode', ()=>{
    let player = CardsAgainstHumanity.endEpisode()
    io.emit('update',{game:CardsAgainstHumanity})
    io.to(player.socketId).emit('update-player', CardsAgainstHumanity.getPlayer(player.uuid))
  })

  socket.on('step', ()=>{
    CardsAgainstHumanity.step()
    for(let player of CardsAgainstHumanity.players){
        //console.log(player.socketId,JSON.parse(JSON.stringify(player)))
        io.to(player.socketId).emit('update-player', JSON.parse(JSON.stringify(player)))
    }
    io.emit('update',{game:CardsAgainstHumanity})
  })

  socket.on("disconnect", () => {
    console.log("a user disconnected!", socket.id);
    for(let i = 0; i < CardsAgainstHumanity.players.length; i++) {
        if(CardsAgainstHumanity.players[i].socketId == socket.id) {
            CardsAgainstHumanity.players[i].active = false
            //CardsAgainstHumanity.players.splice(i,1)
            if(CardsAgainstHumanity.episode.player_answers.length == CardsAgainstHumanity.players.filter(el => el.active).length){
              CardsAgainstHumanity.episode.state = "vote"
            }
            if(CardsAgainstHumanity.episode.player_votes.length == CardsAgainstHumanity.players.filter(el => el.active).length){
              CardsAgainstHumanity.episode.state = "complete"
            }
            io.emit('update', {game:CardsAgainstHumanity})
            console.log('found the fucker', socket.id)
            break
        }
    }
  });
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));
