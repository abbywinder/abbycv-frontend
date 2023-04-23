import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
    render(<App />);
    const heading = screen.getByRole('application');
    expect(heading).toBeInTheDocument();
});

test('error boundary should have action button', () => {
    
});

test('error boundary needs to send logs to db', () => {
    
});





