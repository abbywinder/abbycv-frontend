import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { useLifestages, useSkills } from './api/queries';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

jest.mock("./api/queries");

const mockLifestageCard = [{
	achievements: [],
	date_end: "2006-01-01T10:53:53.000Z",
	date_start: "1999-01-01T10:53:53.000Z",
	description: [],
	hard_skills: [],
	soft_skills: [],
	title: "1999-2006 – Primary School",
	_id: "6443fefed7e655211eddc799"
}];

describe("<App />", () => {
	beforeEach(() => {
        useLifestages.mockImplementation(() => ({ isLoading: true }));
        useSkills.mockImplementation(() => ({ isLoading: true }));
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders app', () => {
        render(<App />);
        const heading = screen.getByRole('application');
        expect(heading).toBeInTheDocument();
    });

    it("Renders the heading", () => {
		const { getByText } = render(<App />);

		getByText(/abby winder/i);
	});

    it("The heading links to the landing page", () => {
	});
    
    // it('navigates app', () => {
    //     useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestageCard }));
    //     const { getAllByTestId, getByText } = render(<App />);
    //     act(() => {
    //         userEvent.click(getAllByTestId('lifestage-card-link'))[0];
    //     });
    //     expect(getByText(mockLifestageCard._id)).toBeInTheDocument();
    // });

    it('displays 404 if path not recognised', () => {
        // const { getAllByTestId, getByText } = render(<App />, {wrapper: BrowserRouter});
        // act(() => {
        //     userEvent.click(getAllByTestId('lifestage-card-link'));
        // });
        // expect(getByText(/404 Not Found!/i)).toBeInTheDocument();
    });
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





