import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor() {
    console.log(this, 'gameService');
  }

  public connection = localStorage.getItem('connection-identifier') || '';

  public init$: BehaviorSubject<string> = new BehaviorSubject('');
  public game$: BehaviorSubject<string> = new BehaviorSubject('');
  public player$: BehaviorSubject<string> = new BehaviorSubject('');

  socket = io('http://localhost:3000');

  private setConnection(uuid: any) {
    if (this.connection) {
      return this.connection;
    } else {
      uuid += (Math.random() + 1).toString(36).substring(7);
      localStorage.setItem('connection-identifier', uuid);
      this.connection = uuid;
      return uuid;
    }
  }
  public onInit() {
    this.socket.on('init', (data: any) => {
      let { uuid, game } = data;
      this.setConnection(uuid);

      this.init$.next(game);
      const name = localStorage.getItem('playerName');
      if (name) {
        this.addPlayer(name);
      }
    });
    return this.init$.asObservable();
  }

  public onUpdate() {
    this.socket.on('update', (data: any) => {
      let { game } = data;
      this.game$.next(game);
    });
    return this.game$.asObservable();
  }

  public onUpdatePlayer() {
    this.socket.on('update-player', (data: any) => {
      this.player$.next(data);
    });
    return this.player$.asObservable();
  }

  public addPlayer(name: string) {
    this.socket.emit('add-player', { uuid: this.connection, name });
  }

  public startGame() {
    this.socket.emit('start-game');
  }

  public step() {
    this.socket.emit('step');
  }

  public endEpisode() {
    this.socket.emit('end-episode');
  }

  public vote(idx: any) {
    this.socket.emit('vote', { uuid: this.connection, idx: idx });
  }
  public answer(idx: any) {
    this.socket.emit('answer', { uuid: this.connection, idx: idx });
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
