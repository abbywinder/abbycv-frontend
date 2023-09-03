import { screen, render, act, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'
import { getPublicKey, postLoginCredentials } from "../../api/login-api";
import { useLifestages, useSkills } from "../../api/queries";
import { checkAuth, redirectIfTokenExpired } from "../../utils/functions";
import Login from "./Login";

jest.mock("../../api/queries");
jest.mock("../../api/login-api");
jest.mock("../../utils/functions", () => ({
    ...jest.requireActual("../../utils/functions"),
    checkAuth: jest.fn(),
	redirectIfTokenExpired: jest.fn()
}));

const realLocation = window.location;
beforeAll(() => {
  delete window.location;
  window.location = { ...realLocation, assign: jest.fn() };
});

afterAll(() => {
  window.location = realLocation;
});

describe("<Login />", () => {
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
		const { getByText, getByRole } = render(<Login />, {wrapper: BrowserRouter});
        getByText('Please enter credentials to proceed...');
        getByText('Submit');
        getByRole('button');
	});

	it("Calls getPublicKey for password encryption on page load", () => {
        render(<Login />, {wrapper: BrowserRouter});
        expect(getPublicKey).toHaveBeenCalled();
    });

    it("Takes an input for username", async () => {
		const { getByPlaceholderText, getByTestId } = render(<Login />, {wrapper: BrowserRouter});
        getByPlaceholderText('Enter username...');

        const input = getByTestId('username-input');
		expect(input).toHaveValue('');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(input, 'test username');
		});
		expect(input).toHaveValue('test username');
    });

    it("Takes an input for password", async () => {
		const { getByPlaceholderText, getByTestId } = render(<Login />, {wrapper: BrowserRouter});
        getByPlaceholderText('Enter password...');

        const input = getByTestId('password-input');
		expect(input).toHaveValue('');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(input, 'test password');
		});
		expect(input).toHaveValue('test password');
    });
    
    it("Produces a validation error if prohibited characters are typed in either username or password fields", async () => {
        const { getByTestId, getByText } = render(<Login />, {wrapper: BrowserRouter});

        const usernameInput = getByTestId('username-input');
        const passwordInput = getByTestId('password-input');
		expect(usernameInput).toHaveValue('');
		expect(passwordInput).toHaveValue('');

		const user = userEvent.setup()

		await act(async () => {
			await user.type(usernameInput, 'test username%');
		});
        expect(getByText("Only the following symbols allowed: ._~()'!*:@,;+?-")).toBeInTheDocument();

		await act(async () => {
			await user.type(passwordInput, 'test password%');
		});
        expect(getByText("Only the following symbols allowed: ._~()'!*:@,;+?-")).toBeInTheDocument();
    });

    it("Produces a validation error if max length of 30 exceeded in either username or password fields", async () => {
        const { getByTestId, getByText } = render(<Login />, {wrapper: BrowserRouter});

        const usernameInput = getByTestId('username-input');
        const passwordInput = getByTestId('password-input');
		expect(usernameInput).toHaveValue('');
		expect(passwordInput).toHaveValue('');

		const user = userEvent.setup()

		await act(async () => {
			await user.type(usernameInput, 'test username that is too long for username as limit is 30 characters');
		});
		expect(getByText("Exceeded max characters")).toBeInTheDocument();

		await act(async () => {
			await user.type(passwordInput, 'test password that is too long for password as limit is 30 characters');
		});
		expect(getByText("Exceeded max characters")).toBeInTheDocument();
    });

    it("Calls postLoginCredentials when submit button pressed", async () => {
		const { getByTestId, getByRole } = render(<Login />, {wrapper: BrowserRouter});
        const usernameInput = getByTestId('username-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(usernameInput, 'username');
			await user.type(passwordInput, 'password');
            await user.click(submitButton);
		});

        expect(postLoginCredentials).toHaveBeenCalledWith('username','password');
    });

    it("Whilst credentials are being checked after submit button pressed, loading spinner shows", async () => {
        postLoginCredentials.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ token: 'This is the response' }), 2000)));

        const { getByTestId, getByRole } = render(<Login />, {wrapper: BrowserRouter});
        const usernameInput = getByTestId('username-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(usernameInput, 'username');
			await user.type(passwordInput, 'password');
            await user.click(submitButton);
		});

        await waitFor(() => {
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });
    });

    it("If credentials correct and accepted, redirects to root URL and landing screen is shown", async () => {
        postLoginCredentials.mockReturnValue('Ok'); 
        
		const { getByTestId, getByRole } = render(<Login />, {wrapper: BrowserRouter});
        const usernameInput = getByTestId('username-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(usernameInput, 'username');
			await user.type(passwordInput, 'password');
            await user.click(submitButton);
		});

        expect(postLoginCredentials).toHaveBeenCalledWith('username','password');
        expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
        expect(window.location.assign).toHaveBeenCalled();
    });

    it("If credentials incorrect and not accepted, it displays error message and does not proceed to other pages", async () => {
        postLoginCredentials.mockReturnValue(null);

		const { getByTestId, getByRole, getByText } = render(<Login />, {wrapper: BrowserRouter});
        const usernameInput = getByTestId('username-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(usernameInput, 'username');
			await user.type(passwordInput, 'password');
            await user.click(submitButton);
		});

        expect(postLoginCredentials).toHaveBeenCalledWith('username','password');
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();     
        getByText('Incorrect username or password');
    });

    it("If no username present, submit button is disabled", async () => {
		const { getByRole, getByTestId } = render(<Login />, {wrapper: BrowserRouter});
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(passwordInput, 'password');
            await user.click(submitButton);
		});

        expect(postLoginCredentials).not.toHaveBeenCalled();
    });

    it("If no password present, submit button is disabled", async () => {
		const { getByRole, getByTestId } = render(<Login />, {wrapper: BrowserRouter});
        const usernameInput = getByTestId('username-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(usernameInput, 'username');
            await user.click(submitButton);
		});

        expect(postLoginCredentials).not.toHaveBeenCalled();
    });

    it("If validation error in username present, submit button is disabled", async () => {
		const { getByRole, getByTestId, getByText } = render(<Login />, {wrapper: BrowserRouter});
        const usernameInput = getByTestId('username-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(usernameInput, 'test username that is too long for username as limit is 30 characters');
            await user.click(submitButton);
		});

		expect(getByText("Exceeded max characters")).toBeInTheDocument();
        expect(postLoginCredentials).not.toHaveBeenCalled();
    });

    it("If validation error in password present, submit button is disabled", async () => {
		const { getByRole, getByTestId, getByText } = render(<Login />, {wrapper: BrowserRouter});
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(passwordInput, 'test username that is too long for username as limit is 30 characters');
            await user.click(submitButton);
		});

		expect(getByText("Exceeded max characters")).toBeInTheDocument();
        expect(postLoginCredentials).not.toHaveBeenCalled();
    });

    it("Shows greyed out submit button if disabled", async () => {
		const { getByRole } = render(<Login />, {wrapper: BrowserRouter});
        const submitButton = getByRole('button');
        expect(submitButton).toHaveClass('submit disabled');
    });

    it("Shows non-greyed out submit button if enabled", async () => {
        const { getByTestId, getByRole } = render(<Login />, {wrapper: BrowserRouter});
        const usernameInput = getByTestId('username-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(usernameInput, 'username');
			await user.type(passwordInput, 'password');
		});

        expect(submitButton).toHaveClass('submit');
    });

    it("Clears both inputs when submit button pressed and credentials not accepted", async () => {
        postLoginCredentials.mockReturnValue(null);

        const { getByTestId, getByRole, getByText } = render(<Login />, {wrapper: BrowserRouter});
        let usernameInput = getByTestId('username-input');
        let passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button');

		const user = userEvent.setup()
		await act(async () => {
			await user.type(usernameInput, 'username');
			await user.type(passwordInput, 'password');
            await user.click(submitButton);
		});

        expect(postLoginCredentials).toHaveBeenCalledWith('username','password');
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(); 
        getByText('Incorrect username or password');
        
        usernameInput = getByTestId('username-input'); // needs to requery component otherwise test fails
        passwordInput = getByTestId('password-input'); // needs to requery component otherwise test fails
        expect(usernameInput).toHaveValue('');
        expect(passwordInput).toHaveValue('');
    });
});