import { useLifestages } from '../../api/queries';
import { capitalize } from '../../utils/functions';
import LifestageCard from './LifestageCard';
import Loading from '../../components/Loading';
import './Landing.css';

const PreviewSection = ({section, sort}) => {

  const { data: lifestages, isLoading } = useLifestages({type: section, sort: sort});

  if (isLoading) return <Loading />

  return (
    <section className="cards-section">
      <h2>{capitalize(section)}</h2>
      <ul className="cards-container">
        {lifestages && lifestages.map(lifestage => (
          <LifestageCard 
            key={lifestage._id}
            lifestage={lifestage} 
          />
        ))}
      </ul>
    </section>  
  );
};

export default PreviewSection;
