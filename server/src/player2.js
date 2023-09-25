class Player{

	socketId;
	username;
	uuid;

	online = false;
	mute = false;
	game = undefined;

	hand = []

  canAnswer = true;
  canVote = true;
	constructor(username,uuid,socketId){
		this.username = username
		this.uuid = uuid
		this.socketId = socketId
	}

	reset(){
		this.hand = [];
		this.score = 0
	}

	drawCallbackTimeoutFn = undefined;
	draw(card,callback){
		this.hand.push(card);
		if(callback){
			if(this.drawCallbackTimeoutFn){
				clearTimeout(this.drawCallbackTimeoutFn);
			}
			this.drawCallbackTimeoutFn = setTimeout(()=>{
				callback()
				clearTimeout(this.drawCallbackTimeoutFn);
			},1)
		}
	}

	setProp(prop,value,callback){
		this[prop]=value
		if(callback){
			callback(this)
		}
	}
	setSocketId(socketId, callback){
		this.setProp('socketId',socketId,callback)
	}

  setUsername(username, callback){
    this.setProp('username',username,callback)
  }

	setOnline(online,callback){
		this.setProp('online',online,callback)
	}

	setMute(mute,callback){
		this.setProp('mute',mute,callback)
	}

	join(game, callback){
    console.log('join',game.id)
    this.canAnswer = true;
    this.canVote = true;
    if(this.game == game.id){
      //
    }else{
      this.reset();
    }
		this.game = game.id
		if(game){
			this.setOnline(true)
			game.addPlayer(this)
			
		}else{
			this.setOnline(false)
		}
    if(callback){
      callback()
    }
	}

	reset(game){
    this.hand = []
    this.score = 0;
    this.canAnswer = true;
    this.canVote = true;
		if(game){
      this.game = game.id
			game.addPlayer(this)
		}
	}

	
}

module.exports = Player

/*
const crypto = require('crypto');


class Player {
  hand = [];
  score = 0;
  active = true;
  canAnswer = true;
  canVote = true;
  id = "";
  uuid = "";
  name="";

  constructor(id,name,socketId) {
    this.id = id
    this.uuid = id
    this.name = name;
    this.socketId = socketId
    this.muted = false;
    this.online = true;
    
    //this.id = id;
  }

  join(game){

  }
  draw(card) {
    this.hand.push(card);
  }

  reset() {
    this.hand = [];
    this.score = 0;
  }

  answer(handId) {
    if(this.canAnswer){
        this.canAnswer = false
        //console.log(this.hand.length)
        return this.hand.splice(handId, 1)[0];
    }
    return false
  }

  vote() {
    if(this.canVote){
        this.canVote = false
        //console.log(this.hand.length)
        //return this.hand.splice(handId, 1)[0];
        return true
    }
    return false
  }
}

module.exports = Player;
*/