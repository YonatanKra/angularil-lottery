import {Component} from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'ngil-root',
  styles: [
    `
    #syncButton {
      margin-left: auto;
    }
    `
  ],
  template: `

    <form *ngIf="!synced"
          id="setupForm"
          class="example-form">
        <mat-form-field class="example-full-width">
          <input name="spreadsheetID" matInput placeholder="Spreadsheet ID" [(ngModel)]="spreadsheetID">
        </mat-form-field>

        <button id="syncButton" mat-raised-button
                color="primary"
                (click)="syncData()">Sync Data
        </button>

    </form>
    <span *ngIf="synced"
          id="raffle-page">
      <mat-toolbar color="primary">
        <span>WalkMe Tech Talk Raffle </span>

        <button id="syncButton" mat-raised-button
                color="primary"
                (click)="syncData()">Sync Data
        </button>
      </mat-toolbar>

      <ngil-text [names]="names"
                [maxIterations]="150"
                [speed]="75"></ngil-text>
    </span>
  `,

})
export class AppComponent {
  names: string[];
  synced = false;
  spreadsheetID: string;

  constructor(private dataService: DataService) {}

  syncData() {
    this.dataService.sync(this.spreadsheetID);
    this.dataService.names.subscribe(names => {
      this.names = names;
      this.synced = true;
    });
  }
}
