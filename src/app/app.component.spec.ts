import {AppComponent} from './app.component'
import {fireEvent, render, waitFor} from '@testing-library/angular'
import {createMock, Mock} from '@testing-library/angular/jest-utils'
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {EMPTY, of, throwError} from 'rxjs'
import {setQueryConfig} from 'rx-query'

describe('AppComponent', () => {
  let httpMock: Mock<HttpClient>

  beforeEach(() => {
    setQueryConfig({
      cacheTime: 0,
      retries: 0,
    })
    httpMock = createMock(HttpClient)
  })

  const renderComponent = async () =>
    await render(AppComponent, {
      providers: [
        {provide: HttpClient, useValue: httpMock},
      ],
    })

  it('renders correctly', async () => {
    httpMock.get.mockReturnValue(EMPTY)

    const {getByRole} = await renderComponent()

    expect(getByRole('heading')).toHaveTextContent('👊 Chuck Norris App 👊')
    expect(getByRole('figure')).toMatchSnapshot()
    await waitFor(() =>
      expect(getByRole('status')).toHaveTextContent('Loading...'),
    )
    expect(getByRole('button')).toHaveTextContent('Refresh')
  })

  it('loads random joke on startup', async () => {
    const response = of({value: 'my random joke'})
    httpMock.get.mockReturnValue(response)

    const {getByRole} = await renderComponent()

    await waitFor(() =>
      expect(getByRole('status')).toHaveTextContent('my random joke'),
    )
    expect(httpMock.get).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random')
  })

  it.each([
    [new HttpErrorResponse({statusText: 'NOOOO!'}), 'an error occurred: NOOOO!'],
    [new Error('Ignore me'), 'an error occurred: Unknown Error'],
  ])('displays fetch errors instead of joke', async (error, expected) => {
    const response = throwError(() => error)
    httpMock.get.mockReturnValue(response)

    const {getByRole} = await renderComponent()

    await waitFor(() =>
      expect(getByRole('status')).toHaveTextContent(expected),
    )
  })

  it('refreshes joke on button click', async () => {
    const joke1 = {value: 'my random joke'}
    const joke2 = {value: 'my other joke'}
    httpMock.get.mockReturnValueOnce(of(joke1)).mockReturnValueOnce(of(joke2))
    const {getByRole, findByText} = await renderComponent()
    await findByText(joke1.value)

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
      expect(httpMock.get).toHaveBeenCalledTimes(2)
      expect(getByRole('status')).toHaveTextContent(joke2.value)
    })
  })
})
