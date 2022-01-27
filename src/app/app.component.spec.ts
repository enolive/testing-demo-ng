import {AppComponent} from './app.component'

describe('AppComponent', () => {
  const createComponent = () => new AppComponent()

  it('has a title', async () => {
    const component = createComponent()

    expect(component.title).toEqual('Welcome to my app')
  })
})
