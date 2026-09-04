import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the plate result preview', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '2루타' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '문법 복습하기' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Frontend 개발 기반이 정상적으로 동작하고 있습니다.'),
    ).not.toBeInTheDocument()
  })
})
