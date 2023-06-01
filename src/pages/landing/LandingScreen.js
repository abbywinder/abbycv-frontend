import { useState } from 'react';
import { useLifestages, useSkills } from '../../api/queries';
import ErrorBoundary from '../../components/ErrorBoundary';
import PreviewSection from './PreviewSection';
import { validationErrors, sortOptions, sections } from './constants';
import './landing.css';
import FilterSection from './FilterSection';
import SearchBar from './SearchBar';
import Sort from './Sort';
import Header from '../../components/Header';

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
        <Header />
        <section className='search-container'>
          {skillsLoading || skillsError ? 
            null
            : <FilterSection 
                skills={skills} 
                setSelectedFilterTags={setSelectedFilterTags} 
                selectedFilterTags={selectedFilterTags} 
              />
          }
          
          <SearchBar 
            text={text} 
            handleInput={handleInput}
            validationError={validationError}
          />
        </section>
        
        <section id="preview">
          <Sort
            selectedSort={selectedSort} 
            sortOptions={sortOptions}
            setSelectedSort={setSelectedSort}
          />

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