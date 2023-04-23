import { baseURL, getData } from "./api-methods";

export const getLifestages = ({ queryKey: [key] }) => {
    const endpoint = 'lifestages'
    return getData(baseURL + endpoint);
};