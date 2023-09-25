import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


const STEPS = [
  { stepIndex: 1, isComplete: false },
  { stepIndex: 2, isComplete: false },
  { stepIndex: 3, isComplete: false }
];

@Injectable({
  providedIn: 'root'
})
export class StepService {

  steps$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(STEPS);
  currentStep$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
    this.currentStep$.next(this.steps$.value[0]);
  }

  setCurrentStep(step: any): void {
    this.currentStep$.next(step);
  }

  getCurrentStep(): Observable<any> {
    return this.currentStep$.asObservable();
  }

  getSteps(): Observable<any[]> {
    return this.steps$.asObservable();
  }

  moveToNextStep(): void {
    const index = this.currentStep$.value.stepIndex;

    if (index < this.steps$.value.length) {
      this.currentStep$.next(this.steps$.value[index]);
    }
  }

  isLastStep(): boolean {
    return this.currentStep$.value.stepIndex === this.steps$.value.length;
  }
}
