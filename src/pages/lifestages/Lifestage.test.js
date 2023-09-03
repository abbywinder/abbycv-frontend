import React from "react";
import userEvent from '@testing-library/user-event';
import { render, act, waitFor } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom'
import { getChatGPTResponse } from "../../api/chat-api";
import { checkAuth } from "../../utils/functions";
import { useOneLifestage } from "../../api/queries";
import { mockLifestageOne } from "../../utils/testConstants";
import LifestageScreen from "./LifestageScreen";
import ChatGPTDialog from "./chatGPTDialog/ChatGPTDialog";

jest.mock("../../api/queries");
jest.mock("../../api/chat-api");
jest.mock("../../api/login-api");

jest.mock("../../utils/functions", () => ({
    ...jest.requireActual("../../utils/functions"),
    checkAuth: jest.fn(),
}));

beforeAll(() => {
	checkAuth.mockReturnValue(true);
});

describe("<LifestageScreen />", () => {
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

    it("Doesn't render image section if no images found in lifestage", () => {
        const lifestageNoImages = {...mockLifestageOne, ...{images: []}};
        useOneLifestage.mockImplementation(() => ({ isLoading: false, isError: false, data: lifestageNoImages }));
        const { queryByTestId } = render(<LifestageScreen />, {wrapper: BrowserRouter});

        expect(queryByTestId('images')).not.toBeInTheDocument();
    });

    it("Doesn't render skill section if no skills found in lifestage", () => {
        const lifestageNoSkills = {...mockLifestageOne, ...{hard_skills: [], soft_skills: []}};
        useOneLifestage.mockImplementation(() => ({ isLoading: false, isError: false, data: lifestageNoSkills }));
        const { queryByTestId } = render(<LifestageScreen />, {wrapper: BrowserRouter});

        expect(queryByTestId('skills')).not.toBeInTheDocument();
    });
});

