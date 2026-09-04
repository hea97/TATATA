import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PlateResultScreen } from './PlateResultScreen'
import { plateResultFixtures } from './fixtures'
import { plateResultLabels, type PlateResult } from './plateResult'

const plateResults = Object.keys(plateResultFixtures) as PlateResult[]

afterEach(cleanup)

describe('PlateResultScreen', () => {
  it.each(plateResults)('renders the Korean label for %s', (result) => {
    render(
      <PlateResultScreen
        fixture={plateResultFixtures[result]}
        onReviewGrammar={() => undefined}
      />,
    )

    expect(
      screen.getByRole('heading', { name: plateResultLabels[result] }),
    ).toBeInTheDocument()
  })

  it('renders the learning metrics with signed relative speed', () => {
    render(
      <PlateResultScreen
        fixture={plateResultFixtures.DOUBLE}
        onReviewGrammar={() => undefined}
      />,
    )

    expect(screen.getByText('96%')).toBeInTheDocument()
    expect(screen.getByText('+8%')).toBeInTheDocument()
  })

  it('renders the fixture game context without calculating it', () => {
    render(
      <PlateResultScreen
        fixture={plateResultFixtures.TRIPLE}
        onReviewGrammar={() => undefined}
      />,
    )

    expect(screen.getByText('2회')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('calls onReviewGrammar from the primary CTA', () => {
    const onReviewGrammar = vi.fn()
    render(
      <PlateResultScreen
        fixture={plateResultFixtures.SINGLE}
        onReviewGrammar={onReviewGrammar}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '문법 복습하기' }))

    expect(onReviewGrammar).toHaveBeenCalledTimes(1)
  })
})
