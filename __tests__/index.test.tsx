import { render, screen } from '@testing-library/react';
import Home from '../src/pages/index'

test('renders learn react link', () => {
    render(<Home />)
    const linkElement = screen.getByText('MUI')
    expect(linkElement).toBeInTheDocument()
})