describe("<ChatGPTDialog />", () => {
    beforeEach(() => {
        useOneLifestage.mockImplementation(() => ({ isLoading: false, isError: false, data: mockLifestageOne }));
        getChatGPTResponse.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ response: 'This is the response' }), 2000)));
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

    it("Renders without crashing", () => {
		render(<ChatGPTDialog />);
	});

    it("When lifestage page is loaded, dialog is closed", () => {
        const { getByTestId } = render(<LifestageScreen />, {wrapper: BrowserRouter});
        expect(getByTestId('chat-dialog-closed')).toBeInTheDocument();
	});

    it("When dialog button is clicked, dialog opens", async () => {
        const { getByTestId, queryByTestId } = render(<LifestageScreen />, {wrapper: BrowserRouter});
        expect(getByTestId('chat-dialog-closed')).toBeInTheDocument();

        const user = userEvent.setup()
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'))
        });
        expect(getByTestId('chat-dialog-open')).toBeInTheDocument();
        expect(queryByTestId('chat-dialog-closed')).not.toBeInTheDocument();
	});

    it("When the dialog opens, after 0.5s the chatbot should show typing component, and after 1.5s it should disappear", async () => {
        jest.useFakeTimers();
        const { getByTestId, queryByTestId } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});
        
        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.advanceTimersByTime(500);
        })
        expect(getByTestId('typing')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1500);
        })
        expect(queryByTestId('typing')).not.toBeInTheDocument();
        jest.useRealTimers();
	});

    it("When the dialog opens, after 1.5s the initial message and prompts should appear", async () => {
        jest.useFakeTimers();
        const { getByTestId, getByText, getAllByTestId, queryByText, queryAllByTestId } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});
        
        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.advanceTimersByTime(500);
        })
        expect(queryByText('Ask me anything about this education')).not.toBeInTheDocument();
        expect(queryAllByTestId('prompt')).toHaveLength(0);

        act(() => {
            jest.advanceTimersByTime(1500);
        })
        expect(getByText('Ask me anything about this education')).toBeInTheDocument();
        expect(getAllByTestId('prompt')).toHaveLength(3);
        jest.useRealTimers();
	});

    it("Text input submits and clears on enter", async () => {
        const { getByTestId, getByRole } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});

        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        const input = getByRole('textbox', {
            name: /chat-input/i
        });

        await act(async () => {
            await user.type(input, 'testing');
            input.focus();
            await user.keyboard('{enter}');
        });
        
        expect(getChatGPTResponse).toHaveBeenCalled();
        expect(getByRole('textbox', {
            name: /chat-input/i
        })).toHaveValue('');
	});

    it("Text input submits on send icon press", async () => {
        const { getByTestId, getByRole } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});

        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        await act(async () => {
            await user.type(getByRole('textbox', {
                name: /chat-input/i
            }), 'testing');
            await user.click(getByRole('button', {
                name: /submit/i
            }))
        });
        
        expect(getChatGPTResponse).toHaveBeenCalled();
        expect(getByRole('textbox', {
            name: /chat-input/i
        })).toHaveValue('');
	});


    it("handleUserChat => when user submits a reply or a prompt, it updates the chat with new sender (client) and message", async () => {
        jest.useFakeTimers();
        const { getAllByTestId, queryAllByTestId, getByTestId, getByText } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});
       
        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(queryAllByTestId('message-client')).toHaveLength(0);

        await act(async () => {
            await user.click(getAllByTestId('prompt')[0])
        });
        expect(getAllByTestId('message-client')).toHaveLength(1);
        expect(getByText('What makes Abby suitable for a role that needs quick learners?')).toBeInTheDocument();
        jest.useRealTimers();
    });

    it("handleUserChat => as soon as a user submits a reply or a prompt, prompts should disappear", async () => {
        jest.useFakeTimers();
        const { getAllByTestId, queryAllByTestId, getByTestId } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});

        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(queryAllByTestId('prompt')).toHaveLength(3);

        await act(async () => {
            await user.click(getAllByTestId('prompt')[0])
        });
        expect(queryAllByTestId('prompt')).toHaveLength(0);
        
        jest.useRealTimers();
	});

    it("getChatResponse => as soon as a user submits a reply or a prompt, the chatbot should show as typing", async () => {
        jest.useFakeTimers();
        const { getAllByTestId, getByTestId } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});

        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.runAllTimers();
        });

        await act(async () => {
            await user.click(getAllByTestId('prompt')[0]);
        });
        expect(getByTestId('typing')).toBeInTheDocument();
        jest.useRealTimers();
	});

    it("getChatResponse => when a successful response is received from the api, any chat value with {status: loading, sender: chatbot} should be replaced with correct response message and status (success)", async () => {
        jest.useFakeTimers();
        const { getAllByTestId, queryByTestId, getByText, queryAllByTestId, getByTestId } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});
        
        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.runAllTimers();
        });


        await act(async () => {
            await user.click(getAllByTestId('prompt')[0])
        });

        act(() => {
            jest.runAllTimers();
        });


        await waitFor(() => {
            expect(queryByTestId('typing')).not.toBeInTheDocument();
            expect(getByText('This is the response')).toBeInTheDocument();
            expect(queryAllByTestId('message-client')).toHaveLength(1);
            expect(queryAllByTestId('message-chatbot')).toHaveLength(2);
        });

        jest.useRealTimers();
    });

    it("getChatResponse => if the user has reached their request limit or there is an error, the response text should be returned as the chatbot message", async () => {
        jest.useFakeTimers();
        getChatGPTResponse.mockImplementation(() => ('You have reached your limit for today'));
        const { getAllByTestId, queryByTestId, getByText, getByTestId } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});
        
        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.runAllTimers();
        });

        await act(async () => {
            await user.click(getAllByTestId('prompt')[0])
        });

        expect(queryByTestId('typing')).not.toBeInTheDocument();
        expect(getByText('You have reached your limit for today')).toBeInTheDocument();
        expect(getAllByTestId('message-client')).toHaveLength(1);
        expect(getAllByTestId('message-chatbot')).toHaveLength(2);
        jest.useRealTimers();
	});

    it("getChatResponse => prompts should reappear when the chatbot has replied, filtering out previously used prompts", async () => {
        jest.useFakeTimers();
        const { getAllByTestId, getByTestId } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});
        
        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        await act(async () => {
            await user.click(getAllByTestId('prompt')[0])
        });

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => expect(getAllByTestId('prompt')).toHaveLength(2));
        jest.useRealTimers();
	});

    it("getChatResponse => prompts should not reappear if the user has reached their request limit", async () => {
        jest.useFakeTimers();
        getChatGPTResponse.mockImplementation(() => ('You have reached your limit for today'));
        const { getAllByTestId, queryAllByTestId, getByTestId } = render(<ChatGPTDialog lifestage={mockLifestageOne} />, {wrapper: BrowserRouter});
        
        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'));
        });

        act(() => {
            jest.runAllTimers();
        });

        await act(async () => {
            await user.click(getAllByTestId('prompt')[0])
        });

        expect(queryAllByTestId('prompt')).toHaveLength(0);
        jest.useRealTimers();
	});

    it("When exit dialog button is clicked, dialog closes", async () => {
        const { getByTestId, queryByTestId, getByRole } = render(<LifestageScreen />, {wrapper: BrowserRouter});
        expect(getByTestId('chat-dialog-closed')).toBeInTheDocument();

        const user = userEvent.setup({ delay: null });
        await act(async () => {
            await user.click(getByTestId('chat-dialog-closed'))
        });
        expect(getByTestId('chat-dialog-open')).toBeInTheDocument();
        expect(queryByTestId('chat-dialog-closed')).not.toBeInTheDocument();

        await act(async () => {
            await user.click(getByRole('button', {
                name: /exit/i
            }))
        });

        expect(getByTestId('chat-dialog-closed')).toBeInTheDocument();
        expect(queryByTestId('chat-dialog-open')).not.toBeInTheDocument();
	});
});