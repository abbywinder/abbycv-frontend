import { useLifestages } from '../api/queries';
import ErrorBoundary from '../components/ErrorBoundary';
import PreviewSection from './PreviewSection';
import Tag from '../components/Tag';
import { palette } from '../palette';
import './Landing.css';

const LandingScreen = () => {

  const { isError } = useLifestages();
  
  const placeholderSkills = ['skill 1', 'skill 2', 'skill 3'];
  const sections = ['experience','education'];

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
        
        <section id="preview">
          {sections.map(section => (
            <PreviewSection 
              key={section} 
              section={section} 
            />
          ))}
        </section>
    </ErrorBoundary>
  );
};

export default LandingScreen;
