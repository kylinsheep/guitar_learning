import { render, screen } from '@testing-library/react'
import App from './App'

describe('App shell', () => {
  it('renders phase 0 heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Guitar Trainer MVP' })).toBeInTheDocument()
  })
})
