import React from "react";
import { screen, render } from "@testing-library/react";
import { useLifestages } from "../../api/queries";
import LandingScreen from "./LandingScreen";
import PreviewSection from "./PreviewSection";

jest.mock("../api/queries");

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

describe("<LandingScreen />", () => {
	beforeEach(() => {
		useLifestages.mockImplementation(() => ({ isLoading: true }));
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
		const { getAllByTestId } = render(<LandingScreen />);

		// expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(); //change to skeleton
		getAllByTestId('header-filter-tags');
	});

	it("Renders the search component", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getByRole } = render(<LandingScreen />);

		expect(getByRole('search')).toBeInTheDocument();
	});

	it("Renders the sort dropdown", () => {
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));
		const { getAllByRole } = render(<LandingScreen />);

		getAllByRole('option');
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