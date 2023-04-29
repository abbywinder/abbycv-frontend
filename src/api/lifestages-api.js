import { baseURL, getData } from "./api-methods";

export const getLifestages = ({ queryKey: [key, query] }) => {
    const endpoint = 'lifestages'
    const encodedQuery = new URLSearchParams(query).toString();
    return getData(baseURL + endpoint + `/?${encodedQuery}`);
};