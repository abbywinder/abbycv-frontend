import { render, screen } from '@testing-library/react';
import LandingScreen from './LandingScreen';

// component tests

test('renders heading', () => {
  render(<LandingScreen />);
  const heading = screen.getByText(/abby winder/i);
  expect(heading).toBeInTheDocument();
});

test('renders search bar', () => {
  render(<LandingScreen />);
  const searchBar = screen.getByRole('search');
  expect(searchBar).toBeInTheDocument();
});

test('renders lifestage buttons', () => {
    render(<LandingScreen />);
    const lifestageButton = screen.getByRole('button');
    expect(lifestageButton).toBeInTheDocument();
});