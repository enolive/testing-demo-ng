import {Component} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {query, refreshQuery} from 'rx-query'
import {map} from 'rxjs'

interface JokeResponse {
  value: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private readonly http: HttpClient) {
  }

  joke$ =
    query('joke', () =>
      this.http
          .get<JokeResponse>('https://api.chucknorris.io/jokes/random')
          .pipe(map(res => res.value)),
    )

  refreshJoke() {
    refreshQuery('joke')
  }

  hasStatusText(obj: any): obj is { statusText: string } {
    return typeof obj.statusText === 'string'
  }

  explain(error?: Readonly<unknown>) {
    return this.hasStatusText(error) ? error.statusText : 'Unknown Error'
  }
}
