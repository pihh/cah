import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})

export class GameService {
  player = {};
  game = {};
  socket: any;

  public round = 0;
  public score = 0;

  connection = localStorage.getItem('connection-identifier') || '';
  username = localStorage.getItem('username-identifier') || '';


  // Observers
  public init$: BehaviorSubject<string> = new BehaviorSubject('');
  public game$: BehaviorSubject<string> = new BehaviorSubject('');
  public audio$: BehaviorSubject<string> = new BehaviorSubject('');
  public player$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
    this.connect();
  }


  setConnection(connection: any) {
    this.connection = connection;
    localStorage.setItem('connection-identifier', connection);
  }
  setUsername(username: any) {
    this.username = username;
    localStorage.setItem('username-identifier', username);
  }

  connect() {

    this.connection = localStorage.getItem('connection-identifier') || '';
    this.username = localStorage.getItem('username-identifier') || '';

    if(!this.socket){

      this.socket = io('http://localhost:3000');

      this.socket.on('connect',()=>{
        // console.log('connected')
        this.socket.emit('handshake',{
          uuid: localStorage.getItem('connection-identifier') || '',
          username: localStorage.getItem('username-identifier') || ''
        })
      })

      this.socket.on('identified', (data:any)=>{
        // console.log('identified',data)
        this.setConnection(data.uuid)
        this.setUsername(data.username)
        this.socket.emit('join')
      })
    }


  }

  public updateUsername(){
    this.socket.emit('update-username', this.username)
  }


  public onUpdate() {
    this.socket.on('update-game', (game: any) => {
      // console.log('update-game',game)
      if(game){
        this.round = game.history.length + 1;
        this.game$.next(game);
      }
    });
    return this.game$.asObservable();
  }



  public onUpdatePlayer() {
    this.socket.on('update-player', (data: any) => {

      if(data){
        this.score = data.player.score;
        this.player$.next(data.player);
      }
    });
    return this.player$.asObservable();
  }

  public vote(idx: any) {
    this.socket.emit('vote', idx);
  }
  public answer(idx: any) {
    this.socket.emit('answer', idx);
  }

  handReset: EventEmitter<any> = new EventEmitter();
  transitionToVotePage: EventEmitter<any> = new EventEmitter();
  transitionToGamePage: EventEmitter<any> = new EventEmitter();

  emitHandReset() {
    this.handReset.emit();
  }
  getResetHandEmiter() {
    return this.handReset;
  }

  emitTransitionToVotePage() {
    this.transitionToVotePage.emit();
  }
  getTransitionToVotePageEmiter() {
    return this.transitionToVotePage; //.emit();
  }

  emitTransitionToGamePage() {
    this.transitionToGamePage.emit();
  }
  getTransitionToGamePageEmiter() {
    return this.transitionToGamePage; //.emit();
  }
}
