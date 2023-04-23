import { useQuery } from 'react-query';
import { getLifestages } from './lifestages-api';

const params = {
    staleTime: 1000 * 60 * 5 //5 mins
};

export const useLifestages = () => useQuery(
    ['GET_LIFESTAGES'],
    getLifestages,
    {
        staleTime: params.staleTime,
        keepPreviousData: true
    }
);