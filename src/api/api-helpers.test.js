import { getData, postData } from "./api-methods";
import { encryptPassword, redirectIfTokenExpired } from "../utils/functions";
import { getChatGPTResponse } from "./chat-api";
import { getLifestages, getOneLifestage, getSkills } from "./lifestages-api";
import { getPublicKey, postLoginCredentials } from "./login-api";

jest.mock("./api-methods", () => ({
    getData: jest.fn(),
    postData: jest.fn(),
}));

jest.mock("../utils/functions", () => ({
    redirectIfTokenExpired: jest.fn(),
    encryptPassword: jest.fn()
}));

beforeEach(() => {
    getData.mockImplementation(() => null),
    postData.mockImplementation(() => null)
});

it("Calls auth token check when making api call to getChatGPTResponse", () => {
    getChatGPTResponse('');
    expect(redirectIfTokenExpired).toHaveBeenCalled();
});

it("Calls auth token check when making api call to getLifestages", () => {
    getLifestages({ queryKey: [1, 2]});
    expect(redirectIfTokenExpired).toHaveBeenCalled();
});

it("Calls auth token check when making api call to getOneLifestage", () => {
    getOneLifestage({ queryKey: [1, 2]});
    expect(redirectIfTokenExpired).toHaveBeenCalled();
});

it("Calls auth token check when making api call to getSkills", () => {
    getSkills({ queryKey: [1, 2]});
    expect(redirectIfTokenExpired).toHaveBeenCalled();
});

it("postLoginCredentials sets token in local storage", async () => {
    jest.spyOn(global.Storage.prototype, 'setItem');
    encryptPassword.mockImplementation(() => 'encrypted-password-123');

    const token = 'token123';
    postData.mockReturnValue({token: token});
    
    await postLoginCredentials('username','password');
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', token);
});

it("postLoginCredentials does not set token in local storage if password encryption", async () => {
    jest.spyOn(global.Storage.prototype, 'setItem');
    encryptPassword.mockImplementation(() => null);
    
    const returnVal = await postLoginCredentials('username','password');
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(returnVal).toBeNull();
});

it("getPublicKey sets key in local storage", async () => {
    jest.spyOn(global.Storage.prototype, 'setItem');
    getData.mockReturnValue({key: 'key'});
    await getPublicKey();
    expect(localStorage.setItem).toHaveBeenCalledWith('encryptionKey','key');
});