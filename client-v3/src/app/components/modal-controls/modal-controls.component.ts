import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-controls',
  templateUrl: './modal-controls.component.html',
  styleUrls: ['./modal-controls.component.scss']
})
export class ModalControlsComponent {
  @Input()active:boolean = true
}
