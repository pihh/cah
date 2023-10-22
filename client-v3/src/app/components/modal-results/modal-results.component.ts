import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-results',
  templateUrl: './modal-results.component.html',
  styleUrls: ['./modal-results.component.scss']
})
export class ModalResultsComponent {
  @Input() answer: any;
  @Input() question: any;
  @Input() isResultsShowing: boolean = true
  @Input() isResultsEntering: boolean = true
  @Input() isResultsLeaving: boolean = true
  @Input() isResultsEntered: boolean = true
  @Input() winner:any;
}
