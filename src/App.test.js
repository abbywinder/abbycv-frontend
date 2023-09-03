import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import jwtDecode from 'jwt-decode';
import JSEncrypt from 'jsencrypt';
import { useLifestages, useOneLifestage, useSkills } from './api/queries';
import { checkAuth, encryptPassword, redirectIfTokenExpired } from './utils/functions';
import { mockLifestageOne, mockLifestages, mockSkillTags } from './utils/testConstants';
import App from './App';
import LandingScreen from './pages/landing/LandingScreen';
import Page404 from './404';

jest.mock("./api/queries");
jest.mock("./api/login-api");
jest.mock('jwt-decode');
jest.mock('jsencrypt');

describe("<App />", () => {
	beforeEach(() => {
        useLifestages.mockImplementation(() => ({ isLoading: true }));
        useSkills.mockImplementation(() => ({ isLoading: true }));
        jest.spyOn(require('./utils/functions'), 'checkAuth').mockReturnValue(true);
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

        expect(useLifestages).toHaveBeenCalled();
        expect(useSkills).toHaveBeenCalled();
	});

    it("Checks user authorisation", async () => {
        render(<App />);
        expect(checkAuth).toHaveBeenCalled();
    });

    it("Displays <Login /> if user not authorised", async () => {
        checkAuth.mockReturnValue(false);
        const { getByText } = render(<App />);
        expect(checkAuth).toHaveBeenCalled();
        getByText('Please enter credentials to proceed...');
    });

    it("Displays <LandingScreen /> if user authorised", async () => {
        const { getByText } = render(<App />);
        expect(checkAuth).toHaveBeenCalled();
		getByText('Abby Winder');
    });
});

describe("Functions", () => {
    beforeEach(() => {
        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(null);    
        jest.spyOn(require('./utils/functions'), 'checkAuth');
        jest.spyOn(require('./utils/functions'), 'redirectIfTokenExpired');
    });

    afterEach(() => {
		jest.clearAllMocks();
        jest.restoreAllMocks();
	});

    it('checkAuth returns false and app shows login page if no auth token in local storage', async () => {
        const { getByText } = render(<App />);
        expect(checkAuth).toHaveBeenCalled();
        getByText('Please enter credentials to proceed...');
    });

    it('checkAuth returns false and app shows login page if auth token has expired', async () => {
        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(true);        
        jwtDecode.mockReturnValue({exp: 1690289046});
        const { getByText } = render(<App />);
        expect(checkAuth).toHaveBeenCalled();
        getByText('Please enter credentials to proceed...');
    });

    it('checkAuth returns true and shows landing page if auth token has not expired', async () => {
        useLifestages.mockImplementation(() => ({ isLoading: true }));
        useSkills.mockImplementation(() => ({ isLoading: true }));

        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(true);        
        jwtDecode.mockReturnValue({exp: 33247197764});
        const { getByText } = render(<App />);
        expect(checkAuth).toHaveBeenCalled();
        getByText('Abby Winder');
    });

    it('redirectIfTokenExpired redirects to login if auth token not present', async () => {
        useLifestages.mockImplementation(() => ({ isLoading: true }));
        useSkills.mockImplementation(() => ({ isLoading: true }));

        // test token is present initially
        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(true);        
        jwtDecode.mockReturnValue({exp: 33247197764});
        const { getByText } = render(<App />);
        getByText('Abby Winder');

        // test for redirection if token removed
        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(null);
        const returnVal = redirectIfTokenExpired(test=true);
        expect(returnVal).toEqual('REDIRECTED');        
    });
    
    it('redirectIfTokenExpired redirects to login if auth token expired', async () => {
        useLifestages.mockImplementation(() => ({ isLoading: true }));
        useSkills.mockImplementation(() => ({ isLoading: true }));

        // test token is present initially
        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(true);        
        jwtDecode.mockReturnValue({exp: 33247197764});
        const { getByText } = render(<App />);
        getByText('Abby Winder');

        // test for redirection if token expired
        jwtDecode.mockReturnValue({exp: 1690289046});
        const returnVal = redirectIfTokenExpired(test=true);
        expect(returnVal).toEqual('REDIRECTED');        
    });

    it('redirectIfTokenExpired does nothing if auth token not expired', async () => {
        useLifestages.mockImplementation(() => ({ isLoading: true }));
        useSkills.mockImplementation(() => ({ isLoading: true }));

        // test token is present initially
        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(true);        
        jwtDecode.mockReturnValue({exp: 33247197764});
        const { getByText } = render(<App />);
        getByText('Abby Winder');

        // test for null response if token fine
        const returnVal = redirectIfTokenExpired(test=true);
        expect(returnVal).toEqual(null);    
        getByText('Abby Winder');   
    });

    it('encryptPassword should return the encrypted password', () => {
        const publicKeyMock = 'publicKeyMock';
        const password = 'mockPassword';
        const encryptedPasswordMock = 'encryptedMockPassword';

        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(publicKeyMock);
    
        const mockEncryptInstance = {
            setPublicKey: jest.fn(),
            encrypt: jest.fn(() => encryptedPasswordMock),
        };
        JSEncrypt.mockImplementation(() => mockEncryptInstance);
    
        const encryptedPassword = encryptPassword(password);
        
        expect(encryptedPassword).toBe(encryptedPasswordMock);
        expect(global.Storage.prototype.getItem).toHaveBeenCalledWith('encryptionKey');
        expect(JSEncrypt).toHaveBeenCalledTimes(1);
        expect(JSEncrypt().setPublicKey).toHaveBeenCalledWith(publicKeyMock);
        expect(JSEncrypt().encrypt).toHaveBeenCalledWith(password);
    });
    
    it('encryptPassword should throw an error if publicKey is missing', () => {
        jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(null);
    
        expect(() => {
          encryptPassword('testPassword');
        }).toThrowError('Error code: 1');
        expect(global.Storage.prototype.getItem).toHaveBeenCalledWith('encryptionKey');
        expect(JSEncrypt).not.toHaveBeenCalled();
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