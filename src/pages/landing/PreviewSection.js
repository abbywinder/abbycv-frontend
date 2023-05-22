import { useLifestages } from '../../api/queries';
import { capitalize } from '../../utils/functions';
import LifestageCard from './LifestageCard';
import Loading from '../../components/Loading';
import './landing.css';

const PreviewSection = ({ section, sort, search, filters }) => {

  const params = {type: section, sort: sort};
  if (search) params['search'] = search;
  if (filters && filters.length) params['soft_skills'] = filters;

  const { data: lifestages, isLoading } = useLifestages(params);

  if (isLoading) return <Loading />

  return (
    <section className="cards-section">
      <h2>{capitalize(section)}</h2>
      {lifestages && lifestages.length ? 
        <ul className="cards-container">
          {lifestages.map(lifestage => (
            <LifestageCard 
              key={lifestage._id}
              lifestage={lifestage} 
            />
          ))}
        </ul>
      : 
        <div className="empty-list">
          <h3>No {section} results here!</h3>
        </div>
      }
    </section>  
  );
};

export default PreviewSection;
