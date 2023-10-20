import { Injectable, NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerHandComponent } from './components/player-hand/player-hand.component';
import { PlayerHandV2Component } from './components/player-hand-v2/player-hand-v2.component';
import { GameHeaderComponent } from './components/game-header/game-header.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { ModalSplashComponent } from './components/modal-splash/modal-splash.component';
import { ModalControlsComponent } from './components/modal-controls/modal-controls.component';
import { IconLoadingComponent } from './components/icon-loading/icon-loading.component';
import { ModalResultsComponent } from './components/modal-results/modal-results.component';
import { GameFooterComponent } from './components/game-footer/game-footer.component';
import { ButtonVoiceMessageComponent } from './components/button-voice-message/button-voice-message.component';
import { ButtonSettingsComponent } from './components/button-settings/button-settings.component';


/**
 * HammerJS gestures configuration
 */
@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {

  override overrides = {
    pan: {
      // direction: Hammer.DIRECTION_VERTICAL, // this code enables only horizontal direction
      direction: Hammer.DIRECTION_ALL, // this code enables only horizontal direction
      threshold: 10
    },
    pinch: {
      enable: false
    },
    rotate: {
      enable: false
    },
    swipe: {
      direction: Hammer.DIRECTION_VERTICAL,
    }

  };
}

@NgModule({
  declarations: [
    AppComponent,
    PlayerHandComponent,
    PlayerHandV2Component,
    GameHeaderComponent,
    GameBoardComponent,
    ModalSplashComponent,
    ModalControlsComponent,
    IconLoadingComponent,
    ModalResultsComponent,
    GameFooterComponent,
    ButtonVoiceMessageComponent,
    ButtonSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HammerModule,
    FormsModule
  ],
  providers: [
    //
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
