import { render } from '@testing-library/react'
import React from 'react'
import CloseIcon from './CloseIcon'

it('renders CloseIcon svg', () => {
  const { container } = render(<CloseIcon />)
  const svg = container.querySelector('svg')
  expect(svg).toBeInTheDocument()
})
