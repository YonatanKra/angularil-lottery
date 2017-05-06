import {Component, Input} from '@angular/core';
import {DataService} from './data.service';

@Component({
  selector: 'ngil-text',
  styles  : [`
    p {
      font-family: Courier;
      letter-spacing: 9px;
      font-size: 60px;
    }`],
  template: `
    <p>{{ name }}</p>

    <ngil-buttons *ngIf="!running"
                  (start)="start()"
                  (init)="init()"></ngil-buttons>
    <h1>Winners</h1>
    <p *ngFor="let winner of winners">{{ winner }}</p>
  `,
})
export class TextComponent {

  @Input() maxIterations: number;
  @Input() speed: number;

  public name: string;

  private running: boolean;
  private selected: string;
  private covered: string | any | void;
  private timer: any;
  private currentIteration: any;
  private names: string[];
  private winners: string[];

  constructor(private dataService: DataService) {
    this.names = dataService.names;
    this.winners = dataService.winners;
    this.init();
  }

  public init() {
    this.currentIteration = 0;
    this.running          = false;
    this.selected         = this.names[Math.random() * this.names.length | 0].toUpperCase();
    this.covered          = this.selected.replace(/[^\s]/g, '_');
    this.name             = this.covered;
  }

  public start() {
    this.running = true;
    this.timer   = setInterval(this.decode.bind(this), this.speed);
  }


  private decode() {
    let newText = this.name.split('').map(this.changeLetter().bind(this)).join('');
    newText     =  this.currentIteration++ >= this.maxIterations ? this.selected : newText;

    if (newText === this.selected) {
      clearInterval(this.timer);
      this.running = false;
      this.dataService.addWinner(this.selected);
    }
    this.name    = newText;
  }

  private changeLetter() {
    const replacements    = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz%!@&*#_';
    const replacementsLen = replacements.length;
    return (letter, index) => {
      if (this.selected[index] === ' ') {
        return ' ';
      } else if (this.selected[index] === letter && this.currentIteration > 50) {
        return letter;
      } else {
        return replacements[Math.random() * replacementsLen | 0];
      }
    };
  }
}
