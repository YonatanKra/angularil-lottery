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

    .single-char {
      display: inline-block;
      width: 45px;
      height: 73px;
      vertical-align: bottom;
    }
  `],
  template: `
    <p><span class="single-char"
             *ngFor="let c of nameArr">{{ c }}</span></p>

    <ngil-buttons *ngIf="!running"
                  (start)="start()"
                  (init)="init()"></ngil-buttons>

    <ngil-winners-list [list]="winners"></ngil-winners-list>
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

  get names(): string[] {
    return this._names;
  }

  private _names: string[];

  public winners = [];
  public name: string;

  private running: boolean;
  private selectedNumber: number;
  private selected: string;
  private covered: string | any | void;
  private timer: any;
  private currentIteration: any;
  private lastRevealIteration: number;

  private round: number;

  constructor(private dataService: DataService, private drumsService: DrumsService) {
    this.round = 0;
  }

  get nameArr() {
    if (!this.name) {
      return [];
    }

    const splitName = this.name.split('');
    return hebrewLetters.includes(this.selected[0]) ? splitName.reverse() : splitName;
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

    this.covered = this.selected.replace(/([\s]|[\S])/g, '_');
    this.name = this.covered;

    this.lastRevealIteration = this.maxIterations;
  }

  public start() {
    if (this.names.length === 0) {
      return;
    }
    this.running = true;
    this.timer = setInterval(this.decode.bind(this), this.speed);
    this.round++;
    if (this.name !== this.selected) {
      this.drumsService.startDrums();
    }
  }

  private decode() {
    let newText = this.name.split('').map(this.changeLetter().bind(this)).join('');
    newText = this.currentIteration++ >= this.maxIterations ? this.selected : newText;

    if (newText === this.selected) {
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
