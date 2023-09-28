import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
// let environmentPath:string = "../../environments/environment"
// if(!isDevMode()) {

//   environmentPath = "../../environments/environment.prod"
// }
// const environment = import(environmentPath)

@Injectable({
  providedIn: 'root',
})
export class GameService {
  player = {};
  game = {};
  socket: any;

  public round = 0;
  public score = 0;

  //public socketUrl = 'http://localhost:3000';
  public socketUrl:any = "https://cards-against-humanity-concept.adaptable.app/";
  public environment: any;
  //public socketUrl:any = environment.socketUrl//"https://cards-against-humanity-concept.adaptable.app/";

  connection = localStorage.getItem('connection-identifier') || '';
  username = localStorage.getItem('username-identifier') || '';

  // Observers
  public init$: BehaviorSubject<string> = new BehaviorSubject('');
  public game$: BehaviorSubject<string> = new BehaviorSubject('');
  public audio$: BehaviorSubject<string> = new BehaviorSubject('');
  public player$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
    //this.connect();
    this.boot();
  }

  boot() {
    /* @ts-ignore */
    // this.socketUrl = environment.socketUrl
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
    console.log({ environment });
    this.connection = localStorage.getItem('connection-identifier') || '';
    this.username = localStorage.getItem('username-identifier') || '';

    if (!this.socket) {
      console.log(this.socketUrl);
      this.socket = io(this.socketUrl);

      this.socket.on('connect', () => {
        // console.log('connected')
        this.socket.emit('handshake', {
          uuid: localStorage.getItem('connection-identifier') || '',
          username: localStorage.getItem('username-identifier') || '',
        });
      });

      this.socket.on('reconnect', () => {
        this.socket.emit('handshake', {
          uuid: localStorage.getItem('connection-identifier') || '',
          username: localStorage.getItem('username-identifier') || '',
        });
      });

      this.socket.on('identified', (data: any) => {
        console.log('identified', data);
        this.setConnection(data.uuid);
        this.setUsername(data.username);
        this.socket.emit('join');
      });
    }
  }

  public updateUsername() {
    this.socket.emit('update-username', this.username);
  }

  public onUpdate() {
    this.socket.on('update-game', (game: any) => {
      // console.log('update-game',game)
      console.log('update-game', game);
      if (game) {
        this.round = game.history.length + 1;
        this.game$.next(game);
      }
    });
    return this.game$.asObservable();
  }

  public onUpdatePlayer() {
    this.socket.on('update-player', (data: any) => {
      if (data) {
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
