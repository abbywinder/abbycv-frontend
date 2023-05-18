import React from "react";
import { screen, render, act } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { useLifestages, useSkills } from "../../api/queries";
import LandingScreen from "./LandingScreen";
import PreviewSection from "./PreviewSection";
import { palette } from '../../palette';

jest.mock("../../api/queries");

const mockData = [{
	achievements: [],
	date_end: "2006-01-01T10:53:53.000Z",
	date_start: "1999-01-01T10:53:53.000Z",
	description: [],
	hard_skills: [],
	soft_skills: [],
	title: "1999-2006 – Primary School",
	_id: "6443fefed7e655211eddc799"
}];

const mockSkillTags = [{
	_id: 'organisation'
}];

describe("<LandingScreen />", () => {
	beforeEach(() => {
		useLifestages.mockImplementation(() => ({ isLoading: true }));
		useSkills.mockImplementation(() => ({ isLoading: true }));
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Renders without crashing", () => {
		render(<LandingScreen />);
	});

	it("Fetches all the lifestages", () => {
		render(<LandingScreen />);
		expect(useLifestages).toHaveBeenCalled();		
		expect(useLifestages).toHaveBeenCalledTimes(3);
	});

	it("Fetches the skill filter data", () => {
		render(<LandingScreen />);
		expect(useSkills).toHaveBeenCalled();		
		expect(useSkills).toHaveBeenCalledTimes(1);
	});

	it("Displays loading component", () => {
		const { getAllByTestId } = render(<LandingScreen />);
		expect(getAllByTestId('loading-spinner')[0]).toBeVisible();
	});

	it("Displays error message", () => {
		useLifestages.mockImplementation(() => ({
			isLoading: false,
			isError: true,
			error: { message: "Unable to fetch lifestage data" },
		}));
		const { getByText } = render(<LandingScreen />);

		getByText(/something went wrong./i);
	});

	it("Renders the heading", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByText } = render(<LandingScreen />);

		getByText(/abby winder/i);
	});
	
	it("Renders the filter tags", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />);

		getAllByTestId('header-filter-tags');
	});

	it("Refetches lifestages when filter tag is clicked", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />);

		const tag = getAllByTestId('header-filter-tags')[0];
		act(() => {
			userEvent.click(tag);
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'education', soft_skills: ['organisation']});
	});

	it("Filter tag changes colour when clicked once, and changes back when clicked again", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		useSkills.mockImplementation(() => ({ isLoading: false, data: mockSkillTags }));
		const { getAllByTestId } = render(<LandingScreen />);

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
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByRole } = render(<LandingScreen />);

		expect(getByRole('search')).toBeInTheDocument();
	});
	
	it("Search bar value changes when text inputted", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByRole } = render(<LandingScreen />);

		const searchBar = getByRole('search');
		expect(searchBar).toHaveValue('');
		act(() => {
			userEvent.type(searchBar, 'react');
		});
		expect(searchBar).toHaveValue('react');
	});

	it("Refetches lifestages when text inputted to search bar", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByRole } = render(<LandingScreen />);

		const searchBar = getByRole('search');
		act(() => {
			userEvent.type(searchBar, 'react');
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'education', search: 'react'});
	});

	it("Produces validation error when bad characters are inputted in search bar", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByRole, getByText } = render(<LandingScreen />);

		const searchBar = getByRole('search');
		act(() => {
			userEvent.type(searchBar, 'react%');
		});
		expect(getByText("Only the following symbols allowed: ._~()'!*:@,;+?-")).toBeInTheDocument();
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'yeardesc', type: 'education', search: 'react'});
	});

	it("Produces validation error when search bar input length is over 100 characters", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByRole, getByText } = render(<LandingScreen />);

		const searchBar = getByRole('search');
		act(() => {
			userEvent.type(searchBar, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
		});
		expect(getByText("Max 100 characters allowed")).toBeInTheDocument();
		expect(searchBar).toHaveValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ');
	});

	it("Shows empty list message when no results are found", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: [] }));
		const { getByText } = render(<LandingScreen />);

		expect(getByText('No experience results here!')).toBeInTheDocument();
		expect(getByText('No education results here!')).toBeInTheDocument();
	});

	it("Renders the sort dropdown", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getAllByRole } = render(<LandingScreen />);

		getAllByRole('option');
	});

	it("Sort dropdown value changes when new option selected", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByTestId } = render(<LandingScreen />);

		const select = getByTestId('sort-dropdown');
		expect(select).toHaveValue('yeardesc');
		act(() => {
			userEvent.selectOptions(select, 'durationdesc');
		});
		expect(select).toHaveValue('durationdesc');
	});

	it("Refetches lifestages when sort is changed", async () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByTestId } = render(<LandingScreen />);

		const select = getByTestId('sort-dropdown');
		act(() => {
			userEvent.selectOptions(select, 'durationdesc');
		});
		expect(useLifestages).toHaveBeenLastCalledWith({sort: 'durationdesc', type: 'education'});
	});

});

describe("<PreviewSection />", () => {
	it("Renders the lifestage cards", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));

		const { getByText } = render(<PreviewSection section={'education'} />);

		expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
		expect(getByText(mockData[0].title.slice(12))).toBeInTheDocument();
	});
});