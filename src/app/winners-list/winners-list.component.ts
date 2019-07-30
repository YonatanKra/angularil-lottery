import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ngil-winners-list',
  template: `
      <h2 *ngIf="winners.length">Winners</h2>
        <mat-card *ngFor="let winner of winners">
          <span> {{winner.name}} </span>
          <span> -- {{winner.email}} </span>
        </mat-card>
  `,
  styleUrls: ['./winners-list.component.css']
})
export class WinnersListComponent implements OnInit {
  @Input() winners = [];
  constructor() { }

  ngOnInit() {
  }

}
