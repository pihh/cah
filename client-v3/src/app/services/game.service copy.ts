
  /*
  constructor() {
    console.log(this, 'gameService');

    // socket.on("send", function (data) {
    //   var audio = new Audio(data);
    //   audio.play();
    // });
    const connection = localStorage.getItem('connection-identifier') || "" //(Math.random() + 1).toString(36).substring(7)+ Date.now();
    const name = localStorage.getItem('name-identifier') || "" //(Math.random() + 1).toString(36).substring(7)+ Date.now();
    //localStorage.setItem('connection-identifier', connection)
    //localStorage.setItem('name-identifier', name)
    this.connection = connection
    this.playerName = name;
    this.socket = io('http://localhost:3000',{

      query: {
        "connection": connection,
        "name":name
      }
    });
  }

  public playerName;
  public connection = localStorage.getItem('connection-identifier') || '';

  public init$: BehaviorSubject<string> = new BehaviorSubject('');
  public game$: BehaviorSubject<string> = new BehaviorSubject('');
  public audio$: BehaviorSubject<string> = new BehaviorSubject('');
  public player$: BehaviorSubject<string> = new BehaviorSubject('');

  socket:any //= io('http://localhost:3000');

  get connected(){
    try{
      return this.connection !='' && this.playerName !=''
    }catch(ex){
      return false
    }
  }



  public connect(playerName:string){

    localStorage.setItem('name-identifier',playerName)
    this.playerName = playerName
    this.socket = io('http://localhost:3000',{

      query: {
        "connection": this.connection,
        "name":this.playerName
      }
    });
  }

  private setConnection(uuid: any) {
    this.onChat()
    if (this.connection) {
      return this.connection;

    } else {
      uuid += (Math.random() + 1).toString(36).substring(7);
      localStorage.setItem('connection-identifier', uuid);
      this.connection = uuid;
      return uuid;
    }
  }

  public onChat() {
    let userStatus = { microphone: true, online: true };
    let socket = this.socket;
    function mainFunction(time: any) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        var madiaRecorder = new MediaRecorder(stream);
        madiaRecorder.start();

        var audioChunks: any = [];

        madiaRecorder.addEventListener('dataavailable', function (event) {
          audioChunks.push(event.data);
        });

        madiaRecorder.addEventListener('stop', function () {
          var audioBlob = new Blob(audioChunks);

          audioChunks = [];

          var fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = function () {
            if (!userStatus.microphone || !userStatus.online) return;

            var base64String = fileReader.result;

            socket.emit('voice', base64String);
          };

          madiaRecorder.start();

          setTimeout(function () {
            madiaRecorder.stop();
          }, time);
        });

        setTimeout(function () {
          madiaRecorder.stop();
        }, time);
      });
    }
    mainFunction(1000)
  }

  public onAudio(){
    this.socket.on('voice-message', (data:any)=>{
      this.audio$.next(data);
    })
    return this.audio$.asObservable()
  }
  public onInit() {
    this.socket.on('init', (data: any) => {
      let { uuid, game } = data;
      this.setConnection(uuid);

      this.init$.next(game);
      const name = localStorage.getItem('name-identifier');


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
*/

