import React from "react";
import { screen, render, act } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'
import { useLifestages, useOneLifestage, useSkills } from "../../api/queries";
import { mockLifestages, mockSkillTags } from "../../utils/testConstants";
import { checkAuth, redirectIfTokenExpired } from "../../utils/functions";
import App from "../../App";
import LandingScreen from "./LandingScreen";
import PreviewSection from "./PreviewSection";
import Footer from "../../components/Footer";

jest.mock("../../api/queries");
jest.mock("../../api/login-api");

jest.mock("../../utils/functions", () => ({
    ...jest.requireActual("../../utils/functions"),
    checkAuth: jest.fn(),
	redirectIfTokenExpired: jest.fn()
}));

describe("<LandingScreen />", () => {
	beforeEach(() => {
		useLifestages.mockImplementation(() => ({ isLoading: true }));
		useSkills.mockImplementation(() => ({ isLoading: true }));
		checkAuth.mockReturnValue(true);
		redirectIfTokenExpired.mockImplementation(() => null);	
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Renders without crashing", () => {
		render(<LandingScreen />, {wrapper: BrowserRouter});
	});

	it("Fetches all the lifestages", () => {
		render(<LandingScreen />, {wrapper: BrowserRouter});
		expect(useLifestages).toHaveBeenCalled();		
		expect(useLifestages).toHaveBeenCalledTimes(4);
	});

	it("Fetches the skill filter data", () => {
		render(<LandingScreen />, {wrapper: BrowserRouter});
		expect(useSkills).toHaveBeenCalled();		
		expect(useSkills).toHaveBeenCalledTimes(1);
	});

	it("Displays loading component", () => {
		const { getAllByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});
		expect(getAllByTestId('loading-spinner')[0]).toBeVisible();
	});

	it("Displays error message", () => {
		useSkills.mockImplementation(() => ({
			isLoading: false,
			isError: true,
			error: { message: "Unable to fetch data" },
		}));
		const { getByText } = render(<LandingScreen />, {wrapper: BrowserRouter});

		getByText(/Something went wrong. Please refresh the page./i);
	});
	
	it("Renders the filter tags", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		getAllByTestId('header-filter-tags');
	});

	it("Refetches lifestages when filter tag is clicked", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const tag = getAllByTestId('header-filter-tags')[0];
		
		const user = userEvent.setup()
		await act(async () => {
			await user.click(tag);
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'reading list', soft_skills: ['organisation']});
	});

	it("Filter tag changes colour when clicked once, and changes back when clicked again", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const tag = getAllByTestId('header-filter-tags')[0];

		const user = userEvent.setup()
		await act(async () => {
			await userEvent.click(tag);
		});
		expect(tag).toHaveClass('selected');

		await act(async () => {
			await user.click(tag);
		});
		expect(tag).not.toHaveClass('selected');
	});

	it("Renders the search component", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole } = render(<LandingScreen />, {wrapper: BrowserRouter});

		expect(getByRole('search')).toBeInTheDocument();
	});
	
	it("Search bar value changes when text inputted", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const searchBar = getByRole('search');
		expect(searchBar).toHaveValue('');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(searchBar, 'react');
		});
		expect(searchBar).toHaveValue('react');
	});

	it("Refetches lifestages when text inputted to search bar", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const searchBar = getByRole('search');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(searchBar, 'react');
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'reading list', search: 'react'});
	});

	it("Produces validation error when bad characters are inputted in search bar", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole, getByText } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const searchBar = getByRole('search');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(searchBar, 'react%');
		});
		expect(getByText("Only the following symbols allowed: ._~()'!*:@,;+?-")).toBeInTheDocument();
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'reading list', search: 'react'});
	});

	it("Produces validation error when search bar input length is over 100 characters", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole, getByText } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const searchBar = getByRole('search');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(searchBar, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
		});
		expect(getByText("Exceeded max characters")).toBeInTheDocument();
		expect(searchBar).toHaveValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ');
	});

	it("Shows empty list message when no results are found", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: [] }));
		const { getByText } = render(<LandingScreen />, {wrapper: BrowserRouter});

		expect(getByText('No experience results here!')).toBeInTheDocument();
		expect(getByText('No education results here!')).toBeInTheDocument();
		expect(getByText('No projects results here!')).toBeInTheDocument();
		expect(getByText('No reading list results here!')).toBeInTheDocument();
	});

	it("Renders the sort dropdown", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getAllByRole } = render(<LandingScreen />, {wrapper: BrowserRouter});

		getAllByRole('option');
	});

	it("Sort dropdown value changes when new option selected", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const select = getByTestId('sort-dropdown');
		expect(select).toHaveValue('yeardesc');

		const user = userEvent.setup()
		await act(async () => {
			await user.selectOptions(select, 'durationdesc');
		});
		expect(select).toHaveValue('durationdesc');
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'durationdesc', type: 'reading list'});
	});

	it("Refetches lifestages when sort is changed", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const select = getByTestId('sort-dropdown');

		const user = userEvent.setup()
		await act(async () => {
			await user.selectOptions(select, 'durationdesc');
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'durationdesc', type: 'reading list'});
	});

});

describe("<PreviewSection />", () => {
	beforeEach(() => {
		checkAuth.mockReturnValue(true);
		redirectIfTokenExpired.mockImplementation(() => null);	
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Renders the lifestage cards", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));

		const { getByText } = render(<PreviewSection section={'education'} />, {wrapper: BrowserRouter});

		expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
		expect(getByText(mockLifestages[0].title.slice(12))).toBeInTheDocument();
	});

	it('Navigates when lifestage card clicked', async () => {
        useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
        useOneLifestage.mockImplementation(() => ({ isLoading: true }));

        const { getAllByTestId } = render(<App />);

		const user = userEvent.setup()
        await act(async () => {
            await user.click(getAllByTestId('lifestage-card-link')[0]);
        });
        expect(useOneLifestage).toHaveBeenCalled();
    });
});

describe("<Footer />", () => {
	beforeEach(() => {
		checkAuth.mockReturnValue(true);
		redirectIfTokenExpired.mockImplementation(() => null);	
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Color theme changes when toggled", async () => {
		const { getByRole } = render(<Footer />, {wrapper: BrowserRouter});
		expect(getByRole('button')).toBeInTheDocument();

		const button = getByRole('button');

		expect(document.body.dataset.theme).toBe('light')

		const user = userEvent.setup()
		await act(async () => {
			await user.click(button)
		});

		expect(document.body.dataset.theme).toBe('dark')
	});
});