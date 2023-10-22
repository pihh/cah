import { Component, ElementRef, ViewChild } from '@angular/core';

import { GAME, PLAYER } from './data/game.data';
import { animationSplashLeave } from './animations/splash';
import { animationPageAnswerEnter, animationPageAnswerLeave } from './animations/answer';
import { animationPageVoteEnter, animationPageVoteLeave } from './animations/vote';
import { getCardVisibility, getEdgesTranslate, getTranslate, onConfirm, onDiscard, onPanEnd, onPanMove, onPanStart, onSwipe } from './animations/pan';
import { pageResultsEnter, pageResultsLeave } from './animations/results';
import { GameService } from './services/game.service';
import { LogService } from './services/log.service';
import { VOICE } from './data/events.data';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  @ViewChild("playerHandSlider") playerHandSlider!: ElementRef;
  @ViewChild("voteListSlider") voteListSlider!: ElementRef;


  public player: any = PLAYER
  public game: any = GAME

  // APPLICATION STATE
  public controls: boolean = false;
  public isTransitioning = false;
  public isInitialized: boolean = false;
  public currentGamePage = "";
  public hasPlayer = false;
  public hasGame = false;
  public gameState: string = "state-loading"

  public handHidden = true
  public voteHidden = true;
  public playerHandSliderActive = false;

  // HEADER STATE
  public isShowingAction: boolean = false;
  public isSideMenuOpen: boolean = false;
  public headerMessage: string = "Swipe up."
  public pageMessage: boolean | string = false;

  public onToggleSideMenuEvent() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }


  // SUBSCRIPTIONS
  public playerUpdateSubscription: any;
  public gameUpdateSubscription: any;
  public audioSubscription: any;


  constructor(public gameService: GameService, public logService: LogService) {
    // Voice messages
    this.audioSubscription = this.gameService.onVoiceMessage().subscribe((data: any) => {
      try {
        console.log('audio recieved', data)

      } catch (e) {
      }
    })
    // Game messages
    this.gameUpdateSubscription = this.gameService.onUpdate().subscribe((data: any) => {

      try {

        if (typeof data == 'object' && data) {


          const state = data.episode.state;
          const eventName = data?.eventName || "answer"

          this.resetCounter(data.episode.timeout);

          if (state === "answer" || state === "vote") {
            if ((state === "answer" && !this.canAnswer) || (state === "vote" && !this.canVote)) {
              let missing_players = data.episode.missing_actions.length
              let total_players = data.players.length
              let pageMessage = "Waiting for " + missing_players + "/" + total_players + " player";
              pageMessage += missing_players > 1 ? "s." : "."
              this.pageMessage = pageMessage;
            }
          }
          if (data.episode.state !== this.currentGamePage) {
            this.currentGamePage = state;
            if (state === "answer") {
              if (eventName === "reset-countdown") {
                this.resetCounter();
              }

              this.pageAnswerEnter()
            } else if (state === "vote") {
              if (eventName === "reset-countdown") {
                this.resetCounter();
              }
              this.pageVoteEnter()
            } else if (state === "results") {
              this.pageResultsEnter()
            }
          }
          this.game = data;
        }
      } catch (ex) {
        // console.warn(ex)
        this.logService.warn(this, 'ngOnInit:gameUpdateSubscription', { ex })
      }
    });
    // Player events
    this.playerUpdateSubscription = this.gameService.onUpdatePlayer().subscribe((data: any) => {
      try {

        if (typeof data == 'object' && data) {
          //console.log('update player',data.hand.length)
          this.player = data;
          this.canAnswer = data.canAnswer;
          this.canVote = data.canVote;


        }
      } catch (ex) {
        this.logService.warn(this, 'ngOnInit:playerUpdateSubscription', { ex })
      }
    });

  }

  ngOnDestroy() {
    this.playerUpdateSubscription.unsubscribe();
    this.gameUpdateSubscription.unsubscribe();
    this.audioSubscription.unsubscribe();
  }

  // COMPUTED GETTERS/SETTERS
  get isSplashLoading() {
    try {
      return !this.gameService.identified
    } catch (ex) {
      return true;
    }
  }

  get playerName() {
    try {
      return this.player.username
    } catch (ex) {
      return ""
    }
  }
  get score() {
    try {
      return this.player.score
    } catch (ex) {
      return 0
    }
  }
  get round() {
    try {
      return this.game.history.length
    } catch (ex) {
      return 0
    }
  }

  get episodeAnswer() {
    try {
      return this.game.episode.result.answer.text
    } catch (ex) {
      return ""
    }
  }
  get episodeQuestion() {
    try {
      return this.game.episode.result.question.text
    } catch (ex) {
      return ""
    }
  }

  get episodeWinner() {
    try {
      return this.gameService.game.lastEpisodeResult.winner.username
    } catch (ex) {
      return "No winners"
    }
  }

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                   ROUND TIME                                   ||
  // ! ||--------------------------------------------------------------------------------||

  private counterResetTimeout: any;
  public resetCounterTimeout(seconds: number = 120) {

    clearTimeout(this.counterResetTimeout)
    this.counterResetTimeout = setTimeout(() => {
      this.resetCounter(seconds)
    }, 100)
  }

  public timeCounter: number = 120;
  public resetCounter(seconds: number = 120) {
    this.timeCounter = seconds
    clearInterval(this.timeInterval)
    this.timeInterval = setInterval(() => {
      if (this.timeCounter > 0) {
        this.timeCounter -= 1
      } else {
        clearInterval(this.timeInterval)
      }
    }, 1000)
  }

  public timeInterval: any;


  get roundTime() {
    try {
      let minutes = Math.floor(this.timeCounter / 60)
      let seconds: any = this.timeCounter % 60;
      if (seconds < 10) {
        seconds = "0" + seconds
      }
      return `${minutes}:${seconds}`
    } catch (ex) {
      return "0:00"
    }
  }

  get roundEnding() {
    return this.timeCounter < 30 && this.timeCounter > 0;
  }



  public onJoinEvent() {

    this.pageSplashLeave()
  }

  async wait(ms: any) {
    return new Promise((resolve: any) => {
      setTimeout(() => {
        resolve();
      }, ms)
    })
  }

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                 VOICE MESSAGES                                 ||
  // ! ||--------------------------------------------------------------------------------||

  public prevMessage: any;
  public onVoiceEventTimeout: any;
  public onVoiceEvent($event: any) {
    if (Object.values(VOICE).map((el: any) => el.message).indexOf(this.pageMessage) == -1) {
      this.prevMessage = this.pageMessage;
    }
    this.pageMessage = $event.message
    if ($event?.code == VOICE.CANCEL.code || $event?.code == VOICE.SENT.code) {
      clearTimeout(this.onVoiceEventTimeout);
      this.onVoiceEventTimeout = setTimeout(() => {
        if (this.pageMessage == $event.message) {
          this.pageMessage = this.prevMessage
        }
      }, 500)
    }

  }

  public onVoiceMessage($event: any) {
    this.logService.info(this, 'onVoiceMessage', $event)

    if ($event.success) {
      this.gameService.sendVoiceMessage($event.data)
    }
  }

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                 RESULTS SCREEN                                 ||
  // ! ||--------------------------------------------------------------------------------||
  public isResultsShowing: boolean = false;
  public isResultsEntering: boolean = false;
  public isResultsLeaving: boolean = false;
  public isResultsEntered: boolean = false;

  public async pageResultsEnter() {
    pageResultsEnter(this)
  }

  public async pageResultsLeave() {
    pageResultsLeave(this)
  }
  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                  SPLASH SCREEN                                 ||
  // ! ||--------------------------------------------------------------------------------||

  public isSplashActive: boolean = true
  public isSplashHidding: boolean = false
  public isSplashHidden: boolean = false
  public isSplashComplete: boolean = false
  // public isSplashLoading: boolean = true

  public async pageSplashLeave() {
    animationSplashLeave(this)
  }




  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                ANSWER SCREEN                                   ||
  // ! ||--------------------------------------------------------------------------------||

  public canAnswer = true;
  public lastAnswerPanY = 0;
  public lastAnswerDeltaY = 0;
  public isAnswerPan = false;
  public selectedAnswer = -1
  public chosenAnswer = -1
  public isAnswerSelected = false;
  public isAnswerPanFirst = true;

  private playerHandScrollTimeout: any;
  public onPlayerHandScroll($event: any) {
    // console.log('onPlayerHandScroll',{$event})
  }
  public onPlayerHandScrollEnd($event: any) {
    clearTimeout(this.playerHandScrollTimeout)
    if(this.gameState !== "page-answer") return;
    const scrollLeft = $event.target.scrollLeft;
    const scrollWidth = $event.target.scrollWidth;
    const currentCardIndex = Math.round(scrollLeft / scrollWidth *110 /10)
    const currentLiIndex = currentCardIndex + 1
    const numberOfCards = this.player.hand.length;
    this.playerHandScrollTimeout = setTimeout(() => {

      console.log('onPlayerHandScrollEnd', {
        // scrollLeft,
        // scrollWidth,
        gameState:this.gameState,
        currentCardIndex,
        currentLiIndex,
        numberOfCards
      })
      this.playerHandSlider.nativeElement.scrollTo({
        left: this.playerHandSlider.nativeElement.querySelector(`li:nth-child(${currentLiIndex})`).offsetLeft,
        behavior: 'smooth',
      })
      //document.querySelector('.player-hand .cards').scrollTo({left:document.querySelector("#app > div.player-hand > ul > li:nth-child(9)").offsetLeft})
    }, 0)
  }

  async pageAnswerEnter() {
    return animationPageAnswerEnter(this)
  }
  async pageAnswerLeave() {
    return animationPageAnswerLeave(this)
  }
  public onAnswerPanStart($event: any, i: number) {
    onPanStart(this, 'answer', $event, i);
  }
  public onAnswerPanMove($event: any) {
    onPanMove(this, 'answer', $event)
  }
  public async onAnswerPanEnd($event: any) {
    onPanEnd(this, 'answer', $event)
  }

  async onAnswerSwipe($event: any) {
    onSwipe(this, 'answer', $event)
  }

  public async onDiscardAnswer() {
    onDiscard(this, 'answer')
  }
  public async onConfirmAnswer() {
    onConfirm(this, 'answer')
    // this.pageVoteEnter();
  }
  public getAnswerTranslate(i: number) {
    return getTranslate(this, "answer", i);
  }

  public getAnswerEdgesTranslate(i: number) {
    return getEdgesTranslate(this, "answer", i)
  }

  public getAnswerVisibility(i: number) {
    return getCardVisibility(this, 'answer', i)
  }

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                   VOTE SCREEN                                  ||
  // ! ||--------------------------------------------------------------------------------||

  public lastVotePanY: any = 0
  public isVoteSelected: any = false;
  public isVotePan: any = false;
  public selectedVote: any = -1;
  public chosenVote: any = -1;
  public lastVoteDeltaY: any = 0
  public canVote: any = true;
  public isVotePageLeaving: boolean = false;

  public voteListCardsAnimation: boolean = false
  async pageVoteEnter() {
    return animationPageVoteEnter(this)
  }

  async pageVoteLeave() {
    return animationPageVoteLeave(this)
  }

  public onVotePanStart($event: any, i: any) {
    onPanStart(this, 'vote', $event, i)
  }
  public onVotePanMove($event: any,) {
    onPanMove(this, 'vote', $event)
  }
  public onVotePanEnd($event: any,) {
    onPanEnd(this, 'vote', $event)
  }


  public getVoteTranslate(i: any) {
    return getTranslate(this, "vote", i);

  }

  public getVoteVisibility(i: number) {
    return getCardVisibility(this, 'vote', i)
  }
  public onVoteSwipe($event: any) {
    onSwipe(this, 'vote', $event)
  }

  public async onConfirmVote() {
    await onConfirm(this, 'vote')
    await this.wait(1000)
    // this.pageResultsEnter()
  }
  public onDiscardVote() {
    onDiscard(this, 'vote')
  }
}


