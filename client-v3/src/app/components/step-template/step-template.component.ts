import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-template',
  templateUrl: './step-template.component.html',
  styleUrls: ['./step-template.component.scss']
})


export class StepTemplateComponent implements OnInit {

  @Input() step: any;

  constructor() { }

  ngOnInit(): void {
  }

  onCompleteStep() {
    this.step.isComplete = true;
  }

}
