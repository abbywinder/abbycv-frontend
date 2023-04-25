import React from "react";
import { render } from "@testing-library/react";
import { useLifestages } from "../api/queries";
import LandingScreen from "./LandingScreen";

jest.mock("../api/queries");

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
		const { rerender } = render(<LandingScreen />);
		expect(useLifestages).toHaveBeenCalled();		
		expect(useLifestages).toHaveBeenCalledTimes(1);
	});

	it("Displays loading component", () => {
		const { getByText } = render(<LandingScreen />);
		expect(getByText(/loading/i)).toBeVisible();
	});

	it("Displays error message", () => {
		useLifestages.mockImplementation(() => ({
			isLoading: false,
			isError: true,
			error: { message: "Unable to fetch lifestage data" },
		}));
		const { getByText, queryByText } = render(<LandingScreen />);

		expect(queryByText(/loading/i)).toBeFalsy();
		getByText(/something went wrong./i);
	});

	it("Displays data", () => {
		const mockData = [{
            achievements: [],
            date_end: "2006-01-01T10:53:53.000Z",
            date_start: "1999-01-01T10:53:53.000Z",
            description: [],
            hard_skills: [],
            soft_skills: [],
            title: "1999-2006 – Primary School",
            _id: "6443fefed7e655211eddc799"
        }]
        
		useLifestages.mockImplementation(() => ({ isLoading: false, data: mockData }));

		const { getByText, queryByText } = render(<LandingScreen />);

		expect(queryByText(/loading/i)).toBeFalsy();
		getByText(mockData[0].title);
	});
});