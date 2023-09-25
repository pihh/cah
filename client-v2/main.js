import "./style.scss";

import { io } from "socket.io-client";
import { Game } from "./game";

/*
window.game = new Game()
console.log({window,self:this,game:new Game()})
*/

class GameClient {
  connection = localStorage.getItem("connection-identifier") || "";
  username = localStorage.getItem("username-identifier") || "";

  player={}
  game={}

  constructor() {
    this.connect();
  }

  connect(){
	if(this.socket){
		this.socket.emit('forceDisconnect');
	}
	this.socket = io("http://localhost:3000", {
      query: {
        connection: this.connection,
        username: this.username,
      },
    });

	this.socket.on('register',(data)=>{
		this.setConnection(data.connection);
		this.setUsername(data.username);
		this.connect();
	})

	this.socket.on('update-game',(data)=>{
		console.log('update-game',data.episode.state);
		console.log('update-game',data.episode);
		this.game = data
	})
	this.socket.on('update-player',(data)=>{
		console.log('update-player',data);
		this.player = data
	})
	this.socket.on('connected',(data)=>{
		//this.setConnection(data.connection);
		//this.setUsername(data.username);
		//this.connect();
		setTimeout(()=>{
			this.socket.emit('answer',1)

			setTimeout(()=>{
				this.socket.emit('vote',0)
			},100)
		},100)
	})
  }

  answer(){

  }
}

const game = new GameClient();
/*
export class GameClient {
  connection = localStorage.getItem("connection-identifier") || "";
  username = localStorage.getItem("username-identifier") || "";

  constructor() {
    if (this.connection !== "" && this.name !== "") {
      this.connect();
    } else {
      this.ping();
    }
  }

  ping() {
	console.log('pinging')
    this.socket = io("http://localhost:3000", {
      query: {
        connection: "",
        username: "",
      },
    });
	this.socket.on("ping",(data)=>{
		console.log('ping',data)
		this.setConnection(data.connection);
		this.setUsername(data.username);
		this.connect();
	})
  }
  connect() {
	console.log('connecting')
	if(this.socket){
		this.socket.emit('forceDisconnect');
	}
	this.socket = io("http://localhost:3000", {
      query: {
        connection: this.connection,
        username: this.username,
      },
    });
	this.socket.on("connected",(data)=> {
		console.log('connected',data)
	})
	this.socket.on('update-player',(data)=>{
		console.log('update-player',data)
	})
	this.socket.on('update-game',(data)=>{
		console.log('update-game',data)
	})
  }

  setConnection(connection){
	this.connection = connection;
	localStorage.setItem("connection-identifier",connection) 
  }
  setUsername(username){
	this.username = username;
	localStorage.setItem("username-identifier",username) 
  }
}

let game = new GameClient()
/*
const connection = localStorage.getItem('connection-identifier') || "" //(Math.random() + 1).toString(36).substring(7)+ Date.now();
const name = localStorage.getItem('name-identifier') || "" //(Math.random() + 1).toString(36).substring(7)+ Date.now();
//localStorage.setItem('connection-identifier', connection)
//localStorage.setItem('name-identifier', name)

this.playerName = name;
this.socket = io('http://localhost:3000',{

  query: {
	"connection": connection,
	"name":name
  }
});

*/
