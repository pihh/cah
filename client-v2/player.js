import "./style.scss";


export class Player{

	socketId;
	name;
	uuid;

	online = false;
	mute = false;
	game = undefined;

	hand = []

	constructor(name,uuid){
		this.name = name
		this.uuid = uuid
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

	setOnline(online,callback){
		this.setProp('online',online,callback)
	}

	setMute(mute,callback){
		this.setProp('mute',mute,callback)
	}

	join(game){
		this.setOnline(true)
		this.game = game
		if(game){
			this.setOnline(true)
			game.addPlayer(this)
			
		}else{
			this.setOnline(false)
		}
	}

	reset(game){
		this.game = game
		if(game){
			game.addPlayer(this)
		}
	}

	
}