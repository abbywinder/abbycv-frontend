import { useLifestages } from '../api/queries';
import { capitalize } from '../api/utils/functions';
import ErrorBoundary from '../components/ErrorBoundary';
import LifestageCard from './LifestageCard';
import Loading from '../components/Loading';
import { palette } from '../palette';
import DetailSection from './DetailSection';
import './Landing.css';
import PreviewSection from './PreviewSection';
import Tag from '../components/Tag';

const LandingScreen = () => {

  const { isError } = useLifestages();

  const placeholderSkills = ['skill 1', 'skill 2', 'skill 3'];

  return (
    <ErrorBoundary hasError={isError}>
        <header style={{
          backgroundColor: palette.accent2
        }}>
          <h1>Abby Winder</h1>

          <ul className='filter-tags-container'>
            {placeholderSkills.map((each, i) => (
              <Tag 
                key={each}
                i={i}
                testName="header-filter-tags"
              >
                {each}
              </Tag>
            ))}
          </ul>

          <input 
            className="search-bar" 
            type='search' 
            role='search'
            placeholder='Search CV...'
          />
        </header>

       <PreviewSection />
    </ErrorBoundary>
  );
};

export default LandingScreen;
