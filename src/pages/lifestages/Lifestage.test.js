import React from "react";
import { screen, render, act } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event';
import LifestageScreen from "./LifestageScreen";
import { useOneLifestage } from "../../api/queries";

jest.mock("../../api/queries");

const mockData = {
	achievements: [],
	date_end: "2006-01-01T10:53:53.000Z",
	date_start: "1999-01-01T10:53:53.000Z",
	description: [],
	hard_skills: [],
	soft_skills: [],
	title: "1999-2006 – Primary School",
	_id: "6443fefed7e655211eddc799",
    background_col: 'lightsalmon'
};

describe("<LandingScreen />", () => {
	beforeEach(() => {
		useOneLifestage.mockImplementation(() => ({ isLoading: true }));
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Renders without crashing", () => {
		render(<LifestageScreen />);
	});

    it("Renders all the page components", () => {
        useOneLifestage.mockImplementation(() => ({ isLoading: false, isError: false, data: mockData }));
        const { getByTestId } = render(<LifestageScreen />, {wrapper: BrowserRouter});

        expect(getByTestId('title')).toBeInTheDocument();
        expect(getByTestId('images')).toBeInTheDocument();
        expect(getByTestId('description')).toBeInTheDocument();
        expect(getByTestId('skills')).toBeInTheDocument();
    });

});