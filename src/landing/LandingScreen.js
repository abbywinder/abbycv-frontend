import { useLifestages } from '../api/queries';
import ErrorBoundary from '../components/ErrorBoundary';
import LifestageButton from '../components/LifestageButton';
import Loading from '../components/Loading';
import './Landing.css';

const LandingScreen = () => {

  const { data: lifestages, isError, onError, isLoading } = useLifestages();

  if (isLoading) return <Loading />

  return (
    <ErrorBoundary hasError={isError}>
      <div className="container">
        <header className="header">
          Abby Winder
        </header>
        <input 
          className="search-bar" 
          type='search' 
          role='search' 
        />
        
        {lifestages && lifestages.map(lifestage => (
          <LifestageButton 
            key={lifestage._id}
            lifestage={lifestage} 
          />
        ))}

      </div>
    </ErrorBoundary>
  );
};

export default LandingScreen;
