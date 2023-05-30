import { baseURL, postData } from "./api-methods";
const endpoint = 'chat';

export const getChatGPTResponse = chat => {
    return postData(baseURL + endpoint, {chat: chat},{returnMessage: true});
};