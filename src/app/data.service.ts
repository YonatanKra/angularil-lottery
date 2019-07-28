import {Injectable} from '@angular/core';
import {Jsonp} from "@angular/http";

@Injectable()
export class DataService {
  private _winners: string[] = [];
  private jsonp: Jsonp;
  private connection;

  constructor(jsonp: Jsonp) {
    this.jsonp = jsonp;
  }

  public get names() {
    return this.connection
      .map(res => {
        const data = res.json().feed.entry;
        return data.filter((item, i) => {
            return i > 1 && (i - 1) % 3 === 0
        }).map(item => {
          return {name: item.content.$t}
        });
      });
  }

  public addWinner(name) {
    this._winners.push(name);
  }

  sync() {
    this.connection = this.jsonp.request('https://spreadsheets.google.com/feeds/cells/1_TIN17LUiBTSbbHwOxb_wZbRdURR3xjyd74Govc77Kc/1/public/values?alt=json-in-script&callback=JSONP_CALLBACK');
  }
}
