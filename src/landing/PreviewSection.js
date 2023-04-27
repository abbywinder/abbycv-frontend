import { useLifestages } from '../api/queries';
import { capitalize } from '../api/utils/functions';
import ErrorBoundary from '../components/ErrorBoundary';
import LifestageCard from './LifestageCard';
import Loading from '../components/Loading';
import { palette } from '../palette';
import './Landing.css';

const PreviewSection = () => {

  const { data: lifestages, isError, onError, isLoading } = useLifestages();

  const sections = ['experience','education'];

  if (isLoading) return <Loading />

  return (
    <section id="preview">
      {sections.map(section => (
        <section key={section} className="cards-section">
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
      ))}

    </section>
  );
};

export default PreviewSection;
