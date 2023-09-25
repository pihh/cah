import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { TransitionComponent } from './transition/transition.component';
import { BoardQuestionComponent } from './board-question/board-question.component';
import { BoardAnswersComponent } from './board-answers/board-answers.component';
import { PlayerHandComponent } from './player-hand/player-hand.component';
import { StepsComponent } from './steps/steps.component';
import { StepTemplateComponent } from './step-template/step-template.component';


const declarations = [
  HeaderComponent,
  TransitionComponent,
  BoardQuestionComponent,
  BoardAnswersComponent,
  PlayerHandComponent,
  StepsComponent,StepTemplateComponent
]
const exports = declarations

@NgModule({
  declarations,
  exports,
  imports: [
    CommonModule
  ],

})
export class ComponentsModule { }
