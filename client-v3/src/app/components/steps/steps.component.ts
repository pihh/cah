/* @ts-ignore */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { StepService } from 'src/app/services/step.service';


const STEPS = [
  { stepIndex: 1, isComplete: false },
  { stepIndex: 2, isComplete: false },
  { stepIndex: 3, isComplete: false }
];


@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class StepsComponent implements OnInit {

  steps:any[] = STEPS; //Observable<any[]>;
  currentStep:any = STEPS[0] ;// Observable<any>;

  constructor() {

  }

  ngOnInit(): void {
    //this.steps = this.stepsService.getSteps();
    //this.currentStep = this.stepsService.getCurrentStep();
  }

  stepId:number = 0;
  public onStepClick(step: any) {
    console.log('onStepClick')
    //this.stepsService.setCurrentStep(step);
    console.log({step})
    if(step <= this.steps.length-1){
      this.stepId = step;
      this.steps[this.currentStep-1].isComplete = true;
      this.currentStep = this.steps[step];
    }

  }
}
