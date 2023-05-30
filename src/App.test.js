import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Page404 from './404';
import { useLifestages, useOneLifestage, useSkills } from './api/queries';
import App from './App';
import LandingScreen from './pages/landing/LandingScreen';
import { mockLifestageOne, mockLifestages, mockSkillTags } from './utils/testConstants';

jest.mock("./api/queries");

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

    it("The heading links to the landing page", async () => {

        useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages, isError: false }));
        useOneLifestage.mockImplementation(() => ({ isLoading: false, isError: false, data: mockLifestageOne }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags, isError: false }));

        const { getByText, getAllByTestId } = render(<App />);

        const user = userEvent.setup()
        await act(async () => {
            await user.click(getAllByTestId('lifestage-card-link')[0]);
        });
        expect(useOneLifestage).toHaveBeenCalled();


		const heading = getByText(/abby winder/i);
        await act(async () => {
            await userEvent.click(heading);
        });

        expect(useLifestages).toHaveBeenCalledTimes(6);
        expect(useSkills).toHaveBeenCalledTimes(2);
	});
});

describe("<Page404 />", () => {
    it('displays 404 if path not recognised', () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        const routes = [
            {
              path: "/",
              element: <LandingScreen />,
              errorElement: <Page404 />
            },
        ];
        
        const router = createMemoryRouter(routes, {
            initialEntries: ["/badroute"],
            initialIndex: 0,
        });
        

        const { getByText, queryByText } = render(<RouterProvider router={router} />);

        expect(getByText(/404 Not Found!/i)).toBeInTheDocument();
        expect(queryByText(/abby winder/i)).not.toBeInTheDocument();
    });

    it('404 page links back to landing page', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages, isError: false }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags, isError: false }));

        const routes = [
            {
              path: "/",
              element: <LandingScreen />,
              errorElement: <Page404 />
            },
        ];
        
        const router = createMemoryRouter(routes, {
            initialEntries: ["/badroute"],
            initialIndex: 0,
        });

        const { getByTestId, getByText, queryByText } = render(<RouterProvider router={router} />);
        
        expect(queryByText(/abby winder/i)).not.toBeInTheDocument;
        
        const user = userEvent.setup()
        await act(async () => {
            await user.click(getByTestId('back-link'));
        });
        expect(getByText(/abby winder/i)).toBeInTheDocument();
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





