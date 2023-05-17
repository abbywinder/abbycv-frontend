import { render, screen } from '@testing-library/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

test('renders app', () => {
    render(<App />);
    const heading = screen.getByRole('application');
    expect(heading).toBeInTheDocument();
});

// test('error boundary should have action button', () => {
//     const { getByRole } = render(<ErrorBoundary />);
//     expect(getByRole('button')).toBeInTheDocument();
// });

// test('error boundary needs to send logs to db', () => {
//     render(<ErrorBoundary />);
//     expect().toHaveBeenCalled();	
// });

// add tests for connecting to api - any api call need to check can reach server





