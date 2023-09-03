import { useLifestages } from '../../api/queries';
import { capitalize } from '../../utils/functions';
import LifestageCard from './LifestageCard';
import Loading from '../../components/Loading';
import Tag from '../../components/Tag';
import './landing.css';

const PreviewSection = ({ section, sort, search, filters }) => {

  const params = {type: section, sort: sort};
  if (search) params['search'] = search;
  if (filters && filters.length) params['soft_skills'] = filters;

  const { data: lifestages, isLoading } = useLifestages(params);

  if (isLoading) return <Loading />

  const experienceEducationSection = (
    <ul className="cards-container">
      {lifestages && lifestages.map(lifestage => (
        <LifestageCard 
          key={lifestage._id}
          lifestage={lifestage} 
        />
      ))}
    </ul>
  );

  const porfolioReadingSection = (
    <ul className="portfolio-reading" >
      {lifestages && lifestages.map(lifestage => (
        <li key={lifestage._id}>
          <a 
            href={lifestage.link}
            className='portfolio-link'
          >
            {lifestage.title}
          </a>
          {` - ${lifestage.description}`}
          <aside className='skill-tag-container projects'>
              {lifestage.hard_skills.slice(0,3).map(skill => (
                  <Tag 
                      key={skill} 
                      disableHover
                  >
                    {skill}
                  </Tag>
              ))}
          </aside>
        </li>
      ))}
    </ul>
  )

  return (
    <section className="cards-section">
      <h2>
        {capitalize(section)}
      </h2>
      {lifestages && lifestages.length 
      ? section == "education" || section == "experience" 
        ? experienceEducationSection
        : porfolioReadingSection
      : 
        <div className="empty-list">
          <h3>
            No {section} results here!
          </h3>
        </div>
      }
    </section>  
  );
};

export default PreviewSection;