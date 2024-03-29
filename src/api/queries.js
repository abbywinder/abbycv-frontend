import { useQuery } from 'react-query';
import { getLifestages, getOneLifestage, getSkills } from './lifestages-api';

const params = {
    staleTime: 1000 * 60 * 5 //5 mins
};

export const useLifestages = query => useQuery(
    ['GET_LIFESTAGES', query],
    getLifestages,
    {
        staleTime: params.staleTime,
        keepPreviousData: true,
    }
);

export const useOneLifestage = query => useQuery(
    ['GET_ONE_LIFESTAGE', query],
    getOneLifestage,
    {
        staleTime: params.staleTime,
        keepPreviousData: true,
    }
);

export const useSkills = () => useQuery(
    ['GET_SKILLS'],
    getSkills,
    {
        staleTime: params.staleTime,
        keepPreviousData: true,
    }
);