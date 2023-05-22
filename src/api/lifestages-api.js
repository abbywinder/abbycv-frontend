import { baseURL, getData } from "./api-methods";
const endpoint = 'lifestages'

export const getLifestages = ({ queryKey: [key, query] }) => {
    const encodedQuery = new URLSearchParams(query).toString();
    return getData(baseURL + endpoint + `/?${encodedQuery}`);
};

export const getOneLifestage = ({ queryKey: [key, id] }) => {
    return getData(baseURL + endpoint + `/${id}`);
};

export const getSkills = ({ queryKey: [key] }) => {
    return getData(baseURL + endpoint + '/skills');
};