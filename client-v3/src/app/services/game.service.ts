
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { GAME, PLAYER } from '../data/game.data';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // Game state
  public player: any = PLAYER;
  public game: any = GAME;
  public round = 0;
  public score = 0;

  // Connections
  public socket: any;
  public identified: boolean = false;
  public environment: any = environment;
  public connection = localStorage.getItem('connection-identifier') || '';
  public username = localStorage.getItem('username-identifier') || '';
  //public socketUrl: any = "http://localhost:3000/";
  // public socketUrl: any = environment.socketUrl;
  public socketUrl: any = "https://cards-against-humanity-concept.adaptable.app/";

  // Observers
  public init$: BehaviorSubject<any> = new BehaviorSubject(false);
  public game$: BehaviorSubject<string> = new BehaviorSubject('');
  public audio$: BehaviorSubject<string> = new BehaviorSubject('');
  public player$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
    //this.connect();
    this.audioElement = document.createElement('audio');
    this.audioElement.setAttribute('controls', ''); //add controls
    this.boot();
  }

  boot() {
    /* @ts-ignore */
    this.connect();
  }

  setConnection(connection: any) {
    this.connection = connection;
    localStorage.setItem('connection-identifier', connection);
  }
  setUsername(username: any) {

    if(username && username.trim() !== this.username.trim()){
      this.username = username.trim();
      localStorage.setItem('username-identifier', username.trim());
    }
  }

  connect() {
    this.connection = localStorage.getItem('connection-identifier') || '';
    this.username = localStorage.getItem('username-identifier') || '';

    if (!this.socket) {

      this.socket = io(this.socketUrl);

      this.socket.on('connect', () => {
        console.log('connected')
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
        console.log('identified',data);
        this.setConnection(data.uuid);
        this.setUsername(data.username);
        this.identified = true;
        // if(!this.identified){

        //   this.identified = true;
        //   setTimeout(() => {

        //     this.init$.next(this.identified);
        //   }, 500)
        // }

      });


    }
  }

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                AUDIO PARAMETERS                                ||
  // ! ||--------------------------------------------------------------------------------||

  private audioElement: any = document.createElement('audio');
  private audioUrl: any;

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                  SOCKET EVENTS                                 ||
  // ! ||--------------------------------------------------------------------------------||

  public updateEventIds: any[] = []
  public updateUsername() {
    this.socket.emit('update-username', this.username);
  }
  public setAndUpdateUsername(username: string) {
    if(username){

      this.setUsername(username);
      this.updateUsername()
    }
  }

  public onInit() {
    this.socket.on('identified', (data: any) => {

      setTimeout(() => {
        this.init$.next(this.identified);
      }, 500)
    });
    return this.init$.asObservable();
  }

  public onUpdate() {
    this.socket.on('update-game', (game: any) => {

      try {
        if (game) {
          if (this.updateEventIds.indexOf(game.eventUuid) === -1) {
            console.log('update-game-subscription', game.lastEpisodeResult)
            this.updateEventIds.push(game.eventUuid);
            this.game = game
            this.round = game.history.length + 1;
            this.game$.next(game);
          }
        }
      } catch (ex) {
        console.warn(ex)
      }
    });
    return this.game$.asObservable();
  }

  public onUpdatePlayer() {
    this.socket.on('update-player', (data: any) => {
      if (data) {
        if (this.updateEventIds.indexOf(data.eventUuid) === -1) {


          this.updateEventIds.push(data.eventUuid)
          this.player = data.player
          this.score = data.player.score;
          this.player$.next(data.player);

        }
      }
    });
    return this.player$.asObservable();
  }

  public onVoiceMessage() {
    this.socket.on('voice-message', (data: any) => {
      if (data) {
        try {
          this.audioUrl = data//URL.createObjectURL(data);
          this.audioElement.src = this.audioUrl;

          this.audioElement.play().then(() => {
            this.audio$.next('complete')
          }).catch((ex:any) => {
            console.warn(ex)
          })

        } catch (ex) {
          console.warn(ex);
        }

      }
    })
    return this.audio$.asObservable();
  }

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                     ACTIONS                                    ||
  // ! ||--------------------------------------------------------------------------------||

  public join() {
    this.socket.emit('join');
  }

  public vote(idx: any) {
    this.socket.emit('vote', idx);
  }

  public answer(idx: any) {
    this.socket.emit('answer', idx);
  }

  public sendVoiceMessage(data: any) {
    this.socket.emit('voice', data)
  }

  /*
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
  */
}
