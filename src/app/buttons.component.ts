import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'ngil-buttons',
  template: `
      <button mat-raised-button
              color="primary"
              (click)="start.emit()">start
      </button>
  `,
  styles: []
})
export class ButtonsComponent  {

  @Output() start = new EventEmitter<void>();

}
