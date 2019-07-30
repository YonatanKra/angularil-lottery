import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ngil-winners-list',
  template: `<div class="winner-row" *ngFor="let winner of winners"></div>`,
  styleUrls: ['./winners-list.component.css']
})
export class WinnersListComponent implements OnInit {
  @Input() winners = [];
  constructor() { }

  ngOnInit() {
  }

}
