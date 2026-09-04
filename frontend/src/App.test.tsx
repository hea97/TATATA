import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('starts with the sentence at-bat screen', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: '영어 문장을 입력해보세요' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '제출하기' }),
    ).toBeInTheDocument()
  })
})
