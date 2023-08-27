import { redirectIfTokenExpired } from "../utils/functions";
import { baseURL, getData } from "./api-methods";
const endpoint = 'lifestages'

export const getLifestages = ({ queryKey: [key, query = ''] }) => {
    redirectIfTokenExpired()
    const encodedQuery = new URLSearchParams(query).toString();
    return getData(baseURL + endpoint + `/?${encodedQuery}`);
};

export const getOneLifestage = ({ queryKey: [key, id] }) => {
    redirectIfTokenExpired()
    return getData(baseURL + endpoint + `/${id}`);
};

export const getSkills = ({ queryKey: [key] }) => {
    redirectIfTokenExpired()
    return getData(baseURL + endpoint + '/skills');
};