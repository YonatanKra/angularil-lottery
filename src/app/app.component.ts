import {Component} from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'ngil-root',
  styles: [
    `
    #syncButton {
      margin-left: auto;
    }
      .logo {
        max-height: 80px;
      }
    `
  ],
  template: `

    <form *ngIf="!synced"
          id="setupForm"
          class="example-form">
      <div><img class="logo" src="../assets/Logo.jpg"></div>
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
        <div><img src="../assets/Logo.jpg" class="logo"></div>
        <span> Raffle </span>
        <button id="syncButton" mat-raised-button
                color="primary"
                (click)="syncData()">Sync Data
        </button>
      </mat-toolbar>

      <ngil-text (winner)="onWin($event)"
                 [names]="names"
                [maxIterations]="30"
                [speed]="350"></ngil-text>
    </span>
  `,

})
export class AppComponent {
  names: string[];
  synced = false;
  spreadsheetID: string;

  constructor(private dataService: DataService) {}

  onWin(selected) {
    this.dataService.addWinner(selected);
  }
  syncData() {
    this.dataService.sync(this.spreadsheetID);
    this.dataService.names.subscribe(names => {
      this.names = names;
      this.synced = true;
    });
  }
}
