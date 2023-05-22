import React from "react";
import { screen, render, act } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'
import { useLifestages, useOneLifestage, useSkills } from "../../api/queries";
import LandingScreen from "./LandingScreen";
import PreviewSection from "./PreviewSection";
import { palette } from '../../palette';
import App from "../../App";
import { mockLifestages, mockSkillTags } from "../../utils/testConstants";

jest.mock("../../api/queries");

describe("<LandingScreen />", () => {
	beforeEach(() => {
		useLifestages.mockImplementation(() => ({ isLoading: true }));
		useSkills.mockImplementation(() => ({ isLoading: true }));
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
		expect(useLifestages).toHaveBeenCalledTimes(3);
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
		useLifestages.mockImplementation(() => ({
			isLoading: false,
			isError: true,
			error: { message: "Unable to fetch lifestage data" },
		}));
		const { getByText } = render(<LandingScreen />, {wrapper: BrowserRouter});

		getByText(/something went wrong./i);
	});
	
	it("Renders the filter tags", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		getAllByTestId('header-filter-tags');
	});

	it("Refetches lifestages when filter tag is clicked", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const tag = getAllByTestId('header-filter-tags')[0];
		act(() => {
			userEvent.click(tag);
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'education', soft_skills: ['organisation']});
	});

	it("Filter tag changes colour when clicked once, and changes back when clicked again", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const tag = getAllByTestId('header-filter-tags')[0];
		act(() => {
			userEvent.click(tag);
		});
		expect(tag).toHaveStyle({backgroundColor: palette.selected});

		act(() => {
			userEvent.click(tag);
		});
		expect(tag).toHaveStyle({backgroundColor: palette.deselected});
	});

	it("Renders the search component", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole } = render(<LandingScreen />, {wrapper: BrowserRouter});

		expect(getByRole('search')).toBeInTheDocument();
	});
	
	it("Search bar value changes when text inputted", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const searchBar = getByRole('search');
		expect(searchBar).toHaveValue('');
		act(() => {
			userEvent.type(searchBar, 'react');
		});
		expect(searchBar).toHaveValue('react');
	});

	it("Refetches lifestages when text inputted to search bar", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const searchBar = getByRole('search');
		act(() => {
			userEvent.type(searchBar, 'react');
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'education', search: 'react'});
	});

	it("Produces validation error when bad characters are inputted in search bar", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole, getByText } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const searchBar = getByRole('search');
		act(() => {
			userEvent.type(searchBar, 'react%');
		});
		expect(getByText("Only the following symbols allowed: ._~()'!*:@,;+?-")).toBeInTheDocument();
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'education', search: 'react'});
	});

	it("Produces validation error when search bar input length is over 100 characters", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByRole, getByText } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const searchBar = getByRole('search');
		act(() => {
			userEvent.type(searchBar, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
		});
		expect(getByText("Max 100 characters allowed")).toBeInTheDocument();
		expect(searchBar).toHaveValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ');
	});

	it("Shows empty list message when no results are found", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: [] }));
		const { getByText } = render(<LandingScreen />, {wrapper: BrowserRouter});

		expect(getByText('No experience results here!')).toBeInTheDocument();
		expect(getByText('No education results here!')).toBeInTheDocument();
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
		act(() => {
			userEvent.selectOptions(select, 'durationdesc');
		});
		expect(select).toHaveValue('durationdesc');
	});

	it("Refetches lifestages when sort is changed", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		const { getByTestId } = render(<LandingScreen />, {wrapper: BrowserRouter});

		const select = getByTestId('sort-dropdown');
		act(() => {
			userEvent.selectOptions(select, 'durationdesc');
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'durationdesc', type: 'education'});
	});

});

describe("<PreviewSection />", () => {
	it("Renders the lifestage cards", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));

		const { getByText } = render(<PreviewSection section={'education'} />, {wrapper: BrowserRouter});

		expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
		expect(getByText(mockLifestages[0].title.slice(12))).toBeInTheDocument();
	});

	it('navigates when lifestage card clicked', () => {
        useLifestages.mockImplementation(() => ({ isLoading: false, data: mockLifestages }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
        useOneLifestage.mockImplementation(() => ({ isLoading: true }));

        const { getAllByTestId } = render(<App />);
        act(() => {
            userEvent.click(getAllByTestId('lifestage-card-link')[0]);
        });
        expect(useOneLifestage).toHaveBeenCalled();
    });
});