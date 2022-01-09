import {AppComponent} from './app.component'
import {render} from '@testing-library/angular'

describe('AppComponent', () => {
  const renderComponent = async () =>
    await render(AppComponent)

  it('renders correctly', async () => {
    const {getByRole} = await renderComponent()

    expect(getByRole('heading')).toHaveTextContent('Welcome to my app')
  })
})
