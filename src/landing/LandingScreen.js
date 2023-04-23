import { Suspense, Err } from 'react';
import { useLifestages } from '../api/queries';
import ErrorBoundary from '../components/ErrorBoundary';
import LifestageButton from '../components/LifestageButton';
import Loading from '../components/Loading';
import './Landing.css';

const LandingScreen = () => {

  const { data: lifestages, onError } = useLifestages();

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <div className="container">
          <header className="header">
            Abby Winder
          </header>
          <input 
            type='search' 
            role='search' 
            className="search-bar" 
          />
          
          {lifestages.map(lifestage => (
            <LifestageButton 
              key={lifestage._id}
              lifestage={lifestage} 
            />
          ))}

        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default LandingScreen;
