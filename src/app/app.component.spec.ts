import {AppComponent} from './app.component'
import {fireEvent, render, waitFor} from '@testing-library/angular'
import {HttpClient} from '@angular/common/http'
import {createMock, Mock} from '@testing-library/angular/jest-utils'
import {EMPTY, of, throwError} from 'rxjs'
import {JokeResponse} from './types'

describe('AppComponent', () => {
  let httpMock: Mock<HttpClient>

  const renderComponent = async () =>
    await render(AppComponent, {
      providers: [
        {provide: HttpClient, useValue: httpMock},
      ],
    })

  beforeEach(() => {
    httpMock = createMock(HttpClient)
    httpMock.get.mockReturnValue(EMPTY)
  })

  it('renders correctly', async () => {
    const {getByRole} = await renderComponent()

    expect(getByRole('heading')).toHaveTextContent('Welcome to my app')
    expect(getByRole('img')).toMatchSnapshot()
    expect(getByRole('button')).toHaveTextContent('Refresh')
    expect(getByRole('status')).toHaveTextContent('Loading...')
  })

  it('fetches random joke on load', async () => {
    const response: JokeResponse = {
      value: '👊 BAM 👊',
    }
    httpMock.get.mockReturnValue(of(response))

    const {getByRole} = await renderComponent()

    await waitFor(() =>
      expect(getByRole('status')).toHaveTextContent('👊 BAM 👊'),
    )
    expect(httpMock.get).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random')
  })

  it('fetches random joke on button click', async () => {
    const response1: JokeResponse = {value: '👊 BAM 👊'}
    const response2: JokeResponse = {value: '👊 BOOM 👊'}
    httpMock.get
      .mockReturnValueOnce(of(response1))
      .mockReturnValueOnce(of(response2))
    const {getByRole} = await renderComponent()
    fireEvent.click(getByRole('button'))

    await waitFor(() =>
      expect(getByRole('status')).toHaveTextContent('👊 BOOM 👊'),
    )
  })

  it('displays errors', async () => {
    const response = throwError(() => new Error('NOOOO!'))
    httpMock.get.mockReturnValue(response)

    const {getByRole} = await renderComponent()

    await waitFor(() =>
      expect(getByRole('status')).toHaveTextContent('NOOOO!'),
    )
  })
})
