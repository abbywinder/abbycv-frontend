import { useState } from 'react';
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
  const sortOptions = [{
    name: 'yeardesc', 
    label: 'Date descending'
  }, {
    name: 'yearasc', 
    label: 'Date ascending'
  }, {
    name: 'durationdesc', 
    label: 'Duration descending'
  }, {
    name: 'durationasc', 
    label: 'Duration ascending'
  }];

  const [selectedSort, setSelectedSort] = useState('yeardesc');

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
          <div className='sort-container'>
            <label htmlFor="sort">Sort by: </label>
            <select 
              name="sort" 
              id="sort"
              className='sort-container-text'
              value={selectedSort}
              onChange={e => setSelectedSort(e.target.value)}
            >
              {sortOptions.map(option => (
                <option 
                  value={option.name}
                  key={option.name}
                  role='option'
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {sections.map(section => (
            <PreviewSection 
              key={section} 
              section={section}
              sort={selectedSort}
            />
          ))}
        </section>
    </ErrorBoundary>
  );
};

export default LandingScreen;
