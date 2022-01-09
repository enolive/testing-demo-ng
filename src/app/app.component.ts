import {Component, OnInit} from '@angular/core'
import {catchError, map, Observable, of} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {JokeResponse} from './types'

type JokeState =
  | { type: 'success', text: string }
  | { type: 'error', error: Error }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private readonly http: HttpClient) {
  }

  jokeText$: Observable<JokeState> | undefined

  ngOnInit(): void {
    this.refreshJoke()
  }

  refreshJoke() {
    this.jokeText$ = this.http
      .get<JokeResponse>('https://api.chucknorris.io/jokes/random')
      .pipe(
        map(res => (<JokeState>{type: 'success', text: res.value})),
        catchError((e: Error) => of(<JokeState>{type: 'error', error: e})),
      )
  }
}
