import React from "react";
import { screen, render, act } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event';
import LifestageScreen from "./LifestageScreen";
import { useOneLifestage } from "../../api/queries";
import { mockLifestageOne } from "../../utils/testConstants";

jest.mock("../../api/queries");

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
        useOneLifestage.mockImplementation(() => ({ isLoading: false, isError: false, data: mockLifestageOne }));
        const { getByTestId } = render(<LifestageScreen />, {wrapper: BrowserRouter});

        expect(getByTestId('title')).toBeInTheDocument();
        expect(getByTestId('images')).toBeInTheDocument();
        expect(getByTestId('description')).toBeInTheDocument();
        expect(getByTestId('skills')).toBeInTheDocument();
    });
});