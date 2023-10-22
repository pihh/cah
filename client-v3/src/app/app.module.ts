import { Injectable, NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerHandComponent } from './components/player-hand/player-hand.component';

import { GameHeaderComponent } from './components/game-header/game-header.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { ModalSplashComponent } from './components/modal-splash/modal-splash.component';
import { ModalControlsComponent } from './components/modal-controls/modal-controls.component';
import { IconLoadingComponent } from './components/icon-loading/icon-loading.component';
import { ModalResultsComponent } from './components/modal-results/modal-results.component';
import { GameFooterComponent } from './components/game-footer/game-footer.component';
import { ButtonVoiceMessageComponent } from './components/button-voice-message/button-voice-message.component';
import { ButtonSettingsComponent } from './components/button-settings/button-settings.component';
import { GameSideMenuComponent } from './components/game-side-menu/game-side-menu.component';
import { ButtonComponent } from './components/game-side-menu/button/button.component';
import { PanelComponent } from './components/game-side-menu/panel/panel.component';


/**
 * HammerJS gestures configuration
 */
@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {

  override overrides = <any>{
    pan: {
      // direction: Hammer.DIRECTION_VERTICAL, // this code enables only horizontal direction
      direction: Hammer.DIRECTION_ALL, // this code enables only horizontal direction
      threshold: 1
    },
    swipe: {
      direction: Hammer.DIRECTION_VERTICAL,
    },
  }
  override buildHammer(element: any) {
    let options = {};

    if (element.attributes['data-mc-options']) {
      try {
        options = JSON.parse(element.attributes['data-mc-options'].nodeValue);
      }
      catch (err) {
        console.error('An error occurred when attempting to parse Hammer.js options: ', err);
      }
    }

    const mc = new Hammer(element, options);


    // retain support for angular overrides object
    for (const eventName of Object.keys(this.overrides)) {
      mc.get(eventName).set(this.overrides[eventName]);
    }

    return mc;
  }

};


@NgModule({
  declarations: [
    AppComponent,
    PlayerHandComponent,
    GameHeaderComponent,
    GameBoardComponent,
    ModalSplashComponent,
    ModalControlsComponent,
    IconLoadingComponent,
    ModalResultsComponent,
    GameFooterComponent,
    ButtonVoiceMessageComponent,
    ButtonSettingsComponent,
    GameSideMenuComponent,
    ButtonComponent,
    PanelComponent
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
