import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { ComponentsModule } from '../components/components.module';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    GameComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