import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  connection = localStorage.getItem('connection-identifier') || '';
  username = localStorage.getItem('username-identifier') || '';

  player = {};
  game = {};

  socket: any;

  public init$: BehaviorSubject<string> = new BehaviorSubject('');
  public game$: BehaviorSubject<string> = new BehaviorSubject('');
  public audio$: BehaviorSubject<string> = new BehaviorSubject('');
  public player$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
    this.connect();
  }

  get playerName() {
    try {
      return this.username;
    } catch (ex) {
      return 'xx';
    }
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

      this.socket = io('http://localhost:3000', {
        query: {
          connection: this.connection,
          username: this.username,
        },
      });
      this.socket.on('connect',()=>{
        console.log('connection')
        this.socket.emit('register-player',{
          connection: this.connection,
          username: this.username
        })
      })
      this.socket.on('connected', (data: any) => {
        console.log('connected',{data})
        this.setConnection(data.uuid);
        this.setUsername(data.username);
        this.socket.emit('join')
      });
      /*
      this.socket.on('register-player', (data: any) => {
        console.log('register-player', data);
        this.setConnection(data.connection);
        this.setUsername(data.username);
        this.player = data.player

        this.socket.emit('update-player', {
          uuid: this.connection,
          username: this.username
        })
        //debugger;
        //this.connect();
        //debugger;
      });

      this.socket.on('connected', (data: any) => {
        console.log({data})
        this.setConnection(data.connection);
        this.setUsername(data.username);
      });
      console.log(this.socket)
      */
    }


  }

  public round = 0;
  public onUpdate() {
    this.socket.on('update-game', (game: any) => {
      console.log('update-game',game)
      if(game){
        this.round = game.history.length + 1;
        this.game$.next(game);
      }
    });
    return this.game$.asObservable();
  }

  public score = 0;
  public playerUpdates:any[] = []
  public onUpdatePlayer() {
    this.socket.on('update-player', (data: any) => {
      console.log('update-player',{data})
      if(this.playerUpdates.indexOf(data.updateId) == -1){
        this.playerUpdates.push(data.updateId);
        this.score = data.score;
        this.player$.next(data);
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

  /*
  constructor() {
    console.log(this, 'gameService');

    // socket.on("send", function (data) {
    //   var audio = new Audio(data);
    //   audio.play();
    // });
    const connection = localStorage.getItem('connection-identifier') || "" //(Math.random() + 1).toString(36).substring(7)+ Date.now();
    const name = localStorage.getItem('name-identifier') || "" //(Math.random() + 1).toString(36).substring(7)+ Date.now();
    //localStorage.setItem('connection-identifier', connection)
    //localStorage.setItem('name-identifier', name)
    this.connection = connection
    this.playerName = name;
    this.socket = io('http://localhost:3000',{

      query: {
        "connection": connection,
        "name":name
      }
    });
  }

  public playerName;
  public connection = localStorage.getItem('connection-identifier') || '';

  public init$: BehaviorSubject<string> = new BehaviorSubject('');
  public game$: BehaviorSubject<string> = new BehaviorSubject('');
  public audio$: BehaviorSubject<string> = new BehaviorSubject('');
  public player$: BehaviorSubject<string> = new BehaviorSubject('');

  socket:any //= io('http://localhost:3000');

  get connected(){
    try{
      return this.connection !='' && this.playerName !=''
    }catch(ex){
      return false
    }
  }



  public connect(playerName:string){

    localStorage.setItem('name-identifier',playerName)
    this.playerName = playerName
    this.socket = io('http://localhost:3000',{

      query: {
        "connection": this.connection,
        "name":this.playerName
      }
    });
  }

  private setConnection(uuid: any) {
    this.onChat()
    if (this.connection) {
      return this.connection;

    } else {
      uuid += (Math.random() + 1).toString(36).substring(7);
      localStorage.setItem('connection-identifier', uuid);
      this.connection = uuid;
      return uuid;
    }
  }

  public onChat() {
    let userStatus = { microphone: true, online: true };
    let socket = this.socket;
    function mainFunction(time: any) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        var madiaRecorder = new MediaRecorder(stream);
        madiaRecorder.start();

        var audioChunks: any = [];

        madiaRecorder.addEventListener('dataavailable', function (event) {
          audioChunks.push(event.data);
        });

        madiaRecorder.addEventListener('stop', function () {
          var audioBlob = new Blob(audioChunks);

          audioChunks = [];

          var fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = function () {
            if (!userStatus.microphone || !userStatus.online) return;

            var base64String = fileReader.result;

            socket.emit('voice', base64String);
          };

          madiaRecorder.start();

          setTimeout(function () {
            madiaRecorder.stop();
          }, time);
        });

        setTimeout(function () {
          madiaRecorder.stop();
        }, time);
      });
    }
    mainFunction(1000)
  }

  public onAudio(){
    this.socket.on('voice-message', (data:any)=>{
      this.audio$.next(data);
    })
    return this.audio$.asObservable()
  }
  public onInit() {
    this.socket.on('init', (data: any) => {
      let { uuid, game } = data;
      this.setConnection(uuid);

      this.init$.next(game);
      const name = localStorage.getItem('name-identifier');


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
  */
}
