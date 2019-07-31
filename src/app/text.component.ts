import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataService} from './data.service';
import {DrumsService} from './drums.service';

const hebrewLetters = 'אבגדהוזחטיכךלמםנןסעפףצץקרשת';
const replacements = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz%!@&*#_${hebrewLetters}`;

@Component({
  selector: 'ngil-text',
  styles: [`
    p {
      font-family: Courier;
      letter-spacing: 9px;
      font-size: 60px;
    }

    .nameRunning {
      animation: .5s flip infinite;
    }

    .nameNotRunning {
      animation: 1s bounce infinite;
    }

    @-webkit-keyframes bounce {
      0%,20%,53%,80%,to {
        -webkit-animation-timing-function: cubic-bezier(.215,.61,.355,1);
        animation-timing-function: cubic-bezier(.215,.61,.355,1);
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
      }

      40%,43% {
        -webkit-animation-timing-function: cubic-bezier(.755,.05,.855,.06);
        animation-timing-function: cubic-bezier(.755,.05,.855,.06);
        -webkit-transform: translate3d(0,-30px,0);
        transform: translate3d(0,-30px,0)
      }

      70% {
        -webkit-animation-timing-function: cubic-bezier(.755,.05,.855,.06);
        animation-timing-function: cubic-bezier(.755,.05,.855,.06);
        -webkit-transform: translate3d(0,-15px,0);
        transform: translate3d(0,-15px,0)
      }

      90% {
        -webkit-transform: translate3d(0,-4px,0);
        transform: translate3d(0,-4px,0)
      }
    }
    @keyframes flip {
      0% {
        -webkit-transform: perspective(400px) scaleX(1) translateZ(0) rotateY(-1turn);
        transform: perspective(400px) scaleX(1) translateZ(0) rotateY(-1turn);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out
      }

      40% {
        -webkit-transform: perspective(400px) scaleX(1) translateZ(150px) rotateY(-190deg);
        transform: perspective(400px) scaleX(1) translateZ(150px) rotateY(-190deg);
        -webkit-animation-timing-function: ease-out;
        animation-timing-function: ease-out
      }

      50% {
        -webkit-transform: perspective(400px) scaleX(1) translateZ(150px) rotateY(-170deg);
        transform: perspective(400px) scaleX(1) translateZ(150px) rotateY(-170deg);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in
      }

      90% {
        -webkit-transform: perspective(400px) scale3d(.95,.95,.95) translateZ(0) rotateY(0deg);
        transform: perspective(400px) scale3d(.95,.95,.95) translateZ(0) rotateY(0deg);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in
      }

      to {
        -webkit-transform: perspective(400px) scaleX(1) translateZ(0) rotateY(0deg);
        transform: perspective(400px) scaleX(1) translateZ(0) rotateY(0deg);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in
      }
    }
  `],
  template: `
    <p [ngClass]="{nameRunning: running, nameNotRunning: !running}">{{name}}</p>

    <ngil-buttons *ngIf="!running"
                  (start)="start()"></ngil-buttons>

    <ngil-winners-list [winners]="winners"></ngil-winners-list>
  `,
})
export class TextComponent {

  @Input() maxIterations: number;
  @Input() speed: number;

  @Input() set names(val: string[]) {
    this._names = val;
    this.init();
  }

  @Output() winner = new EventEmitter();

  get names() {
    return this._names.filter(item => !this.winners.includes(item));
  }

  private _names: string[];

  public winners = [];
  public name: string;

  private running: boolean;
  private selectedNumber: number;
  private selected: string;
  private timer: any;
  private currentIteration: any;
  private lastRevealIteration: number;

  private round: number;

  constructor(private dataService: DataService, private drumsService: DrumsService) {
    this.round = 0;
  }

  private randomName() {
    return this.names[Math.random() * this.names.length | 0]['name'];
  }
  public init() {
    if (!this.names || this.names.length === 0) {
      return;
    }
    this.currentIteration = 0;
    this.running = false;

    // generate random number and use it to select a winner
    const randomNumber = this.selectedNumber = Math.random() * this.names.length | 0;
    this.selected = this.names[randomNumber]['name'].toUpperCase();

    this.lastRevealIteration = this.maxIterations;
  }

  public start() {
    if (this.names.length === 0) {
      return;
    }
    this.init();
    this.running = true;
    this.timer = setInterval(this.decode.bind(this), this.speed);
    this.round++;
    if (this.name !== this.selected) {
      this.drumsService.startDrums();
    }
  }

  private decode() {
    let newText = this.randomName();

    if (this.currentIteration++ >= this.maxIterations) {
      newText = this.selected;
      clearInterval(this.timer);
      this.running = false;
      this.winner.emit(this.names[this.selectedNumber]);
      this.winners.push(this.names[this.selectedNumber]);
      this.drumsService.endDrums();
    }

    this.name = newText;
  }

  private changeLetter() {
    const replacementsLen = replacements.length;
    return (letter, index) => {
      if (this.selected[index] === ' ') {
        return ' ';
      } else if (this.selected[index] === letter && this.currentIteration > 50) {
        return letter;
      } else {
        let newLetter = replacements[Math.random() * replacementsLen | 0];
        if (this.currentIteration - this.lastRevealIteration > (this.maxIterations / this.selected.length)) {
          newLetter = this.selected[index];
        }
        if (newLetter === this.selected[index] && this.currentIteration >= 50) {
          this.lastRevealIteration = this.currentIteration;
        }
        return newLetter;
      }
    };
  }
}
