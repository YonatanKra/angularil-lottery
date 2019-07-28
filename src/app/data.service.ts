import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()
export class DataService {
  private _winners: string[] = [];
  private connection;

  constructor(private httpClient: HttpClient) {
  }

  public get names() {
    return this.connection
      .pipe(map((res: any) => {
        const data = res.feed.entry;
        return data.filter((item, i) => {
            return i > 1 && (i - 1) % 3 === 0
        }).map(item => {
          return {name: item.content.$t}
        });
      }));
  }

  public addWinner(name) {
    this._winners.push(name);
  }

  sync(spreadsheetId: string = '1_TIN17LUiBTSbbHwOxb_wZbRdURR3xjyd74Govc77Kc') {
    this.connection = this.httpClient.jsonp(
      `https://spreadsheets.google.com/feeds/cells/${spreadsheetId}/1/public/values?alt=json-in-script`,
      'callback');
  }
}
