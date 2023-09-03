import { redirectIfTokenExpired } from "../utils/functions";
import { baseURL, postData } from "./api-methods";
const endpoint = 'chat';

export const getChatGPTResponse = chat => {
    redirectIfTokenExpired()
    return postData(baseURL + endpoint, {chat: chat}, {returnMessage: true});
};