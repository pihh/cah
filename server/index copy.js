const cards = require("./constants/cards");
const Game = require("./src/game");
const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

const port = process.env.PORT || 3000;

const CardsAgainstHumanity = new Game();

const socketsStatus = {};

io.on("connection", (socket) => {
  const socketId = socket.id;

  socketsStatus[socket.id] = {
    online: true,
    mute: false,
  };

  console.log("a user connected", socket.id);


  function updateGame(){
    if(!CardsAgainstHumanity.episode){
      CardsAgainstHumanity.step()
    }
    io.emit("update", { game: CardsAgainstHumanity });
  }
  setTimeout(() => {
    io.to(socket.id).emit("init", {
      uuid: socket.id,
      game: CardsAgainstHumanity,
    });
  }, 1);

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

httpServer.listen(port, () => console.log(`listening on port ${port}`));
