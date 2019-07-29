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
        const columns = {
          name: null,
          email: null
        };
        const data = res.feed.entry;

        for (let i = 0; i < data.length; i++) {
            if (data[i].content.$t.toLowerCase() === 'name') {
              columns.name = i;
            }

            if (data[i].content.$t.toLowerCase() === 'email') {
              columns.email = i;
            }

            // do this only for the header row
            if (data[i].gs$cell.row > 1) {
              break;
            }
        }

        if (columns.name === null || columns.email === null) {
          throw new Error(('Must have name and email columns'));
        }

        const namesAndEmails = data.filter((item, i) => {
          return item.gs$cell.row > 1 &&
            (Number(item.gs$cell.col) === columns.name + 1 ||
              Number(item.gs$cell.col) === columns.email + 1);
        });

        const reducedNamesAndEmails = [];
        for (let i = 0; i < namesAndEmails.length - 1; i += 2) {
          reducedNamesAndEmails.push({
            name: namesAndEmails[i].content.$t,
            email: namesAndEmails[i + 1].content.$t
          })
        }

        return reducedNamesAndEmails;
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
