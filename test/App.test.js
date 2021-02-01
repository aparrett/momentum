import { render, screen } from '@testing-library/react'
import App from './App'

test('renders learn react link', () => {
    render(<App />)
    const linkElement = screen.getByText(/learn react/i)
    expect(linkElement).toBeInTheDocument()
})

// TODO:

// should login with correct credentials if entered by env

// should login with correct credentials if entered manually

// should login with correct paper toggle
