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

    <form ng-if="spreadsheetUrl" 
          id="setupForm"
          class="example-form">
        <mat-form-field class="example-full-width">
          <input matInput placeholder="Spreadsheet URL" [(ngModel)]="spreadsheetUrl">
        </mat-form-field>

        <button id="syncButton" md-raised-button
                color="primary"
                (click)="syncData()">Sync Data
        </button>
      
    </form>
    <span ng-if="spreadsheetUrl" 
          id="raffle-page">
      <md-toolbar color="primary">
        <span>WalkMe Tech Talk Raffle </span>

        <button id="syncButton" md-raised-button
                color="primary"
                (click)="syncData()">Sync Data
        </button>
      </md-toolbar>

      <ngil-text [names]="names"
                [maxIterations]="150"
                [speed]="75"></ngil-text>
    </span>
  `,

})
export class AppComponent {
  names: string[];
  spreadsheetUrl: string;

  constructor(private dataService: DataService) {}
  
  syncData() {
    this.dataService.sync();
    this.dataService.names.subscribe(names => {
      this.names = names;
    });
  }
}
