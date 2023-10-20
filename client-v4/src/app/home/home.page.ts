
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import type { GestureDetail } from '@ionic/angular';
import { GestureController, IonCard } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonCard, { read: ElementRef }) card: any ;//ElementRef<HTMLIonCardElement> | any;
  @ViewChild('debug', { read: ElementRef }) debug: any ;//ElementRef<HTMLParagraphElement> | any;

  isCardActive = false;

  constructor(public el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement.closest('ion-content'),
      onStart: () => this.onStart(),
      onMove: (detail) => this.onMove(detail),
      onEnd: () => this.onEnd(),
      gestureName: 'example',
    });

    gesture.enable();
  }

  private onStart() {
    this.isCardActive = true;
    this.cdRef.detectChanges();
  }

  private onMove(detail: GestureDetail) {
    const { type, currentX, deltaX, velocityX } = detail;
    this.debug.nativeElement.innerHTML = `
      <div>Type: ${type}</div>
      <div>Current X: ${currentX}</div>
      <div>Delta X: ${deltaX}</div>
      <div>Velocity X: ${velocityX}</div>`;
  }

  private onEnd() {
    this.isCardActive = false;
    this.cdRef.detectChanges();
  }
}
