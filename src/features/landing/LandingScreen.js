import { useState } from 'react';
import { useLifestages, useSkills } from '../../api/queries';
import ErrorBoundary from '../../components/ErrorBoundary';
import PreviewSection from './PreviewSection';
import Tag from '../../components/Tag';
import { palette } from '../../palette';
import { validationErrors, sortOptions, sections } from './constants';
import './Landing.css';

const LandingScreen = () => {

  const { isError } = useLifestages();
  
  const { data: skills, isLoading: skillsLoading, isError: skillsError } = useSkills();

  const [selectedSort, setSelectedSort] = useState('yeardesc');
  const [text, onChangeText] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [selectedFilterTags, setSelectedFilterTags] = useState([]);

  const handleInput = input => {
    const regex = /^[A-Za-z0-9 ._~()'!*:@,;+?-]*$/;
    if (regex.test(input) && input.length <= 100) {
      onChangeText(input)
      setValidationError(null);
    } else {
      setValidationError(regex.test(input) ? validationErrors.tooLong : validationErrors.bad);
    };
  };

  return (
    <ErrorBoundary hasError={isError}>
        <header style={{
          backgroundColor: palette.accent2
        }}>
          <h1>Abby Winder</h1>

          {skillsLoading || skillsError ? 
            null
            : <ul className='filter-tags-container'>
              {skills.map((each, i) => (
                <Tag 
                  key={each._id}
                  i={i}
                  testName="header-filter-tags"
                  handleClick={() => setSelectedFilterTags(prev => prev.includes(each._id) ? prev.filter(e => e !== each._id) : [...prev, each._id])}
                  selected={selectedFilterTags.includes(each._id)}
                >
                  {each._id}
                </Tag>
              ))}
            </ul>
          }
          
          <div className='search-bar'>
            <input
              id='search-bar'
              className='search-bar'
              type='text' 
              role='search'
              placeholder='Search CV...'
              value={text}
              autoComplete='true'
              onChange={e => handleInput(e.target.value)}
            />
            {validationError ?
              <aside className='search-validation-text'>
                <span>
                  {validationError}
                </span>
              </aside>
            : null}
          </div>
        </header>
        
        <section id="preview">
          <div className='sort-container'>
            <label htmlFor="sort">Sort by: </label>
            <select 
              name="sort" 
              id="sort"
              data-testid="sort-dropdown"
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
              search={text}
              filters={selectedFilterTags}
            />
          ))}
        </section>
    </ErrorBoundary>
  );
};

export default LandingScreen;