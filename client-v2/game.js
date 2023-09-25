import "./style.scss";

import { Player } from "./player";
import { uuid } from "./utils";
import {CARDS} from './cards';
export class Game{

	cards = CARDS;
	questions = [];
	answers = [];
	players = [];

	history = [];
	lastEpisodeResult = {}
	episode = {
		question: {text:"question"},
		answers: [],
		player_answers: [],
		player_votes: [],
		state: "answer", // Answer , Vote , Results, End
		result: {
			state: "winner", // "winner","draw","failed"
			winner: {},
			question: {},
			answer: {},
			votes: 0
		}
	}

	constructor(){
		this.id = uuid(); 
	}

	nextEpisode(){
		this.episode = {
			question: {text:"question"},
			answers: [],
			player_answers: [],
			player_votes: [],
			state: "answer", // Answer , Vote , Results, End
			result: {
				state: "winner", // "winner","draw","failed"
				winner: {},
				question: {},
				answer: {},
				votes: 0
			}
		}
	}

	reset(){
		this.cards = CARDS
		this.score = {}
		this.questions = this.shuffle(
		  this.cards.filter((el) => el.cardType === 'Q')
		);
		this.answers = this.shuffle(this.cards.filter((el) => el.cardType === 'A'));
		for (let i = 0; i < this.players.length; i++) {
		  this.players[i].reset();
		  for (let j = 0; j < 9; j++) {
			this.players[i].draw(this.answers.pop(0));
		  }
		}
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

	get running(){
		try{
			return this.onlinePlayers.length > 0;
		}catch(ex){
			return false
		}
	}

	get onlinePlayers(){
		try{
			return this.players.filter((el)=> el.online)
		}catch(ex){
			return []
		}
	}


}
