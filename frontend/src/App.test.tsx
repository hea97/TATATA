import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the frontend foundation status', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'TATATA' })).toBeInTheDocument()
    expect(
      screen.getByText('Frontend 개발 기반이 정상적으로 동작하고 있습니다.'),
    ).toBeInTheDocument()
  })
})
