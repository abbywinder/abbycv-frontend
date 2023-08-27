import { encryptPassword } from "../utils/functions";
import { baseURLauth, getData, postData } from "./api-methods";
const endpoint = 'auth';

export const postLoginCredentials = async (username, password) => {
    const encryptedPassword = encryptPassword(password);
    if (encryptedPassword) {
        const response = await postData(baseURLauth + endpoint + '/login', { username, password: encryptedPassword });
        if (response && response.token) localStorage.setItem("authToken", response.token);
        return response;
    } else {
        return null;
    };
};

export const getPublicKey = async () => {
    const response = await getData(baseURLauth + endpoint + '/fetch-key');
    localStorage.setItem("encryptionKey", response.key);
    return response;
};